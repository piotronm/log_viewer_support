import React, { useState, useEffect } from "react";

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
          setApplicationsData(data);
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
          <div id="loader">Loading...</div>
        )}
      </div>
    </div>
  );
}

export default ApplicationsTab;
