// pages/MyProfile.jsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import UserCard from "../../comp/userCard/userCard";

const MyProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.split("/").pop();

  const tabItems = [
    { key: "info", label: "Thông tin" },
    { key: "rentedBook", label: "Sách đã thuê" },
    { key: "request", label: "Yêu cầu" },
  ];

  return (
    <div
      style={{
        display: "flex",
        padding: "24px",
        alignItems: "flex-start",
      }}
    >
      {/* Bên trái (3 phần) */}
      <div style={{ flex: 3, height:"665px"}}>
        <UserCard user={user} setUser={setUser} />
      </div>

      {/* Khoảng trống giữa */}
      <div style={{ width: "32px" }} />

      {/* Bên phải (7 phần) */}
      <div style={{ flex: 7 }}>
        <Tabs
          activeKey={activeKey}
          items={tabItems}
          onChange={(key) => navigate(`/myProfile/${key}`)}
        />
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            minHeight: "600px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;