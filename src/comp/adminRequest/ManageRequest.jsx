import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Button, Space, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";

const { Search } = Input;

const RequestsView = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async (page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/admin/manage-request?pageSize=${size}&pageNumber=${page}`
      );
      const { data: result } = res;
      setData(result.data);
      setTotalItems(result.totalItems);
      setPageNumber(result.currentPage);
    } catch (err) {
      console.error("Lỗi lấy requests:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(pageNumber, pageSize);
  }, []);

  const handleDecision = async (requestId, isAccept, isReturn) => {
    try {
      if (!isAccept) {
        // Từ chối request thì dùng chung route reject
        await axiosInstance.post("/admin/manage-request/reject", {
          request_Id: requestId,
        });
      } else {
        // Chấp nhận request
        const url = isReturn
          ? "/admin/manage-request/return"
          : "/admin/manage-request/borrow";

        await axiosInstance.post(url, {
          request_Id: requestId,
        });
      }

      message.success(isAccept ? "Đã chấp nhận" : "Đã từ chối");
      getData(pageNumber, pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi xử lý yêu cầu");
    }
  };


  const columns = [
    {
      title: "STT",
      render: (_, __, i) => (pageNumber - 1) * pageSize + i + 1
    },
    {
      title: "Người gửi",
      dataIndex: "from",
      render: (from) => {
        const avatarUrl = from?.avatar
          ? from.avatar
          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            from?.username || "U"
          )}`;
        return (
          <Space>
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: 32, height: 32, borderRadius: "50%" }}
            />
            <span>{from?.username}</span>
          </Space>
        );
      },
    },
    {
      title: "Sách",
      dataIndex: "content",
      render: (content) => (
        <Space>
          {content?.cover_image && (
            <img
              src={content.cover_image}
              alt="book"
              style={{
                width: 40,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          )}
          <span>{content?.title}</span>
        </Space>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "since",
      render: (since) => new Date(since).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hạn trả",
      dataIndex: "overdue",
      render: (overdue) => new Date(overdue).toLocaleDateString("vi-VN"),
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "isReturn",
      render: (isReturn) =>
        isReturn ? (
          <Tag color="orange">Trả sách</Tag>
        ) : (
          <Tag color="blue">Mượn sách</Tag>
        ),
    },
    {
      title: "Trạng thái",
      render: (_, record) => {
        if (!record.isRespone) {
          return (
            <Space>
              <Button
                type="primary"
                onClick={() => handleDecision(record._id, true, record.isReturn)}
              >
                Accept
              </Button>
              <Button
                danger
                onClick={() => handleDecision(record._id, false, record.isReturn)}
              >
                Reject
              </Button>
            </Space>
          );
        }
        return record.reply === "Accepted" ? (
          <Tag color="green">Accepted</Tag>
        ) : (
          <Tag color="red">Rejected</Tag>
        );
      },
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}
      >
        <h2>Quản lý yêu cầu</h2>
        <Space>
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
            setPageNumber(p);
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

export default RequestsView;
