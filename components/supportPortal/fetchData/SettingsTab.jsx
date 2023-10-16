import React, { useState, useEffect } from "react";
import "./fetchData.css";

function SettingsTab({ environment }) {
  const [settingsData, setSettingsData] = useState(null);

  useEffect(() => {
    async function fetchSettingsData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/SettingsConfig`,
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
          setSettingsData(data);
        } else {
          console.error("Failed to fetch Settings data");
        }
      } catch (error) {
        console.error("Error fetching Settings data:", error);
      }
    }

    fetchSettingsData();
  }, [environment]);

  return (
    <div>
      <h3>Settings</h3>
      <div className="response">
        {settingsData ? (
          <div id="txtSettings">{JSON.stringify(settingsData)}</div>
        ) : (
          <div id="loader" className="loader"></div>
        )}
      </div>
    </div>
  );
}

export default SettingsTab;
