// pages/homePage/homePage.jsx
import React, { useEffect, useState } from "react";
import { Carousel, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard from "../../comp/BookCard/BookCard";

const { Title } = Typography;

export default function HomePage() {
  const [topBooks, setTopBooks] = useState([]);
  const [mostFavour, setMostFavour] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  // const baseURL = `${import.meta.env.VITE_URL_API_Test}/books`;
  const baseURL = `${import.meta.env.VITE_URL_API}/books`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTop, resFavour, resAll] = await Promise.all([
          axios.get(`${baseURL}/getMostReader`),
          axios.get(`${baseURL}/getMostFavour`),
          axios.get(`${baseURL}/getAll`)
        ]);
        setTopBooks(resTop.data.data);
        setMostFavour(resFavour.data.data);
        setAllBooks(resAll.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Hàm tạo carousel slide với nhóm 5 sách
  const renderCarousel = (books) => (
    <Carousel
      autoplay
      autoplaySpeed={3000}
      dots={false}
      style={{ padding: "10px 0" }}
    >
      {Array.from({ length: Math.ceil(books.length / 5) }).map((_, i) => {
        const group = books.slice(i * 5, i * 5 + 5);
        return (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                padding: "10px 0",
                flexWrap: "nowrap"
              }}
            >
              {group.map((book) => (
                <BookCard
                  key={book._id}
                  _id={book._id}  // ✅ truyền id để click navigate đúng
                  cover_image={book.cover_image}
                  title={book.title}
                  rate={book.curRating}
                  reading_count={book.reader_counting}
                  genre={book.genre}
                />
              ))}
            </div>
          </div>
        );
      })}
    </Carousel>
  );

  return (
    <div style={{ padding: 20 }}>
      {/* Đọc nhiều nhất */}
      <Title level={3} style={{ textAlign: "center" }}>📚 Đọc nhiều nhất</Title>
      {renderCarousel(topBooks)}

      {/* Rating cao nhất */}
      <Title level={3} style={{ marginTop: 40, textAlign: "center" }}>⭐ Rating cao nhất</Title>
      {renderCarousel(mostFavour)}

      {/* Tất cả sách */}
      <Title level={3} style={{ marginTop: 40, textAlign: "center" }}>📖 Tất cả sách</Title>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          gap: "16px",
        }}
      >
        {allBooks.map((book) => (
          <BookCard
            key={book._id}
            _id={book._id}  // ✅ truyền id
            cover_image={book.cover_image}
            title={book.title}
            rate={book.curRating}
            reading_count={book.reader_counting}
            genre={book.genre}
            shorted_content={book.shorted_content}
          />
        ))}
      </div>

      {/* Nút xem thêm */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Button type="primary" onClick={() => navigate("/library")}>
          Xem thêm →
        </Button>
      </div>
    </div>
  );
}
