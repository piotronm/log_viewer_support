import React, { useState, useEffect } from "react";
import "./FetchData.css"

function ApplicationsTab({ environment }) {
  const [applicationsData, setApplicationsData] = useState(null);

  useEffect(() => {
    async function fetchApplicationsData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/RemoteConfig`,
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
          const jsonObjectString = JSON.stringify(data);
          const jsonArray = jsonObjectString.split(",");
          let jsonString = "";
          for (let i = 0; i < jsonArray.length; i++) {
            jsonString +=
              "<div class='subsection'>" +
              jsonArray[i].replace(/\\r\\n/g, '').replace(/\\/g, '')
                .replace(/"{/g, "}")
                .replace(/}"/g, "}")
                .replace(/{/g, "<div class='newsection'>{<div class='subsection'>")
                .replace(/}/g, "</div>}</div>") +
              "</div>";
          }
          setApplicationsData(jsonString);
        } else {
          console.error("Failed to fetch Applications data");
        }
      } catch (error) {
        console.error("Error fetching Applications data:", error);
      }
    }

    fetchApplicationsData();
  }, [environment]);

  return (
    <div id="Applications" className="tabcontent">
      <h3>Applications</h3>
      <div className="response">
        {applicationsData ? (
          <div id="txtApplications">{JSON.stringify(applicationsData)}</div>
        ) : (
          <div id="loader" className="loader"></div>
        )}
      </div>
    </div>
  );
}

export default ApplicationsTab;
