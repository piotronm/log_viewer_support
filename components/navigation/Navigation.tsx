import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SupportPortal from "../supportPortal/SupportPortal";
import LogViewer from "../logViewer/LogViewer";
import "./Navigation.css";

function Navigation() {
  return (
    <Router>
      <div className="container">
        <div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<SupportPortal />} />
        <Route path="/logViewer" element={<LogViewer />} />
      </Routes>
    </Router>
  );
}

export default Navigation;
