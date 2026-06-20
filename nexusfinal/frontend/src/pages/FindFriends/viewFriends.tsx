import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar1 from "../Profile/Navbar1";
import "./viewFriends.css";

interface Friend {
  requestId: string;
  friendshipWith: {
    _id: string;
    name: string;
    email: string;
  };
}

const ViewFriends: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFriends = async () => {
      const stored = localStorage.getItem("currentStudent");
      if (!stored) {
        navigate("/");
        return;
      }

      const email = JSON.parse(stored).email;

      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/friendrequests/by-email/${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch friends");
        setFriends(data.data || []);
        setError("");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching friends");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [navigate, location.state]);

  const goToProfile = async (friend: any) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/profiles/by-email?email=${encodeURIComponent(friend.email)}`
      );
      const data = await res.json();
      const profile = data._doc ? data._doc : data; 

      if (!profile?._id) throw new Error("Profile id not found");
      navigate(`/view-added-friend/${profile._id}`);
    } catch {
      alert("Cannot open profile at this moment.");
    }
  };

  const initials = (name?: string) =>
    !name ? "?" : name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  if (loading)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="vf-root"><p className="vf-loading">Loading friends…</p></div>
      </>
    );


  if (error)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="vf-root"><p className="vf-error">{error}</p></div>
      </>
    );

  if (!friends.length)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="vf-root"><p className="vf-empty">No friends found.</p></div>
      </>
    );

  return (
    <>
      <Navbar1 onLogout={onLogout} />
      <div className="vf-root">

      <div className="vf-grid">
        {friends.filter((f) => f.friendshipWith).map((f) => (

          <article
            key={f.requestId}
            className="vf-card"
            onClick={() => goToProfile(f.friendshipWith)}
            role="button"
            tabIndex={0}
          >
            <div className="vf-avatar">
              {initials(f.friendshipWith.name)}
            </div>

            <div className="vf-body">
              <h3 className="vf-name">{f.friendshipWith.name}</h3>
              <p className="vf-email">{f.friendshipWith.email}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
    </>
  );
};

export default ViewFriends;
