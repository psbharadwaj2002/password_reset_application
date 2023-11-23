import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPasswordRequest = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/reset-password/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || "Error sending reset email");
    }
  };

  const handleResetPasswordVerify = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/reset-password/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resetToken, newPassword }),
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || "Error resetting password");
    }
  };

  return (
    <div>
      <h1>Password Reset</h1>
      <div>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleResetPasswordRequest}>
            Send Reset Email
          </Button>
        </Form>
      </div>
      <div>
        <Form>
          <Form.Group controlId="formResetToken">
            <Form.Label>Reset Token:</Form.Label>
            <Form.Control
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formNewPassword">
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleResetPasswordVerify}>
            Reset Password
          </Button>
        </Form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
