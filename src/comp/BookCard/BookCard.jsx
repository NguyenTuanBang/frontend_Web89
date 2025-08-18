import React from "react";
import { Card, Rate, Tag } from "antd";
import { useNavigate } from "react-router-dom";

export default function BookCard({ _id, cover_image, title, rate, reading_count, genre, shorted_content }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/book/${_id}`);
    };

    return (
        <Card
            hoverable
            onClick={handleClick}
            cover={
                <img
                    alt={title}
                    src={cover_image || "/pngtree-lotus-book-cartoon-illustration-image_1433452.jpg"}
                    style={{ height: 300, objectFit: "cover" }}
                />
            }
            style={{ width: "20vw", height: "500px", display: "flex", flexDirection: "column" }}
        >
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Nội dung trên */}
                <div>
                    <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10, fontWeight: 500 }}>
                        {title}
                    </div>

                    {/* Genres */}
                    {genre && Array.isArray(genre) && genre.length > 0 && (
                        <div style={{ marginTop: "4px", textAlign: "center" }}>
                            {genre.map((g) => (
                                <Tag key={g._id} color="blue" style={{ fontSize: "12px" }}>
                                    {g.genre}
                                </Tag>
                            ))}
                        </div>
                    )}

                    {/* Short description */}
                    {shorted_content && (
                        <p
                            style={{
                                fontSize: 12,
                                color: "#666",
                                marginTop: 8,
                                textAlign: "center",
                            }}
                        >
                            {shorted_content.length > 30 ? shorted_content.slice(0, 30) + "..." : shorted_content}
                        </p>
                    )}
                </div>

                {/* Đẩy phần này xuống đáy */}
                <div style={{ marginTop: "auto" , alignItems: "center", textAlign: "center"}}>
                    <Rate disabled allowHalf defaultValue={rate || 0} style={{ fontSize: 14 }} />
                    <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#888" }}>
                        👁 {reading_count || 0} lượt đọc
                    </p>
                </div>
            </div>
        </Card>
    );
}
