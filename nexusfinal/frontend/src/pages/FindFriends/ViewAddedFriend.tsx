import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar1 from "../Profile/Navbar1";
import "./view-added-friend.css";

type FriendProfile = {
  _id: string;
  studentID?: string;
  name: string;
  email?: string;
  bio?: string;
  department?: string;
  contactInfo?: string;
  interests?: string;
  student?: {
    _id: string;
    role?: string;
  };
};

const ViewAddedFriend: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {

  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- FETCH PROFILE ---
  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      if (!id) throw new Error("Invalid profile id");

      const res = await fetch(`http://localhost:5000/api/profiles/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error fetching profile");
      }

      const data = await res.json();
      setProfile(data._doc ? data._doc : data);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Network error");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const goToChat = () => navigate("/chat");

  // --- REMOVE FRIEND ---
  const removeFriend = async () => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      const stored = localStorage.getItem("currentStudent");
      let myId: string | undefined = stored
        ? JSON.parse(stored)._id || JSON.parse(stored).id
        : profile?.student?._id;

      const friendId = profile?.student?._id;
      if (!myId || !friendId) throw new Error("IDs not found");

      const response = await fetch(
        `http://localhost:5000/api/friendrequests/remove/${friendId}/${myId}`,
        { method: "DELETE" }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Failed to remove friend");

      // Show success notification
      alert("Friend removed successfully");
      
      // Navigate to view all friends page
      navigate("/viewFriends", { replace: false, state: { refresh: Date.now() } });

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error removing friend");
    }
  };

  // --- LOADING / ERROR / NOT FOUND ---
  if (loading)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="message-box loading-box">
          <p>Loading profile...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="message-box error-box">
          <p>{error}</p>
        </div>
      </>
    );

  if (!profile)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="message-box info-box">
          <p>Profile not found.</p>
        </div>
      </>
    );

  const interestList =
    profile.interests?.split(",").map((i) => i.trim()) || [];

  return (
    <>
      <Navbar1 onLogout={onLogout} />
      <div className="view-added-wrapper">
        {/* Clouds */}
        <div className="floating-cloud cloud1">☁️</div>
        <div className="floating-cloud cloud2">☁️</div>
        <div className="floating-cloud cloud3">☁️</div>

        {/* Stars */}
        <div className="floating-star star1">✦</div>
        <div className="floating-star star2">✦</div>
        <div className="floating-star star3">✦</div>

        {/* Main Card */}
        <div className="view-added-friend-container">
        <h2>{profile.name || profile.student?._id}</h2>

        <div className="profile-info">
          <p><strong>Student ID:</strong> {profile.studentID || profile.student?._id || "—"}</p>
          <p><strong>Email:</strong> {profile.email || "—"}</p>
          <p><strong>Bio:</strong> {profile.bio || "—"}</p>

          {interestList.length > 0 && (
            <p>
              <strong>Interests:</strong>{" "}
              {interestList.map((i, idx) => (
                <span key={idx} className="interests-badge">{i}</span>
              ))}
            </p>
          )}

          <p><strong>Department:</strong> {profile.department || "—"}</p>
          <p><strong>Role:</strong> {profile.student?.role || "—"}</p>
        </div>

        <div className="button-row">
          <button className="chat-button" onClick={goToChat}>Go to Chat</button>
          <button className="remove-button" onClick={removeFriend}>Remove Friend</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ViewAddedFriend;
