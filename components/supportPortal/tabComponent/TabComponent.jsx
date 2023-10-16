import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ApplicationsTab from "../fetchData/ApplicationTab";
import MenusTab from "../fetchData/MenuTab";
import NavigationTab from "../fetchData/NavigationTab";
import SettingsTab from "../fetchData/SettingsTab";
import NewTab from "../fetchData/NewTab";
import UserInfoTab from "../fetchData/UserInfoTab";
import UserMetricsTab from "../fetchData/MetricsTab";
import "./TabComponent.css";

function TabComponent() {
  const [activeTab, setActiveTab] = useState("Applications");
  const [userType, setUserType] = useState(""); 
  const [environment, setEnvironment] = useState("");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const getUserType = useCallback(async () => {
    try {
      const response = await fetch(
        `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/Auth/userworkspace`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const json = data[0].Message;
          if (json === "User Id is required.") {
            const loginUrl = `https://cfuiv4.${environment}.us.ml.com/tools/login`;
            setUserType(
              json + `<a href='${loginUrl}' target='_blank'>Login here!</a>`
            );
            return;
          }
          setUserType(data);
        } else {
          console.error("Failed to fetch user type data");
        }
      } else {
        console.error("HTTP Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user type data:", error);
    }
  }, [environment]);
  

  useEffect(() => {
    const fetchData = async () => {
      await getUserType();
      const env = await getEnvironment();
      setEnvironment(env);
    };

    fetchData();
  }, [getUserType]);

  async function getEnvironment() {
    const host = window.location.hostname;
    let environment = "";
  
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
  
  return (
    <div>
      <div className="toolHeader">
        <div className="portalTitle">
          <h3>CEW Support Portal</h3>
        </div>
        <Link to="/logViewer" className="log-viewer-link">Log Viewer</Link>
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
      <div className="tabSeparator"></div>

      {activeTab === "Applications" && <ApplicationsTab environment={environment} />}
      {activeTab === "Menus" && <MenusTab environment={environment} />}
      {activeTab === "Navigation" && <NavigationTab environment={environment} /> }
      {activeTab === "Settings" && <SettingsTab environment={environment} /> }
      {activeTab === "NewTab" && <NewTab environment={environment} /> }
      {activeTab === "UserInfo" && <UserInfoTab environment={environment} /> }
      {activeTab === "Metrics" && <UserMetricsTab environment={environment} /> }
      <div className="tabSeparator"></div>

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
