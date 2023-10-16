import React, { useState, useEffect } from "react";

function UserMetricsTab({ environment }) {
  const [userMetricsData, setUserMetricsData] = useState(null);

  useEffect(() => {
    async function fetchUserMetricsData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/Metrics`,
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
              jsonArray[i]
                .replace(/\\r\\n/g, "")
                .replace(/\\/g, "")
                .replace(/"{/g, "{")
                .replace(/}"/g, "}")
                .replace(/{/g, "<div class='newsection'>{<div class='subsection'>")
                .replace(/}/g, "</div>}</div>") +
              "</div>";
          }
          setUserMetricsData(jsonString);
        } else {
          console.error("Failed to fetch Metrics data");
        }
      } catch (error) {
        console.error("Error fetching Metrics data:", error);
      }
    }

    fetchUserMetricsData();
  }, [environment]);

  return (
    <div>
      <h3>Metrics</h3>
      <div className="response">
        {userMetricsData ? (
          <div id="txtMetrics" dangerouslySetInnerHTML={{ __html: userMetricsData }}></div>
        ) : (
          <div id="loader">Loading...</div>
        )}
      </div>
    </div>
  );
}

export default UserMetricsTab;
