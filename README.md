# DS209 Course Project: Spark Bites

Spark Bites is a platform for Boston University students and faculty members to post events that provide foods or snacks. The aim is to reduce food waste resulting from over-purchasing for events and at the same time, help students access free food.

## Installation Guide

### Client
Navigate to client folder, and run `npm install` to install all dependencies. Then, run `npm run dev` to start the development server.

### Server
Navigate to server folder, and run `npm install` to install all dependencies. Then, run `npm run dev` to start the development server.

You need to create a `.env` file before you start the API or the database. Create a file called `.env` in the server folder, and add the following lines:
```
POSTGRES_PASSWORD=password
POSTGRES_USER=postgres
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
JWT_TOKEN_SECRET=asupersecretthing
```

You also need to setup the database, run `docker compose up -d` to start the database server.

You must use run the database migrate script to setup the database tables. Run `npx prisma migrate deploy` to setup the 
database tables.

Now you are ready to start the server: `npm run dev`. Will start the server, it will also auto-reload when you make changes.
## Features

1. **Signup & Login:** Users can register and select their event preferences. Upon successful login, a JWT token is provided for authentication.
   
2. **Profile:** [Not completed] Users can view and edit their profiles, and see the events they've posted.
   
3. **Events:** [Not completed] Displays all available events. Users can filter these events based on tags.
   
4. **Create Events:** [Not completed] Authorized users, approved by admins, can post events and add associated images.

## Technologies & Frameworks

- **Frontend:** Next.js (TypeScript)
- **Backend:** Express.js (TypeScript)
- **Authentication:** JSON Web Token (JWT) and bcrypt for password encryption.
- **Database:** Users can also use `docker-compose.yml` to set up a local PostgreSQL container.
- **Hosting:** Currently undecided for client-side, but considering Netlify.
- **CI/CD:** GitHub Actions (setup in progress).

## Directory Structure

- `/client`: Holds all client-side code
    - `/client/src/common`: Contains frequently used files like constants or interfaces.
    - `/client/src/components`: Currently holds the loading components, more components like navbar can be added.
    - `/client/src/contexts/AuthContext.tsx`: Wrapper around `_app.tsx` to manage authentication context.
    - `/client/src/pages`: Contains all frontend pages.
    
- `/server`: Contains all server-side code
  - `/server/server.ts` contains the code to start the server.
  - `/server/app` contains the majority of the code for the server.
    - Each folder in `/server/app` contains the code for a specific feature.

