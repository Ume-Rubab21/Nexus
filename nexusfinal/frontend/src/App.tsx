import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import FindFriends from "./pages/FindFriends/FindFriends";
import Profile from "./pages/Profile/Profile";
import CreateProfile from "./pages/Profile/create_profile";
import DeleteProfile from "./pages/Profile/delete_profile";
import ViewAddedFriend from "./pages/FindFriends/ViewAddedFriend";
import ViewProfile from "./pages/FindFriends/view_profile";
import ViewFriends from "./pages/FindFriends/viewFriends";
import SentReqs from "./pages/FindFriends/SentReqs";
import ReceivedReqs from "./pages/FindFriends/received-reqs";

import Chat from "./pages/Chat/Chat";


import TestChat from "./TestChat";
import AboutUs from './pages/AboutUs/AboutUs';
import Events from './pages/Events/Events';
import Societies from './pages/Societies/Societies';
import Announcements from './pages/Announcements/Announcements';


// Auto-logout component wrapper
const AutoLogoutWrapper: React.FC<{ 
  children: React.ReactNode; 
  isLoggedIn: boolean; 
  onLogout: () => void;
}> = ({ children, isLoggedIn, onLogout }) => {
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 60000; // 60 seconds
  const DEBOUNCE_DELAY = 2000; // Wait 2 seconds before resetting (prevents constant resets)

  useEffect(() => {
    // Clear any existing timeouts
    const clearAllTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };

    // Don't set up auto-logout if not logged in or on login page
    if (!isLoggedIn || location.pathname === "/login") {
      clearAllTimers();
      return;
    }

    // Create the logout function
    const performLogout = () => {
      clearAllTimers();
      console.log("Auto-logout triggered after 60 seconds of inactivity");
      onLogout();
      window.location.href = "/login";
    };

    // Function to start/reset the timeout (only called after debounce)
    const startTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      console.log("Starting inactivity timer (60 seconds)");
      timeoutRef.current = setTimeout(performLogout, INACTIVITY_TIMEOUT);
    };

    // Start the initial timer
    startTimer();

    // Activity handler with debounce - resets timer on user activity
    const handleActivity = () => {
      // Check current state
      const currentPath = window.location.pathname;
      const hasToken = !!localStorage.getItem("authToken");
      
      // If not logged in or on login page, clear timers
      if (!hasToken || currentPath === "/login") {
        clearAllTimers();
        return;
      }

      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce the timer reset - only reset after 2 seconds of no activity
      debounceRef.current = setTimeout(() => {
        console.log("User activity detected - resetting timer");
        startTimer();
      }, DEBOUNCE_DELAY);
    };

    // Add event listeners for user activity (removed 'scroll' to reduce frequency)
    const events = ['mousedown', 'keydown', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      clearAllTimers();
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn, location.pathname, onLogout]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("currentStudent");
    setIsLoggedIn(false);
  };

  return (
    <>
      <Router>
        <AutoLogoutWrapper isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <Navbar />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="/chat" element={isLoggedIn ? <Chat onLogout={handleLogout} /> : <Navigate to="/login" replace />}/>

          <Route path="/events" element={<Events />} />
          <Route path="/societies" element={<Societies />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/find-friends" element={<FindFriends onLogout={handleLogout} />} />
          <Route path="/viewFriends" element={isLoggedIn ? <ViewFriends onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/sent-requests" element={isLoggedIn ? <SentReqs onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/received-requests" element={isLoggedIn ? <ReceivedReqs onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/create_profile" element={<CreateProfile />} />
          <Route path="/delete_profile" element={isLoggedIn ? <DeleteProfile /> : <Navigate to="/login" replace />} />
          
          <Route path="/view-added-friend/:id" element={isLoggedIn ? <ViewAddedFriend onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/view-profile/:id" element={isLoggedIn ? <ViewProfile onLogout={handleLogout} /> : <Navigate to="/login" replace />} />

          </Routes>
          <Footer />
        </AutoLogoutWrapper>
      </Router>
    </>
  );
};

export default App;
