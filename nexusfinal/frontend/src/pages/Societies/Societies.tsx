import React, { useEffect, useState } from "react";
import { getSocieties, ISociety } from "../../services/societies";
import "./Societies.css";

// Updated color palette with the specified scheme
const badgeColors = ["#F7AEF8", "#B388EB", "#8093F1", "#72DDF7"];
const cardColors = ["#1E3A8A", "#7E22CE", "#0369A1", "#0F766E", "#B45309", "#BE123C"];

// Enhanced icon mapping
const societyIcons: { [key: string]: string } = {
  Softec: "💻",
  "Fast Business Club": "📊",
  DramaF: "🎭",
  fastCare: "❤️",
  "Fast Literary Society": "📚",
  "Nuces Media Group": "🎥",
  "Fast Music Society": "🎵",
  "Voice Debating Society": "🗣️",
  "Nuces Fun Trekker": "🥾",
};

const Societies: React.FC = () => {
  const [societies, setSocieties] = useState<ISociety[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties();
        setSocieties(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load societies.");
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading societies...</div>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-text">{error}</div>
    </div>
  );

  return (
    <div className="societies-page">
      <div className="societies-container">
        <div className="societies-header">
          <h1 className="societies-title">Student Societies</h1>
          <p className="societies-subtitle">Discover and join student-led organizations at FAST</p>
        </div>
        
        <div className="societies-grid">
          {societies.map((society, index) => {
            const badgeColor = badgeColors[index % badgeColors.length];
            const cardBg = cardColors[index % cardColors.length];
            const icon = societyIcons[society.name] || "🏛️";

            return (
              <div 
                key={society._id} 
                className="society-card" 
                style={{ backgroundColor: cardBg }}
              >
                <div className="card-header">
                  <div className="card-badge" style={{ backgroundColor: badgeColor }}>
                    {icon}
                  </div>
                  <div className="card-title-section">
                    <h3 className="card-title">{society.name}</h3>
                  </div>
                </div>
                
                <div className="card-content">
                  <p className="card-description">{society.description}</p>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">President</span>
                      <span className="meta-value">{society.president}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Established</span>
                      <span className="meta-value">
                        {new Date(society.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Societies;