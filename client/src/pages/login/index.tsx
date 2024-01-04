import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button, message, Space } from "antd";
import {
  HomeOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { AuthContext, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { API_URL } from "../../common/constants";

const Login = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputStatus, setInputStatus] = useState<
    "" | "warning" | "error" | undefined
  >("");

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const { updateAuthToken, isAuthenticated } = useAuth();

  // on page load check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("../protected");
    }
  }, [isAuthenticated, router]);

  // handle click function for when log in button is pressed
  const handleClick = async () => {
    // if email or password are not filled in tell client
    if (!email || !password) {
      message.error("Please fill in all the fields correctly");
    } else if (!email.includes("@")) {
      message.error("Invalid email address");
      return false;
    } else {
      // try to fetch backend api
      try {
        const response = await fetch(`${API_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        // check for errors and return appropriate response depending on error
        if (!response.ok) {
          if (response.status === 404) {
            message.error("User not found");
            setInputStatus("error");
          } else if (response.status === 401) {
            message.error("Incorrect password");
            setInputStatus("error");
          } else {
            message.error("Unknown login error occurred");
            setInputStatus("error");
          }
          return;
        }

        // if status is 200 update the token and redirect client to protected page
        const data = await response.json();
        setInputStatus("");
        updateAuthToken(data.token);
        message.success("Login successful");
        router.push("../protected");
        // catch other errors
      } catch (error) {
        console.error(error);
        message.error("Unknown error occurred");
        setInputStatus("error");
      }
    }
  };

  return (
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
          boxShadow: " rgba(0,0,0, 0.15) 0px 2px 8px",
        }}
        bodyStyle={{
          fontSize: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            color: "rgb(69, 90, 100)",
            marginBottom: "0px",
          }}
        >
          Log In
        </Typography.Title>
        <div style={{ margin: "20px" }}>
          <Typography.Text
            style={{ marginBottom: "5px", color: "rgb(69, 90, 100)" }}
          >
            Email Address
          </Typography.Text>
          <Input
            style={{ marginBottom: "20px", marginTop: "5px" }}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.length == 0) {
                setEmailMessage("Email is required");
              } else {
                setEmailMessage("");
              }
            }}
            status={inputStatus}
          />
          <Space size={0.5} direction="vertical">
            <Typography.Text type="danger">{emailMessage}</Typography.Text>
            <Typography.Text
              style={{ marginBottom: "5px", color: "rgb(69, 90, 100)" }}
            >
              Password
            </Typography.Text>
          </Space>
          <Input.Password
            placeholder="Password"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            style={{ marginBottom: "20px", marginTop: "5px" }}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.length == 0) {
                setPasswordMessage("Password is required");
              } else {
                setPasswordMessage("");
              }
            }}
            status={inputStatus}
          />
          <Typography.Text type="danger">{passwordMessage}</Typography.Text>
          <Button
            icon={<HomeOutlined />}
            style={{
              backgroundColor: "#66BB6A",
              border: "none",
              color: "white",
              fontSize: "14px",
              textAlign: "center",
              justifyContent: "center",
              width: "100%",
            }}
            onClick={handleClick}
          >
            Log In
          </Button>
        </div>

        <Button
          type="link"
          style={{
            color: "#439847",
            fontWeight: 550,
          }}
          href="/"
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default Login;
