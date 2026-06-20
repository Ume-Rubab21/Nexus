import React, { useEffect, useState } from "react";
import { getAnnouncements } from "../../services/announcements";
import { IAnnouncement } from "../../types/Announcement";
import "./Announcements.css";

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const gradients = [
    "linear-gradient(135deg, #F7AEF8 0%, #B388EB 100%)",
    "linear-gradient(135deg, #B388EB 0%, #8093F1 100%)",
    "linear-gradient(135deg, #8093F1 0%, #72DDF7 100%)",
    "linear-gradient(135deg, #F7AEF8 0%, #8093F1 100%)"
  ];

  if (loading) {
    return (
      <div className="announcements-loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="announcements-page">
      <div className="announcements-wrapper">
        {/* Header Section */}
        <div className="announcements-header">
          <h1 className="announcements-main-title">Announcements</h1>
          <p className="announcements-subtitle">
            Stay updated with the latest news and updates from our team
          </p>
          <div className="header-divider">
            <div className="divider-line divider-1"></div>
            <div className="divider-line divider-2"></div>
            <div className="divider-line divider-3"></div>
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="announcements-grid">
          {announcements.map((ann, index) => (
            <div
              key={ann._id}
              className="announcement-card"
              style={{
                background: gradients[index % gradients.length],
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Decorative corner */}
              <div className="card-corner-decoration"></div>
              
              {/* Card Content */}
              <div className="card-content">
                {/* Icon Badge */}
                <div className="card-icon-badge">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="card-title">{ann.title}</h3>

                {/* Description */}
                <p className="card-description">{ann.description}</p>

                {/* Footer */}
                <div className="card-footer">
                  <div className="footer-author">
                    <div className="author-avatar">
                      {ann.createdBy.charAt(0)}
                    </div>
                    <span className="author-name">{ann.createdBy}</span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="card-hover-overlay"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {announcements.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="empty-state-title">No announcements yet</h3>
            <p className="empty-state-text">Check back later for updates and news</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;