import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; //add Link after Routes, to navigate between pages
import LogViewer from "../logViewer/LogViewer";
import "./Navigation.css";

function Navigation() {
  return (
    <Router>
      {/* <div className="container">
        <div className="log-viewer-link">
          <Link className="log-viewer-link" to="/">
            CEW Log Viewer
          </Link>
        </div>
        <div className="support-portal-link">
          <Link>Add Support Portal here when it has been changed to react</Link>
        </div>
      </div> */}
      <Routes>
        <Route path="/" element={<LogViewer />} />
      </Routes>
    </Router>
  );
}

export default Navigation;