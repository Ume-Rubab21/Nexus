import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile";


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
