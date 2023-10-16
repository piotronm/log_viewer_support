import React from "react";
import "./ToolHeader.css";

function ToolHeader() {
  return (
    <div className="toolHeader">
      <div className="portalTitle">
        <h3>CEW Support Portal</h3>
      </div>
      <div className="envSelector">
        <div className="segment">
          User: <p id="UserRole">Standard</p>
        </div>
      </div>
    </div>
  );
}

export default ToolHeader;
