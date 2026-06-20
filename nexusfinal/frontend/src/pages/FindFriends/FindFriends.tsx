import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "../Profile/Navbar1";
import "./find-friends.css";

type ProfilePreview = {
  _id: string;
  name: string;
  studentID?: string;
  department?: string;
};

type FindFriendsProps = {
  onLogout?: () => void;
};

const FindFriends: React.FC<FindFriendsProps> = ({ onLogout }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] =
    useState<"name" | "studentID" | "department">("name");
  const [results, setResults] = useState<ProfilePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleClick = (profileId: string) => {
  navigate(`/view-profile/${profileId}`);
};


  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        let url = "";

        if (searchType === "name")
          url = `http://localhost:5000/api/profiles/search/name?name=${query}`;

        if (searchType === "department")
          url = `http://localhost:5000/api/profiles/search/department?department=${query}`;

        if (searchType === "studentID")
          url = `http://localhost:5000/api/profiles/search/studentID?studentID=${query}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        const previews = Array.isArray(data)
          ? data.map((p: any) => ({
              _id: p._id,
              name: p.name,
              studentID: p.studentID || p.student?.studentID,
              department: p.department,
            }))
          : [
              {
                _id: data._id,
                name: data.name,
                studentID: data.studentID || data.student?.studentID,
                department: data.department,
              },
            ];

        setResults(previews);
      } catch (err) {
        setError("Error searching profiles");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, searchType]);

  return (
    <>
      <Navbar1 onLogout={onLogout} />
      <div className="find-friends-wrapper">

        {/* Floating Clouds */}
        <div className="floating-cloud cloud1">☁️</div>
        <div className="floating-cloud cloud2">☁️</div>
        <div className="floating-cloud cloud3">☁️</div>
        <div className="floating-cloud cloud4">☁️</div>

        <div className="find-friends-container">
        <h2>Find Friends</h2>

        <div className="search-bar">
          <input
            placeholder={`Search by ${searchType}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
          >
            <option value="name">Name</option>
            <option value="studentID">Student ID</option>
            <option value="department">Department</option>
          </select>
        </div>

        {loading && <p>Searching...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="results-container">
          {results.map((r) => (
            <div
              key={r._id}
              className="result-card"
              onClick={() => handleClick(r._id)}
            >
              <div className="name">{r.name}</div>
              <div className="info">{r.studentID || "—"}</div>
              <div className="info">{r.department || "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default FindFriends;
