import React, { useState, useEffect } from "react";

function NavigationTab({ environment }) {
  const [navigationData, setNavigationData] = useState(null);

  useEffect(() => {
    async function fetchNavigationData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/Navigation`,
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
          var jsonObjectString = JSON.stringify(data);
          var jsonArray = jsonObjectString.split(",");
          var jsonString = "";
          for (var i = 0; i < jsonArray.length; i++) {
            jsonString =
              jsonString +
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
          setNavigationData(jsonString);
        } else {
          console.error("Failed to fetch Navigation data");
        }
      } catch (error) {
        console.error("Error fetching Navigation data:", error);
      }
    }

    fetchNavigationData();
  }, [environment]);

  return (
    <div>
      <h3>Navigation</h3>
      <div className="response">
        {navigationData ? (
          <div
            id="txtNavigation"
            dangerouslySetInnerHTML={{ __html: navigationData }}
          ></div>
        ) : (
          <div id="loader">Loading...</div>
        )}
      </div>
    </div>
  );
}

export default NavigationTab;
