import React, { useState, useEffect } from "react";
import "./FetchData.css";

function UserInfoTab({ environment }) {
  const [userInfoData, setUserInfoData] = useState(null);

  useEffect(() => {
    async function fetchUserInfoData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/UserInfo`,
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
                .replace(
                  /{/g,
                  "<div class='newsection'>{<div class='subsection'>"
                )
                .replace(/}/g, "</div>}</div>") +
              "</div>";
          }
          setUserInfoData(jsonString);
        } else {
          console.error("Failed to fetch UserInfo data");
        }
      } catch (error) {
        console.error("Error fetching UserInfo data:", error);
      }
    }

    fetchUserInfoData();
  }, [environment]);

  return (
    <div>
      <h3>UserInfo</h3>
      <div className="response">
        {userInfoData ? (
          <div
            id="txtUserInfo"
            dangerouslySetInnerHTML={{ __html: userInfoData }}
          ></div>
        ) : (
          <div id="loader" className="loader"></div>
        )}
      </div>
    </div>
  );
}

export default UserInfoTab;
