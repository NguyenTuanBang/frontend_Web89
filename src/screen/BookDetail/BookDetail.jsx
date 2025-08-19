// pages/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rate, Spin, Button, message, Tag } from "antd";
import axiosInstance from "../../api/axiosInstance";

export default function BookDetail({ user }) {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axiosInstance.get(`/books/getOneBook?id=${id}`);
                setBook(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy sách:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleRent = async () => {
        const confirmed = window.confirm(`Bạn có chắc muốn mượn cuốn "${book.title}"?`);
        if (!confirmed) return;
        if(user.role ==='User'){
            alert("Bạn không có quyền mượn sách, vui lòng nhập đầy đủ thông tin để sử dụng dịch vụ.");
            
            return
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Bạn cần đăng nhập để mượn sách.");
                return;
            }
            await axiosInstance.post(
                "/users/rent_book",
                { bookId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Yêu cầu mượn sách thành công, vui lòng đợi");
        } catch (err) {
            console.error(err);
            alert(`${err.response?.data?.message || "Có lỗi xảy ra khi mượn sách."} Vui lòng điền đầy đủ thông tin cá nhân.`);
            navigate("/myProfile/info");
        }
    };

    if (loading) return <Spin style={{ marginTop: "50px" }} />;

    return (
        <div
            style={{
                padding: "20px",
                display: "flex",
                gap: "40px",
                alignItems: "flex-start"
            }}
        >
            {/* Cột ảnh bên trái */}
            <div style={{ flex: "0 0 40vw" }}>
                <img
                    src={book.cover_image || "https://via.placeholder.com/200"}
                    alt={book.title}
                    style={{
                        width: "40vw",
                        height: "60vh",
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                />
            </div>

            {/* Cột thông tin bên phải */}
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "60vh"
                }}
            >
                {/* Thông tin sách */}
                <div>
                    <h1 style={{ marginBottom: "10px", fontSize: "300%", textAlign: "center" }}>
                        {book.title}
                    </h1>

                    {/* Genres */}
                    {book.genre && Array.isArray(book.genre) && book.genre.length > 0 && (
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            {book.genre.map((g) => (
                                <Tag key={g._id} color="blue" style={{ fontSize: "14px", padding: "2px 8px" }}>
                                    {g.genre}
                                </Tag>
                            ))}
                        </div>
                    )}

                    {book.shorted_content && (
                        <p
                            style={{
                                fontStyle: "italic",
                                color: "#666",
                                marginBottom: "20px",
                                marginTop: "20px",
                                height: "160px",
                                overflowY: "auto",
                                lineHeight: "1.6"
                            }}
                        >
                            {book.shorted_content}
                        </p>
                    )}

                    <p style={{ marginTop: "20px" }}>👁 {book.reader_counting} lượt đọc</p>
                    <p style={{ marginTop: "20px" }}>Số lượng tồn: {book.avail_quantity}</p>
                    <div style={{ marginTop: "20px" }}>
                        <Rate disabled allowHalf defaultValue={book.curRating} />
                    </div>
                </div>

                {/* Nút thuê sách */}
                <div style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        disabled={!user || user.isBan}
                        onClick={handleRent}
                        style={{ width: "200px" }}
                    >
                        Thuê sách
                    </Button>
                </div>
            </div>
        </div>
    );
}
