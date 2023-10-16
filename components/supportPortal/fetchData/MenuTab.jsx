import React, { useState, useEffect } from "react";
import "./FetchData.css";

function MenusTab({ environment }) {
  const [menusData, setMenusData] = useState(null);

  useEffect(() => {
    async function fetchMenusData() {
      try {
        const response = await fetch(
          `https://buapp2k16.${environment}.us.ml.com/MDCConfigService/api/MDCData/menus`,
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
          setMenusData(data);
        } else {
          console.error("Failed to fetch Menus data");
        }
      } catch (error) {
        console.error("Error fetching Menus data:", error);
      }
    }

    fetchMenusData();
  }, [environment]);

  return (
    <div>
      <h3>Menus</h3>
      <div className="response">
        {menusData ? (
          <div id="txtMenus">{JSON.stringify(menusData)}</div>
        ) : (
          <div id="loader" className="loader"></div>
        )}
      </div>
    </div>
  );
}

export default MenusTab;
