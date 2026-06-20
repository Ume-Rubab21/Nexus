import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar1.css";

const Navbar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {

  const navigate = useNavigate();
  const [showFriendOptions, setShowFriendOptions] = useState(false);

  const toggleFriendOptions = () =>
    setShowFriendOptions((prev) => !prev);

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("currentStudent");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    
    // Call onLogout callback if provided (to update parent state)
    onLogout?.();
    
    // Force navigation to login page with full page reload to ensure clean state
    window.location.replace("/login");
  };


  return (
    <nav className="full-nav">
      <div className="nav-left brand-nexus">NEXUS</div>

      <div className="nav-items">
        <button onClick={() => navigate("/Profile")}>🏡 Home</button>
        <button onClick={() => navigate("/find-friends")}>🔍 Find Friends</button>

        <div className="nav-manage-wrapper">
          <button onClick={toggleFriendOptions}>👥 Manage</button>

          {showFriendOptions && (
            <div className="nav-dropdown">
              <button onClick={() => navigate("/viewFriends")}>View All Friends</button>
              <button onClick={() => navigate("/sent-requests")}>Sent Requests</button>
              <button onClick={() => navigate("/received-requests")}>
                Received Requests
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate("/chat")}>💬 Chat</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
