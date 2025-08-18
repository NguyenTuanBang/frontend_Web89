// pages/Library.jsx
import React, { useEffect, useState } from "react";
import { Typography, Pagination, Spin } from "antd";
import axios from "axios";
import BookCard from "../../comp/BookCard/BookCard";


const { Title } = Typography;

export default function Library({user}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 25; // mặc định theo backend

  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API}/books/getAll?pageNumber=${page}&pageSize=${pageSize}`
      );

      setBooks(response.data.data);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 100}}>
        📚 Thư viện sách
      </Title>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              gap: "16px",
              minHeight: "70vh", // để tránh layout nhảy khi load
            }}
          >
            {books.map((book) => (
              <BookCard
                key={book._id}
                _id={book._id}
                cover_image={book.cover_image}
                title={book.title}
                rate={book.curRating}
                reading_count={book.reader_counting}
                genre={book.genre}
                shorted_content={book.shorted_content}
              />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger={false} // ✅ bỏ chọn số sách mỗi trang
            />
          </div>
        </>
      )}
    </div>
  );
}
