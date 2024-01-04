// Certain lines of code were built around LLM assistance
import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { UserAddOutlined } from "@ant-design/icons";
import { API_URL } from "../../common/constants";

const { Title } = Typography;

const SignUp = () => {
  // create 3 hooks for managing user inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // creating authContext hook for handling authorization
  const { updateAuthToken, isAuthenticated, clearAuthState } = useAuth();

  // Checks for valid name, email, password
  const validateFields = () => {
    if (!name.trim()) {
      message.error("Invalid username");
      return false;
    }
    if (!email.includes("@")) {
      message.error("Invalid email address");
      return false;
    }
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      message.error(
        "Invalid password. Must be greater than 8 characters and include a number and an uppercase letter"
      );
      return false;
    }
    return true;
  };

  // Form submission handling
  const handleSubmit = async () => {
    if (!validateFields()) {
      // if user fields are invalid, exit
      return;
    }
    try {
      // signup API POST request
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      // error handling
      if (!response.ok) {
        if (response.status === 409) {
          message.error("Email already exists");
        } else {
          message.error("Error: " + response.status);
        }
        return;
      }
      message.success("Signup successful");
      //check if user is already logged in and sign them out otherwise
      if (isAuthenticated()) {
        clearAuthState();
      }
      console.log(response);
      // redirects to login page
      router.push("/login");
    } catch (error) {
      // catches any unknown errors during redirection
      message.error("Unknown Error");
    }
  };

  return (
    // Talked to James about not needing comments for this return section
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#eaf7f0",
      }}
    >
      <Card
        style={{
          width: "30%",
          maxWidth: "100%",
          boxShadow: " rgba(0,0,0, 0.15) 0px 2px 8px",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            color: "#455A64",
            marginBottom: "15px",
          }}
        >
          Sign Up
        </Title>
        <div style={{ margin: "5px" }}>
          <div style={{ marginBottom: "5px", color: "#455A64" }}>Name</div>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <div style={{ marginBottom: "5px", color: "#455A64" }}>
            Email Address
          </div>
          <Input
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <div style={{ marginBottom: "5px", color: "#455A64" }}>Password</div>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            style={{ marginBottom: "40px" }}
          />
          <Button
            type="primary"
            block
            onClick={handleSubmit}
            style={{
              backgroundColor: "rgb(102, 187, 106)",
              borderColor: "rgb(102, 187, 106)",
              marginBottom: "15px",
            }}
          >
            <UserAddOutlined /> Sign Up
          </Button>
        </div>
        <Button
          type="link"
          onClick={() => router.push("/")}
          style={{ color: "#439847", fontWeight: 550 }}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default SignUp;