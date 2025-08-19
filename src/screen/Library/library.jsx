// pages/Library.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Typography, Pagination, Spin, Select } from "antd";
import axios from "axios";
import BookCardBase from "../../comp/BookCard/BookCard.jsx";

const { Title } = Typography;
const { Option } = Select;

// Dùng React.memo để memo BookCard
const BookCard = React.memo(BookCardBase);

export default function Library({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  const pageSize = 25;

  // Lấy danh sách genre kèm quantity
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // const res = await axios.get(`${import.meta.env.VITE_URL_API_Test}/genres/`);
        const res = await axios.get(`${import.meta.env.VITE_URL_API}/genres/`);
        setGenres(res.data.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách genre:", err);
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  // Lấy sách theo page và genre
  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      let response;
      // if (!selectedGenre) {
      //   response = await axios.get(
      //     `${import.meta.env.VITE_URL_API_Test}/books/getAll?pageNumber=${page}&pageSize=${pageSize}`
      //   );
      // } else {
      //   response = await axios.get(
      //     `${import.meta.env.VITE_URL_API_Test}/books/getByGenre?genre=${selectedGenre}&pageNumber=${page}&pageSize=${pageSize}`
      //   );
      // }
      if (!selectedGenre) {
        response = await axios.get(
          `${import.meta.env.VITE_URL_API}/books/getAll?pageNumber=${page}&pageSize=${pageSize}`
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_URL_API}/books/getByGenre?genre=${selectedGenre}&pageNumber=${page}&pageSize=${pageSize}`
        );
      }

      setBooks(response.data.data);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error);
    } finally {
      setLoading(false);
    }
  };

  // Khi page hoặc genre thay đổi
  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage, selectedGenre]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
    setCurrentPage(1); // reset page về 1 khi filter
  };

  // Memo hóa JSX của books
  const booksElements = useMemo(() => {
    return books.map((book) => (
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
    ));
  }, [books]);

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        📚 Thư viện sách
      </Title>

      {/* Dropdown chọn genre */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Select
          style={{ width: 220 }}
          value={selectedGenre}
          onChange={handleGenreChange}
          placeholder="Chọn thể loại"
        >
          <Option value="">Tất cả</Option>
          {Array.isArray(genres) &&
            genres.map((g) => (
              <Option key={g._id} value={g.genre}>
                {`${g.genre} (${g.quantity})`}
              </Option>
            ))}
        </Select>
      </div>

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
              minHeight: "70vh",
            }}
          >
            {booksElements}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
