import React from "react";
import { Modal, Form, Input, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const BookModal = ({
  open,
  onCancel,
  onFinish,
  form,
  fileList,
  setFileList,
  genres,
}) => {
  return (
    <Modal
      title="Thêm sách mới"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      style={{ right: 0, top: 0, margin: 0, position: "fixed" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Tên sách"
          rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="author"
          label="Tác giả"
          rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Form.Item name="genre" label="Thể loại">
          <Select
            mode="tags"   // 👈 cho phép nhập thêm ngoài option có sẵn
            style={{ width: "100%" }}
            placeholder="Chọn hoặc nhập thêm thể loại"
            options={genres.map((g) => ({
              label: g.genre,
              value: g.genre,
            }))}
          />
        </Form.Item>

        <Form.Item name="shorted_content" label="Mô tả ngắn">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Ảnh bìa">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookModal;
