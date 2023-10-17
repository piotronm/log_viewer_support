import React from "react";
import "./ToolHeader.css";

function ToolHeader({ userType }) {
  return (
    <div className="toolHeader">
      <div className="portalTitle">
        <h3>CEW Support Portal</h3>
      </div>
      <div className="envSelector">
        <div className="segment">
          User: <p id="UserRole">{userType}</p>
        </div>
      </div>
    </div>
  );
}

export default ToolHeader;
