import React, { useEffect, useState } from "react";
import logo from "../assets/medi.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styling/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/verify", {
          method: "GET",
          credentials: "include", // send cookies
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
        else setUser(null);
      } catch (err) {
        console.error("User fetch failed", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <img src={logo} className="logo" alt="logo" />
      <div className="navigation">
        <Link to="/">Home</Link>
        <Link to="/guide">Med Guide</Link>
        <Link to="/reminder">Reminders</Link>

        <div
          className="user-icon-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FaUserCircle
            size={40}
            color="#03045e"
            style={{ cursor: "pointer" }}
          />

          {showDropdown && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <div className="dropdown-item1">👋 Hi, {user}</div>
                  <hr></hr>
                  <div
                    className="dropdown-item"
                    onClick={() => navigate("/reminder")}
                  >
                    My Reminders
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="dropdown-item"
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => navigate("/reminder")}
                  >
                    My Reminders
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
