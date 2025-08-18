import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Button, Space } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const { Search } = Input;

const BooksView = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async (page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/admin/manage-book?pageSize=${size}&pageNumber=${page}`
      );
      const { data: result } = res;
      setData(result.data);
      setTotalItems(result.totalItems);
      setPageNumber(result.currentPage);
    } catch (err) {
      console.error("Lỗi lấy sách:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(pageNumber, pageSize);
  }, []);

  const columns = [
    { title: "STT", dataIndex: "index", render: (_, __, i) => i + 1 },
    { title: "Tựa sách", dataIndex: "title" },
    { title: "Tác giả", dataIndex: "author" },
    { title: "Thể loại", dataIndex: ["genre", "name"] },
    { title: "Số lượng", dataIndex: "quantity" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === "Còn hàng" ? (
          <Tag color="green">Còn hàng</Tag>
        ) : (
          <Tag color="red">Hết hàng</Tag>
        ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Quản lý sách</h2>
        <Space>
          <Search placeholder="Tìm kiếm sách" style={{ width: 200 }} />
          <Button icon={<ReloadOutlined />} onClick={() => getData()}>
            Tải lại
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo mới
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        rowKey={(r) => r._id}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pageNumber,
          pageSize,
          total: totalItems,
          onChange: (p, s) => {
            setPageSize(s);
            getData(p, s);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng: ${total}`,
        }}
      />
    </div>
  );
};

export default BooksView;
