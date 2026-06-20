import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome</h1>

      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
          margin: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <button
        onClick={() => navigate("/create_profile")}
        style={{
          padding: "10px 20px",
          margin: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Create Profile
      </button>
    </div>
  );
};

export default Landing;
