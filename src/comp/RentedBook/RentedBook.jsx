// components/RentedBook.jsx
import React, { useEffect, useState } from "react";
import { message, Empty, Row, Col, Pagination, Spin } from "antd";
import RentedBookCard from "../RentedBookCard/RentedBookCard";
import axiosInstance from "../../api/axiosInstance";

export default function RentedBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/users/rentedBook?page=${page}&limit=5`
      );
      setBooks(res.data.data.items);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      if (err.response?.status === 404) {
        setBooks([]);
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

  if (!loading && books.length === 0) {
    return (
      <Empty
        description="Bạn chưa thuê cuốn sách nào"
        style={{ marginTop: 40 }}
      />
    );
  }

  return (
    <div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {books.map((book) => (
            <Col xs={24} sm={12} md={8} lg={6} key={book._id}>
              <RentedBookCard
                _id={book._id}
                title={book.content.title}
                cover_image={book.content.cover_image}
                rentDate={book.since}
                returnDate={book.end}
                onwaiting={book.onwaiting}
              />
            </Col>
          ))}
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
