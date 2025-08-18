// components/RequestCard.jsx
import React from "react";
import { Card, Tag, Typography } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function RequestCard({ request }) {
  const { content, returnDate, isReturn, isResponse, reply } = request;
  const isOverdue = returnDate ? new Date(returnDate) < new Date() : false;

  return (
    <Card
      hoverable
      cover={
        <img
          alt={content?.title}
          src={
            content?.cover_image ||
            "/pngtree-lotus-book-cartoon-illustration-image_1433452.jpg"
          }
          style={{ height: 250, objectFit: "cover" }}
        />
      }
    >
      {/* Tiêu đề sách */}
      <Title level={4} style={{ marginBottom: 12 }}>
        {content?.title}
      </Title>

      {/* Hạn trả sách */}
      <div style={{ marginBottom: 8 }}>
        <Text>Hạn: </Text>
        {returnDate ? (
          <Tag
            color={isOverdue ? "red" : "green"}
            style={{ fontWeight: "bold", padding: "4px 8px" }}
          >
            {dayjs(returnDate).format("DD/MM/YYYY")}
          </Tag>
        ) : (
          <Text type="secondary">Chưa có</Text>
        )}
      </div>

      {/* Loại request */}
      <div style={{ marginBottom: 8 }}>
        <Tag color={isReturn ? "green" : "blue"}>
          {isReturn ? "Trả sách" : "Mượn sách"}
        </Tag>
      </div>

      {/* Trạng thái phản hồi */}
      <Text>
        {isResponse
          ? reply
          : "Vui lòng đến thư viện để hoàn thành bước tiếp"}
      </Text>
    </Card>
  );
}

// dùng React.memo để tối ưu render
export default React.memo(RequestCard);
