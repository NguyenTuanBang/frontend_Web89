// components/UserCard.jsx
import React, { useEffect, useState } from "react";
import { Card, Avatar, Tag, Upload, Button, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const UserCard = ({ user, setUser }) => {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setAvatarUrl(user?.avatar || null);

    if (!user?.avatar) {
      fetch(`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          user.username || "guest"
        )}`)
        .then((res) => res.json())
        .then((data) => setAvatarUrl(data?.url || null))
        .catch(() => setAvatarUrl(null));
    }
  }, [user]);

  const handleUpload = async ({ file }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Bạn cần đăng nhập lại!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axiosInstance.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.image?.secure_url;
      if (!newUrl) throw new Error("Không nhận được link avatar!");

      message.success("Cập nhật avatar thành công!");

      if (setUser) {
        setUser((prev) => ({ ...prev, avatar: newUrl }));
      }
      setAvatarUrl(newUrl);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi upload avatar!");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <Spin tip="Đang tải thông tin người dùng..." />;
  }

  return (
    <Card
      style={{
        textAlign: "center",
        borderRadius: "12px",
        overflow: "hidden",
        padding: "24px",
        height: "100%",
        display: "flex",                // 👈 dùng flexbox
        flexDirection: "column",        // 👈 xếp theo cột
        justifyContent: "space-between" // 👈 các phần tử cách đều từ trên xuống dưới
      }}
    >
      {/* Phần trên cùng */}
      {/* Phần trên cùng */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",   // 👈 căn giữa ngang
          justifyContent: "center", // 👈 căn giữa dọc
          flex: 1,                // 👈 chiếm toàn bộ chiều cao còn lại
          marginBottom: 20,
        }}
      >
        <Avatar
          size={180} // 👈 tăng kích cỡ avatar (mặc định 140, bạn có thể chỉnh 180 hoặc 200)
          src={avatarUrl || null}
          style={{
            backgroundColor: avatarUrl ? "transparent" : "#87d068",
            marginBottom: 50,
          }}
        >
          {!avatarUrl && user?.username?.[0]?.toUpperCase()}
        </Avatar>

        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={handleUpload}
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? "Đang tải lên..." : "Cập nhật Avatar"}
          </Button>
        </Upload>
      </div >


      {/* Phần thông tin ở giữa */}
      <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",   // 👈 căn giữa ngang
          justifyContent: "center", // 👈 căn giữa dọc
          flex: 1,                // 👈 chiếm toàn bộ chiều cao còn lại
          marginBottom: 20,
        }}>
        <h1 style={{ marginTop: "12px" , fontSize: "x-large", marginBottom: "8px"}}>{user?.username || "No Name"}</h1>
        <p style={{  marginBottom: "8px" }}>
          {user?.role || "Unknown Role"}
        </p>
      </div>

      {/* Phần trạng thái ở cuối */}
      <div>
        {user?.isBan ? (
          <Tag color="red">Banned</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
