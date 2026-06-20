import React, { useEffect, useState } from "react";
import "./ChatSidebar.css";

interface Friend {
  requestId: string;
  friendshipWith: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Props {
  onSelectFriend: (email: string) => void;
  userEmail: string;
  activeFriend?: string;
}

const ChatSidebar: React.FC<Props> = ({ onSelectFriend, userEmail, activeFriend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userEmail) return;

      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `http://localhost:5000/api/friendrequests/by-email/${userEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setFriends(data.data || []);
      setLoading(false);
    };

    fetchFriends();
  }, [userEmail]);

  return (
    <div className="chat-sidebar">
      <h3 className="sidebar-title">Friends</h3>

      {loading && <p>Loading...</p>}

      {friends.map((friend) => {
        const email = friend.friendshipWith.email;

        return (
          <button
            key={friend.requestId}
            className={`friend-btn ${activeFriend === email ? "active" : ""}`}
            onClick={() => onSelectFriend(email)}
          >
            <strong>{friend.friendshipWith.name}</strong>
            <span className="email">{email}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ChatSidebar;
