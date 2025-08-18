// components/RentedBookCard.jsx
import React, { useState } from "react";
import { Card, Tag, Button, message, Typography } from "antd";
import axiosInstance from "../../api/axiosInstance";


const { Title } = Typography;

export default function RentedBookCard({
  _id,
  title,
  cover_image,
  rentDate,
  returnDate,
  onwaiting
}) {
  const [loading, setLoading] = useState(false);
  const [onwaitingState, setOnWaitingState] = useState(onwaiting);
  const isOverdue = returnDate && new Date(returnDate) < new Date();

  const handleReturnRequest = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/return_book", { bookId: _id });
      message.success(res.data.message || "Đã gửi yêu cầu trả sách thành công!");
      setOnWaitingState(true)
    } catch (error) {
      message.error(error.response?.data?.message || "Gửi yêu cầu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={title}
          src={cover_image || "/pngtree-lotus-book-cartoon-illustration-image_1433452.jpg"}
          style={{ height: 250, objectFit: "cover" }}
        />
      }
      actions={[
        <Button
          type="primary"
          danger={isOverdue&&!onwaiting}
          loading={loading}
          disabled={onwaiting}
          onClick={handleReturnRequest}
        >
          {onwaiting ? "Trạng thái chờ" : "Trả sách"}
        </Button>,
      ]}
    >
      {/* Hiển thị title rõ ràng phía trên */}
      <Title level={4} style={{ marginBottom: 12 }}>
        {title}
      </Title>

      <Card.Meta
        description={
          <>
            <p>Ngày thuê: {new Date(rentDate).toLocaleDateString()}</p>
            <p>Ngày trả: {new Date(returnDate).toLocaleDateString()}</p>
            {isOverdue ? <Tag color="red">Quá hạn</Tag> : <Tag color="green">Chưa quá hạn</Tag>}
          </>
        }
      />
    </Card>
  );
}
