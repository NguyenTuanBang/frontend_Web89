import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../api/axiosInstance";
; // dùng axios instance

export default function Information({ user , setUser }) {
  console.log(user)
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [savedValues, setSavedValues] = useState({});

  const address = Form.useWatch("address", form);
  const dob = Form.useWatch("DOB", form);

  useEffect(() => {
    if (user) {
      const initial = {
        email: user.email || "",
        address: user.address || "",
        DOB: user.DOB ? dayjs(user.DOB) : null,
      };
      form.setFieldsValue(initial);
      setSavedValues(initial);
    }
  }, [user, form]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const payload = {
        address: values.address || null,
        DOB: values.DOB ? values.DOB.toDate() : null,
      };
      const response = await axiosInstance.post("/users/update-data", payload); // dùng instance
      message.success("Cập nhật thành công");

      setUser(response.data.user)

    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const isChanged =
    address !== savedValues.address ||
    (dob ? dob.format("YYYY-MM-DD") : null) !==
      (savedValues.DOB ? savedValues.DOB.format("YYYY-MM-DD") : null);

  return (
    <Form form={form} layout="vertical" onFinish={handleUpdate}>
      <Form.Item label="Email" name="email">
        <Input readOnly />
      </Form.Item>

      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>

      <Form.Item label="Date of Birth" name="DOB">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!isChanged}
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  );
}
