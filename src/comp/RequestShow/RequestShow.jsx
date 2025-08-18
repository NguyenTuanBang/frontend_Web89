// components/MyRequests.jsx
import React, { useEffect, useState, useMemo } from "react";
import { message, Empty, Row, Col, Pagination, Spin } from "antd";
import axiosInstance from "../../api/axiosInstance";
import RequestCard from "../RequestCard/RequestCard";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/users/getCurRequest?page=${page}&limit=5`
      );
      setRequests(res.data.data.items);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      if (err.response?.status === 404) {
        setRequests([]);
      } else {
        message.error(err.response?.data?.message || "Lỗi khi lấy dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const requestList = useMemo(
    () =>
      requests.map((req) => (
        <Col xs={24} sm={12} md={8} lg={6} key={req._id}>
          <RequestCard request={req} />
        </Col>
      )),
    [requests]
  );

  if (!loading && requests.length === 0) {
    return (
      <Empty
        description="Bạn chưa gửi yêu cầu mượn/trả sách nào"
        style={{ marginTop: 40 }}
      />
    );
  }

  return (
    <div
      style={{
        maxHeight: "75vh",
        overflowY: "auto",
        paddingRight: "8px",
        height: 600,
        position: "relative"
      }}
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {requestList}
        </Row>
      </Spin>
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Pagination
            current={currentPage}
            total={totalPages * 5}
            pageSize={5}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
