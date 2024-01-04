import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../common/setupEnv.ts';

//Delete this line once you use the function
// @ts-ignore
async function doesUserExist(email: string): Promise<boolean> {
  /**
   * Check if user exists in the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    return true;
  }
  return false;
}
// Delete this line once you use the function
// @ts-ignore
async function getUser(email: string) {
  /**
   * Get user from the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
}

//@ts-ignore
async function createUser(name: string, email: string, password: string) {
  /**
   * Create user in the database
   * Potentially throws an error from Prisma
   * @param name string - name of the user
   * @param email string - email of the user
   * @param password string - password of the user
   */
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
  return newUser;
}


export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // check if parameters are input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }
  // check for server error
  try {
    // check if user already exists
    const userExists = await doesUserExist(email);
    if (userExists) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // encrypt password
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Password hash failed' });
      }
      // create a new user
      const newUser = await createUser(name, email, hashedPassword);

      // initialize payload
      const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        canPostEvents: true, // true for now, not sure what to do with it
        isAdmin: false, // false for now, not sure what to do with it
      };

      // create JWT token with payload
      const token = jwt.sign(payload, env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

      // successful user creation response
      return res.status(201).json({ token });
    });
  } catch (error) {
    // server error response
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
  // nothing returns try structure (which should never happen)
  return;
  //return res.status(500).json({ error: 'Unknown error' });
};


//login function for api route
export const login = async (req: Request, res: Response) => {
  //from body of request get email and password
  const email = req.body.email;
  const password = req.body.password;

  //error if no email or password field is given in body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and/or Password Field not In Header' });
    return;
  }

  //error if input parameters are blank
  if (email === '' || password === '') {
    res.status(400).json({ error: "A Body Field's Value is Empty" });
    return;
  }

  //try connect to the database
  try {
    // Assuming you have a prisma client named `prisma`
    await prisma.$connect();

    //manage the case prisma throws an error
    try {
      //check if users exists
      if (await doesUserExist(email)) {
        //manage the case prisma throws an error
        try {
          //get a user object from database
          const user = await getUser(email);

          //if get user does not return a user
          if (!user) {
            res.status(500).json({ error: 'User details cannot be obtained from the database' });
            return;
          }

          //if the user exists get their password
          const db_password = user.password;

          //return error if password is null
          if (db_password === null) {
            res.status(500).json({ error: 'Password value in database is invalid (none type)' });
            return;
          }

          //compare the parameter's login password to db's stored password
          bcrypt.compare(password, db_password, async (err, result) => {
            //return error if error occurs during bcrypt
            if (err) {
              res.status(500).json({ error: 'Password Check Failed' });
              return;

              //if password is correct
            } else if (result) {
              //get key from .env
              const secretKey = env.JWT_TOKEN_SECRET;
              const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                canPostEvents: true,
                isAdmin: false,
              };
              //create a token
              const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

              //return token and send success http code
              res.status(200).json({ token });
              return;

              //if the password is incorrect return error code
            } else {
              res.status(401).json({ error: 'User Credentials incorrect' });
              return;
            }
          });
          //if prisma throws an error in getUser
        } catch (error) {
          res.status(500).json({ error: 'Prisma could not query database ' });
          return;
        }

        // if user not found in the database (from doesUserExist) return error
      } else {
        res.status(404).json({ error: 'User email not found in the database' });
        return;
      }

      // catch error is prisma throws one for doesUserExist
    } catch (error) {
      res.status(500).json({ error: 'Prisma could not query database' });
      return;
    }

    //catch error if database connection fails
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
};
