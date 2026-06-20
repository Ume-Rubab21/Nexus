import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../Profile/Student";

import { simpleEncrypt } from "../../utils/SimpleEncryption";

type LoginProps = {
  onLogin?: (student?: Student) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const navigate = useNavigate();

  const safeOnLogin = onLogin ?? (() => {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const encryptedPassword = simpleEncrypt(password);

      const response = await fetch("http://localhost:5000/api/registered/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: encryptedPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        if (data.student) localStorage.setItem("currentStudent", JSON.stringify(data.student));
        safeOnLogin(data.student ?? undefined);
        navigate("/profile");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }

    try {
      const encryptedPassword = simpleEncrypt(newPassword);

      const response = await fetch("http://localhost:5000/api/registered/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, password: encryptedPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setForgotSuccess("Password updated successfully!");
        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowForgotPassword(false), 1500);
      } else {
        setForgotError(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      setForgotError("Network error");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 420, margin: "40px auto" }}>
      {!showForgotPassword ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", marginBottom: 10, padding: 10, width: "100%", border: "1px solid #ccc", borderRadius: 5 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", marginBottom: 10, padding: 10, width: "100%", border: "1px solid #ccc", borderRadius: 5 }}
            />
            <button type="submit" style={{ padding: 10, width: "100%", background: "#007bff", color: "white", border: "none", borderRadius: 5 }}>
              Login
            </button>
          </form>
          <button 
            type="button" 
            onClick={() => navigate("/create_profile")} 
            style={{ padding: 10, width: "100%", marginTop: 10, background: "#F7AEF8", color: "white", border: "none", borderRadius: 5 }}
          >
            Create Profile
          </button>
          <button 
            type="button" 
            onClick={() => setShowForgotPassword(true)} 
            style={{ padding: 10, width: "100%", marginTop: 10, background: "#72DDF7", color: "black", border: "none", borderRadius: 5 }}
          >
            Forgot Password
          </button>
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </>
      ) : (
        <>
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              style={{ display: "block", marginBottom: 10, padding: 10, width: "100%", border: "1px solid #ccc", borderRadius: 5 }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ display: "block", marginBottom: 10, padding: 10, width: "100%", border: "1px solid #ccc", borderRadius: 5 }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ display: "block", marginBottom: 10, padding: 10, width: "100%", border: "1px solid #ccc", borderRadius: 5 }}
            />
            <button type="submit" style={{ padding: 10, width: "100%", background: "#28a745", color: "white", border: "none", borderRadius: 5 }}>
              Update Password
            </button>
          </form>
          <button 
            type="button" 
            onClick={() => setShowForgotPassword(false)} 
            style={{ padding: 10, width: "100%", marginTop: 10, background: "#6c757d", color: "white", border: "none", borderRadius: 5 }}
          >
            Back to Login
          </button>
          {forgotError && <p style={{ color: "red", marginTop: 10 }}>{forgotError}</p>}
          {forgotSuccess && <p style={{ color: "green", marginTop: 10 }}>{forgotSuccess}</p>}
        </>
      )}
    </div>
  );
};

export default Login;
