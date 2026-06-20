// src/pages/Events/Events.tsx
import React, { useEffect, useState } from "react";
import { getEvents } from "../../services/events";
import { IEvent } from "../../types/Events";
import "./Events.css";

const Events: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Get unique societies for filtering
  const societies = Array.from(new Set(events.map(event => event.society)));

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.society === filter);

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="events-title">Upcoming Events</h1>
        <p className="events-subtitle">Discover amazing events happening around you</p>
        
        {societies.length > 0 && (
          <div className="events-filter">
            <label htmlFor="society-filter">Filter by Society:</label>
            <select 
              id="society-filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Societies</option>
              {societies.map(society => (
                <option key={society} value={society}>{society}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <div className="no-events-icon">📅</div>
          <h3>No events found</h3>
          <p>There are no events matching your criteria.</p>
        </div>
      ) : (
        <div className="events-container">
          {filteredEvents.map((event, index) => (
            <div
              key={event._id}
              className="event-card"
              style={{
                background:
                  index % 3 === 0
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : index % 3 === 1
                    ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <div className="event-card-header">
                <div className="event-date-badge">
                  <span className="event-day">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="event-month">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
                <div className="event-society-tag">{event.society}</div>
              </div>
              
              <h3 className="event-title">{event.title}</h3>
              
              <div className="event-details">
                <div className="event-detail-item">
                  <span className="event-icon">📍</span>
                  <span className="event-venue">{event.venue}</span>
                </div>
                <div className="event-detail-item">
                  <span className="event-icon">🕒</span>
                  <span className="event-time">
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="event-detail-item">
                  <span className="event-icon">📅</span>
                  <span className="event-full-date">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;