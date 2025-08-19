import React, { useEffect, useState, useMemo } from "react";
import { Table, Tag, Input, Button, Space, Avatar, Switch, message } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const { Search } = Input;

const UsersView = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // debounce searchText
  const debouncedSearch = useMemo(() => {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSearchText(value);
      }, 500); // delay 0.5s
    };
  }, []);

  const getData = async (page = 1, size = pageSize, query = "") => {
    try {
      setLoading(true);
      let url = `/admin/manage-user/all?pageSize=${size}&pageNumber=${page}`;
      if (query) {
        url = `/admin/manage-user/search?query=${encodeURIComponent(query)}`;
      }

      const res = await axiosInstance.get(url);
      const { data: result } = res;

      const users = result.data.map((u) => {
        if (u.avatar) return u;
        const dicebearUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          u.username || "guest"
        )}`;
        return { ...u, avatar: dicebearUrl };
      });

      setData(users);
      setTotalItems(result.totalItems || users.length);
      setPageNumber(result.currentPage || 1);
    } catch (err) {
      console.error("Lỗi lấy users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(pageNumber, pageSize, searchText);
  }, [pageNumber, pageSize, searchText]);

  // Toggle status (giữ nguyên như cũ)
  const toggleStatus = async (record, checked) => {
    try {
      const newStatus = !checked;
      await axiosInstance.post(`/admin/manage-user/ban`, {
        User_Id: record._id,
        isBanned: newStatus,
      });

      message.success(checked ? "Đã mở khóa người dùng" : "Đã khóa người dùng");

      setData((prev) =>
        prev.map((u) =>
          u._id === record._id ? { ...u, isBanned: newStatus } : u
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err.message);
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const columns = [
    { title: "STT", dataIndex: "index", render: (_, __, i) => i + 1 },
    {
      title: "Tài khoản",
      dataIndex: "username",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} alt={record.username}>
            {record.username?.[0]?.toUpperCase()}
          </Avatar>
          <span>{record.username}</span>
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (address) => address || null,
    },
    { title: "Vai trò", dataIndex: "role" },
    {
      title: "Trạng thái",
      dataIndex: "isBanned",
      render: (isBanned, record) => (
        <Switch
          checked={!isBanned}
          checkedChildren="Hoạt động"
          unCheckedChildren="Bị khóa"
          onChange={(checked) => toggleStatus(record, checked)}
        />
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Quản lý người dùng</h2>
        <Space>
          <Search
            placeholder="Tìm kiếm người dùng"
            style={{ width: 200 }}
            onChange={(e) => debouncedSearch(e.target.value)}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={() => getData()}>
            Tải lại
          </Button>
        </Space>
      </div>

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
    </div>
  );
};

export default UsersView;
