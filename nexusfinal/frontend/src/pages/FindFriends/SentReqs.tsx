import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "../Profile/Navbar1";
import "./sent-req.css";

type FriendRequest = {
  _id: string;
  receiver: { name: string; email: string; department?: string };
  status: string;
};

type SentReqsProps = {
  onLogout?: () => void;
};

const SentReqs: React.FC<SentReqsProps> = ({ onLogout }) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSentRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const storedStudent = localStorage.getItem("currentStudent");
        const currentEmail = storedStudent ? JSON.parse(storedStudent).email : "";

        if (!currentEmail) {
          setError("No logged-in user found");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/friendrequests/sent?email=${encodeURIComponent(currentEmail)}`
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch sent requests");

        setRequests(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  const cancelRequest = async (id: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this friend request?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:5000/api/friendrequests/cancel/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel request");

      alert(data.message);
      setRequests(requests.filter(r => r._id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error cancelling request");
    }
  };

  const goToProfile = (email: string) => {
    navigate(`/view-profile/${encodeURIComponent(email)}`);
  };

  if (loading)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <p className="loading-text">Loading sent requests...</p>
      </>
    );
  
  if (error)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <p className="error-text">{error}</p>
      </>
    );
  
  if (!requests.length)
    return (
      <>
        <Navbar1 onLogout={onLogout} />
        <div className="sent-requests-container">
          <h2>Sent Friend Requests</h2>
          <div 
            className="no-requests-box"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '100px 60px',
              textAlign: 'center',
              minHeight: '550px',
              background: 'linear-gradient(135deg, #F7AEF8 0%, #E9A5FF 25%, #B388EB 50%, #8093F1 75%, #72DDF7 100%)',
              borderRadius: '32px',
              boxShadow: '0 25px 80px rgba(247, 174, 248, 0.4), 0 10px 40px rgba(179, 136, 235, 0.3), 0 5px 20px rgba(128, 147, 241, 0.2)',
              margin: '30px 0',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div 
              style={{
                fontSize: '120px',
                marginBottom: '40px',
                opacity: 1,
                filter: 'drop-shadow(0 8px 16px rgba(247, 174, 248, 0.5)) drop-shadow(0 4px 8px rgba(179, 136, 235, 0.4))',
                display: 'inline-block',
                lineHeight: 1
              }}
            >
              📤
            </div>
            <h2 
              style={{
                fontSize: '42px',
                fontWeight: 800,
                margin: '0 0 20px 0',
                background: 'linear-gradient(135deg, #ffffff 0%, #F7AEF8 30%, #B388EB 60%, #8093F1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px',
                color: 'transparent'
              }}
            >
              Sent Friend Requests
            </h2>
            <p 
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: '0 0 20px 0',
                maxWidth: '550px',
                lineHeight: 1.8,
                fontWeight: 500,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.3px'
              }}
            >
              No requests found.
            </p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar1 onLogout={onLogout} />
      <div className="sent-requests-container">
        <h2>Sent Friend Requests</h2>
        <div className="requests-list">
        {requests.map((req) => (
          <div className="request-card" key={req._id}>
            <p>
              <strong>Name:</strong>{" "}
              <span className="clickable" onClick={() => goToProfile(req.receiver.email)}>
                {req.receiver.name}
              </span>
            </p>
            <p><strong>Email:</strong> {req.receiver.email}</p>
            <p><strong>Department:</strong> {req.receiver.department || "—"}</p>
            <p><strong>Status:</strong> {req.status}</p>
            <button className="btn-cancel" onClick={() => cancelRequest(req._id)}>Cancel Request</button>
          </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default SentReqs;
