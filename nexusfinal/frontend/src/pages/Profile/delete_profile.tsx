import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./delete_profile.css";

const DeleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch email from storage
  useEffect(() => {
  const stored = localStorage.getItem("currentStudent");

  if (!stored) {
    navigate("/"); 
    return; 
  }

  try {
    const student = JSON.parse(stored);

    if (student.email) setEmail(student.email);
    else setError("Email missing, cannot delete.");
    
  } catch {
    setError("Failed to read user data.");
  }
}, [navigate]);


  const handleDelete = async () => {
    if (!email) return setError("Cannot delete: email missing.");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/profiles/email/${email}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("currentStudent");
        alert(data.message || "Profile deleted successfully.");
        navigate("/");
      } else {
        setError(data.message || "Failed to delete profile.");
      }
    } catch (err) {
      setError("Network error while deleting profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-wrapper">
      {/* Floating Clouds */}
      <div className="del-cloud cloud-a">☁️</div>
      <div className="del-cloud cloud-b">☁️</div>

      <div className="delete-card">
        <h2 className="del-title">Delete Profile</h2>
        <p className="del-warning">
          This will permanently remove your profile <strong>and student account.</strong>
        </p>
        <p className="del-confirm">Are you sure you want to continue?</p>

        {error && <p className="del-error">{error}</p>}

        <div className="del-btn-row">
          <button
            onClick={handleDelete}
            disabled={loading || !email}
            className="del-btn delete"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            disabled={loading}
            className="del-btn cancel"
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
