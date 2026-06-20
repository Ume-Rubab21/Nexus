import React from "react";
import Navbar1 from "../Profile/Navbar1";
import "./NoFriendsFound.css";

type NoFriendFoundProps = {
  onLogout?: () => void;
};

const NoFriendFound: React.FC<NoFriendFoundProps> = ({ onLogout }) => {
  return (
    <>
      <Navbar1 onLogout={onLogout} />
      <div className="nf-wrapper">
        <div className="nf-box">
          <div className="nf-emoji">👥</div>
          <h3 className="nf-title">No Friends Yet</h3>
          <p className="nf-subtitle">Start connecting with people and build your network!</p>
        </div>
      </div>
    </>
  );
};

export default NoFriendFound;
