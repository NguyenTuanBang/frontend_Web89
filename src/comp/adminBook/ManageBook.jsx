import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Switch,
  message,
  Modal,
  Form,
  Upload,
} from "antd";
import { ReloadOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import BookModal from "../BookModal/BookModal";

const { Search } = Input;

const BooksView = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [genres, setGenres] = useState([]);

  const getGenres = async () => {
    try {
      const res = await axiosInstance.get("/genres");
      setGenres(res.data.data || []); // backend trả { message, data }
    } catch (err) {
      message.error("Lỗi lấy thể loại");
    }
  };

  const getData = async (page = 1, size = pageSize, search = "") => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/admin/manage-book?pageSize=${size}&pageNumber=${page}&search=${search}`
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
    getData(pageNumber, pageSize, searchText);
    getGenres();
  }, []);

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      getData(1, pageSize, searchText);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleToggleDeploy = async (bookId) => {
    try {
      await axiosInstance.post(`/admin/manage-book/unDeploy`, { bookId });
      message.success("Cập nhật trạng thái thành công");
      setData((prev) =>
        prev.map((book) =>
          book._id === bookId ? { ...book, onDeploy: !book.onDeploy } : book
        )
      );
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "STT",
        render: (_, __, i) => (pageNumber - 1) * pageSize + i + 1,
      },
      {
        title: "Sách",
        render: (record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={record.cover_image || "/default-book.png"}
              alt="book"
              style={{
                width: 50,
                height: 70,
                objectFit: "cover",
                borderRadius: 4,
                marginRight: 12,
              }}
            />
            <span style={{ fontWeight: 600 }}>{record.title}</span>
          </div>
        ),
      },
      { title: "Tác giả", dataIndex: "author" },
      {
        title: "Thể loại",
        render: (record) =>
          record.genre && record.genre.length > 0
            ? record.genre.map((g) => g.genre).join(", ")
            : "Chưa có",
      },
      {
        title: "Số lượng",
        render: (record) => `${record.avail_quantity}/${record.quantity}`,
      },
      {
        title: "Trạng thái hiển thị",
        key: "onDeploy",
        render: (record) => (
          <Switch
            checked={record.onDeploy}
            onChange={() => handleToggleDeploy(record._id)}
          />
        ),
      },
    ],
    [pageNumber, pageSize]
  );

const handleCreate = async (values) => {
  if (fileList.length === 0) {
    message.error("Vui lòng chọn ảnh bìa!");
    return;
  }
  const formData = new FormData();
  formData.append("file", fileList[0].originFileObj);
  formData.append("title", values.title);
  formData.append("author", values.author);
  formData.append("quantity", values.quantity);
  formData.append("shorted_content", values.shorted_content || "");
  formData.append("postedBy", "admin"); // hoặc lấy từ user context

  if (values.genre && Array.isArray(values.genre)) {
    values.genre.forEach((g) => formData.append("genre[]", g.trim()));
  }

  try {
    await axiosInstance.post("/admin/manage-book", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    message.success("Thêm sách thành công");
    setOpenModal(false);
    form.resetFields();
    setFileList([]);
    getData(pageNumber, pageSize, searchText);
  } catch (err) {
    message.error(err.response?.data?.message || "Thêm sách thất bại");
  }
};


  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Quản lý sách</h2>
        <Space>
          <Search
            placeholder="Tìm kiếm sách"
            style={{ width: 200 }}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button icon={<ReloadOutlined />} onClick={() => getData()}>
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(true)}
          >
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
            getData(p, s, searchText);
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng: ${total}`,
        }}
      />

      {/* Modal thêm sách */}
      <BookModal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          form.resetFields();
          setFileList([]);
        }}
        onFinish={handleCreate}
        form={form}
        fileList={fileList}
        setFileList={setFileList}
        genres={genres}   // 👈 truyền xuống
      />

    </div>
  );
};

export default BooksView;
