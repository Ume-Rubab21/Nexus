import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./create_profile.css";

type CreateForm = {
  studentID: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  interests: string;
  department: string;
  contactInfo: string;
};

const CreateProfile: React.FC = () => {
  const [form, setForm] = useState<CreateForm>({
    studentID: "",
    name: "",
    email: "",
    password: "",
    bio: "",
    interests: "",
    department: "",
    contactInfo: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          (data && (data.message || data.error)) || `Error: ${res.status}`
        );

      setMessage("✨ Profile created successfully! Redirecting...");
      setForm({
        studentID: "",
        name: "",
        email: "",
        password: "",
        bio: "",
        interests: "",
        department: "",
        contactInfo: "",
      });
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setMessage(err?.message ?? "Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      {/* Floating icons */}
      <div className="floating-icon icon1">🌟</div>
      <div className="floating-icon icon2">💬</div>
      <div className="floating-icon icon3">📘</div>

      <div className="create-profile-card">
        <h2>Create Your Nexus Profile</h2>
        <p className="subtitle">
          Build your identity & connect with your FAST community
        </p>

        {message && <p className="message-box">{message}</p>}

        <form onSubmit={handleCreate} className="profile-form">
          <input
            name="studentID"
            value={form.studentID}
            onChange={handleChange}
            placeholder="Student ID"
            required
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={3}
          />
          <textarea
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Your interests (comma separated)"
            rows={3}
          />
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
          />
          <input
            name="contactInfo"
            value={form.contactInfo}
            onChange={handleChange}
            placeholder="Contact Info"
          />

          <div className="button-row">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Profile"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
