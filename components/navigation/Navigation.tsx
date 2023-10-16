import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"; //add Link after Routes, to navigate between pages
import SupportPortal from "../supportPortal/SupportPortal";
import LogViewer from "../logViewer/LogViewer";
import "./Navigation.css";

function Navigation() {
  return (
    <Router>
      <div className="container">
        <div className="log-viewer-link">
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