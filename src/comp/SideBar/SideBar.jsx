// components/SideBar.jsx
import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabItems = [
    { key: "user", label: "User", icon: <UserOutlined /> },
    { key: "book", label: "Book", icon: <BookOutlined /> },
    { key: "request", label: "Request", icon: <FileTextOutlined /> },
  ];

  // Xác định tab nào đang active dựa trên URL
  const getActiveTab = () => {
    const currentPath = location.pathname; // ví dụ: /manage/book
    const matchedTab = tabItems.find(item =>
      currentPath.startsWith(`/manage/${item.key}`)
    );
    return matchedTab ? matchedTab.key : "user"; // default "user"
  };

  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #ddd",
        paddingTop: "16px",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Manage
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getActiveTab()]}
        style={{
          borderRight: 0,
          background: "transparent",
        }}
        items={tabItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
        onClick={({ key }) => {
          navigate(`/manage/${key}`);
        }}
      />
    </div>
  );
};

export default SideBar;
