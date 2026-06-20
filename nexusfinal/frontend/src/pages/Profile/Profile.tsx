import React, { useState, useEffect } from "react";
import { Student } from "./Student";

import { useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "./Navbar1";

type ProfileForm = Student & {
  password?: string;
  studentID: string;
  interests?: string;
};

const Profile: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {

  const [currentStudent, setCurrentStudent] = useState<ProfileForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ProfileForm>({
    studentID: "",
    name: "",
    email: "",
    password: "",
    bio: "",
    interests: "",
    department: "",
    contactInfo: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFriendOptions, setShowFriendOptions] = useState(false);

  const navigate = useNavigate();

  /* ---------------------- FETCH PROFILE ---------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      const stored = localStorage.getItem("currentStudent");

      if (!stored) {
        navigate("/");
        return;
      }

      const student = JSON.parse(stored);

      try {
        const res = await fetch(
          `http://localhost:5000/api/profiles/by-email?email=${encodeURIComponent(
            student.email
          )}`
        );

        const fullProfile = await res.json();
        const profileData = fullProfile._doc ? fullProfile._doc : fullProfile;

        const profile: ProfileForm = {
          studentID: profileData.studentID ?? "",
          name: profileData.name ?? "",
          email: profileData.email ?? "",
          password: "",
          bio: profileData.bio ?? "",
          interests: profileData.interests ?? "",
          department: profileData.department ?? "",
          contactInfo: profileData.contactInfo ?? "",
        };

        setCurrentStudent(profile);
        setFormData(profile);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ------------------ BLOCK BROWSER BACK BUTTON ------------------ */
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = () =>
      window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  /* ---------------------- HANDLERS ---------------------- */
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setFormData(currentStudent as ProfileForm);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentStudent) return;

    try {
      const res = await fetch("http://localhost:5000/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const updated = { ...currentStudent, ...formData };

        setCurrentStudent(updated);
        localStorage.setItem("currentStudent", JSON.stringify(updated));

        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError("Network error during profile update");
    }
  };

  /* ---------------------- NAVIGATION ---------------------- */
  const goToChat = () => navigate("/chat");
  const goToFindFriends = () => navigate("/find-friends");

  const toggleFriendOptions = () =>
    setShowFriendOptions(!showFriendOptions);

  const goToFriendsPage = () => {
    navigate("/friends/all");
    setShowFriendOptions(false);
  };

  const goToRequestsPage = (type: "sent" | "received") => {
    if (type === "sent") navigate("/sent-requests");
    else navigate("/received-requests");
    setShowFriendOptions(false);
  };

  if (!currentStudent)
    return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      {/* Floating Clouds */}
      <div className="floating-cloud cloud1">☁️</div>
      <div className="floating-cloud cloud2">☁️</div>
      <div className="floating-cloud cloud3">☁️</div>

      {/* Floating Stars */}
      <div className="floating-star star1">✦</div>
      <div className="floating-star star2">✦</div>
      <div className="floating-star star3">✦</div>

      {/* PROFILE CARD */}
      <div className="profile-container">

        <div className="avatar-wrapper">
          <div className="glow-avatar">
            {currentStudent.name?.[0] ?? "?"}
          </div>
        </div>

        {!isEditing ? (
          <div className="profile-details">
            <p><strong>Student ID:</strong> {currentStudent.studentID}</p>
            <p><strong>Name:</strong> {currentStudent.name}</p>
            <p><strong>Email:</strong> {currentStudent.email}</p>
            <p><strong>Bio:</strong> {currentStudent.bio}</p>
            <p><strong>Interests:</strong> {currentStudent.interests}</p>
            <p><strong>Department:</strong> {currentStudent.department}</p>
            <p><strong>Contact:</strong> {currentStudent.contactInfo}</p>

            <div className="profile-button-group">
              <button onClick={handleEditToggle} className="btn-edit">
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">

            <FormInput label="Student ID" name="studentID" value={formData.studentID ?? ""} onChange={handleChange} />
            <FormInput label="Name" name="name" value={formData.name ?? ""} onChange={handleChange} />
            <FormInput label="Email" name="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
            <FormInput label="Password" name="password" type="password" value={formData.password ?? ""} onChange={handleChange} />
            <FormInput label="Bio" name="bio" value={formData.bio ?? ""} onChange={handleChange} textarea />
            <FormInput label="Interests" name="interests" value={formData.interests ?? ""} onChange={handleChange} textarea />
            <FormInput label="Department" name="department" value={formData.department ?? ""} onChange={handleChange} />
            <FormInput label="Contact" name="contactInfo" value={formData.contactInfo ?? ""} onChange={handleChange} />

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <div className="profile-button-group">
              <button type="submit" className="btn-edit">Save</button>
              <button type="button" onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
              <button type="button" onClick={() => navigate("/delete_profile")} className="btn-delete">Delete Profile</button>
              <button onClick={handleLogout} className="btn-logout">🚪 Logout</button>

            </div>
          </form>
        )}
      </div>
    </div>
  );

};

/* ============================================================
   INPUT COMPONENT
============================================================ */
const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
}) => (
  <div className="form-input">
    <label>{label}:</label>

    {textarea ? (
      <textarea name={name} value={value} onChange={onChange} />
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} />
    )}
  </div>
);

export default Profile;
