import React, { useState } from "react";
import "../styling/Auth.css";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";

const Auth = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();

      if (res.ok) {
        alert(`Signup successful, ${signupData.username}`);
        window.location.href = "/";
      } else {
        alert("Signup failed: " + data.error);
      }
    } catch (err) {
      console.error("❌ Signup failed:", err);
      alert("Server error. Check backend is running.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // To send cookie
        body: JSON.stringify(loginData),
      });

      const text = await res.text();

      if (res.ok && text !== "You can't login") {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert("Login failed: " + text);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Server error. Check backend is running.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div
        className={`auth-container ${
          isRightPanelActive ? "auth-right-panel-active" : ""
        }`}
        id="auth-container"
      >
        <div className="auth-form-container auth-sign-up-container">
          <form onSubmit={handleSignupSubmit}>
            <h1>Create Account</h1>
            <div className="auth-social-container">
              <a href="#" className="auth-social">
                <FaFacebookF />
              </a>
              <a href="#" className="auth-social">
                <FaGooglePlusG />
              </a>
              <a href="#" className="auth-social">
                <FaLinkedinIn />
              </a>
            </div>

            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              className="input"
              value={signupData.username}
              name="username"
              onChange={handleSignupChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="input"
              name="email"
              value={signupData.email}
              autoComplete="new-email"
              onChange={handleSignupChange}
            />
            <input
              type="tel"
              placeholder="+91-XXXXXXXXXX"
              className="input"
              value={signupData.phone}
              name="phone"
              onChange={handleSignupChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              autoComplete="new-password"
            />

            <button className="auth-button">Sign Up</button>
          </form>
        </div>

        <div className="auth-form-container auth-sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign in</h1>
            <div className="auth-social-container">
              <a href="#" className="auth-social">
                <FaFacebookF />
              </a>
              <a href="#" className="auth-social">
                <FaGooglePlusG />
              </a>
              <a href="#" className="auth-social">
                <FaLinkedinIn />
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              className="input"
              name="email"
              autoComplete="new-email"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              name="password"
              autoComplete="new-password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button className="auth-button">Sign In</button>
            <a href="#" className="auth-link">
              Forgot your password?
            </a>
          </form>
        </div>

        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="auth-button auth-ghost"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button
                className="auth-button auth-ghost"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
