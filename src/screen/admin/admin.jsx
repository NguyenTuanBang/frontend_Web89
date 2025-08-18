// pages/Admin.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../comp/SideBar/SideBar";

const Admin = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <div style={{ flex: "0 0 200px" }}>
          <SideBar />
        </div>
        <div style={{ flex: 1, padding: "16px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
