import React, { useState, useEffect } from "react";
import "./TabComponent.css";

function TabComponent() {
  const [activeTab, setActiveTab] = useState("Applications");
  const [userType, setUserType] = useState(""); 
  const [environment, setEnvironment] = useState("");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    getEnvironment().then((env) => {
      setEnvironment(env);
    });
  }, []);

  async function getUserType() {
    try {
      const response = await fetch('https://buapp2k16.' + environment + '.us.ml.com/MDCConfigService/api/Auth/userworkspace', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const json = data[0].Message;
          if (json === "User Id is required.") {
            const loginUrl = 'https://cfuiv4.' + environment + '.us.ml.com/tools/login';
            setUserType(json + `<a href='${loginUrl}' target='_blank'>Login here!</a>`);
            return;
          }
        }
        setUserType(data);
      } else {
        console.error("Failed to fetch user type data");
      }
    } catch (error) {
      console.error("Error fetching user type data:", error);
    }
  }

  async function getEnvironment() {
    const host = window.location.hostname;
    let environment = "pl1";
  
    if (host.includes("pl1")) {
      environment = "pl1";
    } else if (host.includes("pl2")) {
      environment = "pl2";
    } else if (host.includes("qa")) {
      environment = "qa.hew";
    } else if (host.includes("se")) {
      environment = "se.hew";
    } else if (host.includes("services")) {
      environment = "services";
    } else if (host.includes("dif")) {
      environment = "dif.hew";
    } else {
      environment = "pl2"; // Default environment if none of the above conditions match
    }
  
    return environment;
  }  
  useEffect(() => {
    getEnvironment().then((env) => {
      // Set the environment value to a state variable
      setEnvironment(env);
    });
  }, []); // The empty dependency array ensures the effect runs once on mount
  

  return (
    <div>
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
      <div className="tab">
        <button
          className={`tablink ${activeTab === "Applications" ? "active" : ""}`}
          onClick={() => handleTabClick("Applications")}
        >
          Applications
        </button>
        <button
          className={`tablink ${activeTab === "Menus" ? "active" : ""}`}
          onClick={() => handleTabClick("Menus")}
        >
          Menus
        </button>
        <button
          className={`tablink ${activeTab === "Navigation" ? "active" : ""}`}
          onClick={() => handleTabClick("Navigation")}
        >
          Navigation
        </button>
        <button
          className={`tablink ${activeTab === "Settings" ? "active" : ""}`}
          onClick={() => handleTabClick("Settings")}
        >
          Settings
        </button>
        <button
          className={`tablink ${activeTab === "NewTab" ? "active" : ""}`}
          onClick={() => handleTabClick("NewTab")}
        >
          New Tab
        </button>
        <button
          className={`tablink ${activeTab === "UserInfo" ? "active" : ""}`}
          onClick={() => handleTabClick("UserInfo")}
        >
          UserInfo
        </button>
        <button
          className={`tablink ${activeTab === "Metrics" ? "active" : ""}`}
          onClick={() => handleTabClick("Metrics")}
        >
          Metrics
        </button>
        <button
          className={`tablink ${activeTab === "About" ? "active" : ""}`}
          onClick={() => handleTabClick("About")}
        >
          About
        </button>
      </div>

      <div
        id="Applications"
        className="tabcontent"
        style={{ display: activeTab === "Applications" ? "block" : "none" }}
      >
        <h3>Applications</h3>
        <div className="response">
          <div id="loader"></div>
          <div id="txtApplications"></div>
        </div>
      </div>
      <div
        id="Menus"
        className="tabcontent"
        style={{ display: activeTab === "Menus" ? "block" : "none" }}
      >
        <h3>Menus</h3>
        <div className="response">
          <p id="txtMenus"></p>
        </div>
      </div>
      <div
        id="Navigation"
        className="tabcontent"
        style={{ display: activeTab === "Navigation" ? "block" : "none" }}
      >
        <h3>Navigation</h3>
        <div className="response">
          <p id="txtNavigation"></p>
        </div>
      </div>
      <div
        id="Settings"
        className="tabcontent"
        style={{ display: activeTab === "Settings" ? "block" : "none" }}
      >
        <h3>Settings</h3>
        <div className="response">
          <p id="txtSettings"></p>
        </div>
      </div>
      <div
        id="NewTab"
        className="tabcontent"
        style={{ display: activeTab === "NewTab" ? "block" : "none" }}
      >
        <h3>New Tab</h3>
        <div className="response">
          <p id="txtNewTab"></p>
        </div>
      </div>
      <div
        id="UserInfo"
        className="tabcontent"
        style={{ display: activeTab === "UserInfo" ? "block" : "none" }}
      >
        <h3>UserInfo</h3>
        <div className="response">
          <p id="txtUserInfo"></p>
        </div>
      </div>
      <div
        id="Metrics"
        className="tabcontent"
        style={{ display: activeTab === "Metrics" ? "block" : "none" }}
      >
        <h3>Metrics</h3>
        <div className="response">
          <p id="txtMetrics"></p>
        </div>
      </div>
      <div
        id="About"
        className="tabcontent"
        style={{ display: activeTab === "About" ? "block" : "none" }}
      >
        <h3>About</h3>
        <div className="response">
          <p>Contact</p>
          <a href="mailto:testemail.com">CEW Support Team</a>
        </div>
      </div>
    </div>
  );
}

export default TabComponent;
