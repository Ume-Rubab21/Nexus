import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar1 from "../Profile/Navbar1";
import "./view-profile.css";

type Profile = {
  _id: string;
  name: string;
  email?: string;
  studentID?: string;
  bio?: string;
  department?: string;
  contactInfo?: string;
  interests?: string;
  student?: {
    _id: string;
    email?: string;
    role?: string;
  };
};

type ViewProfileProps = {
  onLogout?: () => void;
};

const ViewProfile: React.FC<ViewProfileProps> = ({ onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [relation, setRelation] = useState<
    "Friends" | "Sent" | "Received" | "No Relation" | "Loading"
  >("Loading");

  const [senderEmail, setSenderEmail] = useState("");
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentStudent");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSenderEmail(parsed.email || parsed.student?.email || "");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profiles/${id}`);
        const raw = await res.json();
        const data = raw._doc ? raw._doc : raw;
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const checkRelation = async () => {
      if (!profile || !senderEmail) return;

      const email2 = profile.email || profile.student?.email;
      if (!email2) {
        setRelation("No Relation");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/friendrequests/relation?email1=${senderEmail}&email2=${email2}`
        );
        const data = await res.json();
        setRelation(data.relation || "No Relation");

        if (data.relation === "Sent") {
          const sent = await fetch(
            `http://localhost:5000/api/friendrequests/sent?email=${encodeURIComponent(
              senderEmail
            )}`
          );
          const json = await sent.json();
          const match = json.data.find(
            (r: any) =>
              r.receiver.email.toLowerCase() === email2.toLowerCase()
          );
          if (match) setRequestId(match._id);
        }

        if (data.relation === "Received") {
          const rec = await fetch(
            `http://localhost:5000/api/friendrequests/received?email=${encodeURIComponent(
              senderEmail
            )}`
          );
          const json = await rec.json();
          const match = json.data.find(
            (r: any) =>
              r.sender.email.toLowerCase() === email2.toLowerCase()
          );
          if (match) setRequestId(match._id);
        }
      } catch {
        setRelation("No Relation");
      }
    };

    checkRelation();
  }, [profile, senderEmail]);

  const sendRequest = async () => {
    if (!profile) return;

    const receiverEmail = profile.email || profile.student?.email;
    if (!receiverEmail) return;

    try {
      const res = await fetch("http://localhost:5000/api/friendrequests/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail,
          receiverEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setRequestId(data.request?._id || "");
      setRelation("Sent");
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRequest = async () => {
    if (!window.confirm("Cancel friend request?")) return;

    await fetch(
      `http://localhost:5000/api/friendrequests/cancel/${requestId}`,
      { method: "DELETE" }
    );

    setRelation("No Relation");
  };

  const acceptRequest = async () => {
    await fetch("http://localhost:5000/api/friendrequests/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: requestId, idType: "_id", action: "Accept" }),
    });
    setRelation("Friends");
  };

  const rejectRequest = async () => {
    await fetch("http://localhost:5000/api/friendrequests/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: requestId, idType: "_id", action: "Reject" }),
    });
    setRelation("No Relation");
  };

  const removeFriend = async () => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      const stored = JSON.parse(localStorage.getItem("currentStudent") || "{}");
      const myId = stored.id || stored._id;
      const friendId = profile?.student?._id;

      if (!myId || !friendId) {
        alert("Error: IDs not found");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/friendrequests/remove/${friendId}/${myId}`,
        { method: "DELETE" }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove friend");
      }

      // Show success notification
      alert("Friend removed successfully");
      
      // Redirect to view all friends page with state to force refresh
      navigate("/viewFriends", { replace: false, state: { refresh: Date.now() } });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error removing friend");
    }
  };

  const goToChat = () => navigate("/chat");

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (!profile) return <p>Profile not found</p>;

  const interestList =
    profile.interests?.split(",").map((i) => i.trim()) || [];

  return (
    <>
      <Navbar1 onLogout={onLogout} />
      <div className="view-profile-wrapper">

        {/* Floating clouds */}
        <div className="floating-cloud cloud1">☁️</div>
        <div className="floating-cloud cloud2">☁️</div>
        <div className="floating-cloud cloud3">☁️</div>

        <div className="view-profile-container">
        <h2>{profile.name}</h2>

        <div className="view-avatar">
          {profile.name?.[0] || "?"}
        </div>

        <div className="profile-info">

          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Student ID:</strong> {profile.studentID || "—"}</p>
          <p><strong>Email:</strong> {profile.email || "—"}</p>
          <p><strong>Department:</strong> {profile.department || "—"}</p>
          <p><strong>Bio:</strong> {profile.bio || "—"}</p>
          <p><strong>Contact:</strong> {profile.contactInfo || "—"}</p>

          <strong>Interests:</strong>
          <div className="interests-list">
            {interestList.length > 0 ? interestList.map((i, idx) => (
              <span key={idx} className="badge">{i}</span>
            )) : "—"}
          </div>
        </div>

        <div className="relation-buttons">
          {relation === "Friends" && (
            <>
              <button className="btn chat" onClick={goToChat}>Chat</button>
              <button className="btn remove" onClick={removeFriend}> Remove Friend</button>
            </>
          )}

          {relation === "Sent" && (
            <button className="btn cancel" onClick={cancelRequest}>Cancel Request</button>
          )}

          {relation === "Received" && (
            <>
              <button className="btn accept" onClick={acceptRequest}>Accept</button>
              <button className="btn reject" onClick={rejectRequest}>Reject</button>
            </>
          )}

          {relation === "No Relation" && (
            <button className="btn add" onClick={sendRequest}> Send Friend Request</button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ViewProfile;
