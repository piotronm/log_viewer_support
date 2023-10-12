import React, { useState, useEffect } from "react";

function NewTab({ environment }) {
  const [newTabData, setNewTabData] = useState(null);

  useEffect(() => {
    async function fetchNewTabData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/NewPageSettings`,
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
          setNewTabData(jsonString);
        } else {
          console.error("Failed to fetch NewTab data");
        }
      } catch (error) {
        console.error("Error fetching NewTab data:", error);
      }
    }

    fetchNewTabData();
  }, [environment]);

  return (
    <div>
      <h3>New Tab</h3>
      <div className="response">
        {newTabData ? (
          <div id="txtNewTab" dangerouslySetInnerHTML={{ __html: newTabData }}></div>
        ) : (
          <div id="loader">Loading...</div>
        )}
      </div>
    </div>
  );
}

export default NewTab;
