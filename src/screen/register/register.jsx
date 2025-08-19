import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    // const apiLink = `${import.meta.env.VITE_URL_API_Test}/register`;
    const apiLink = `${import.meta.env.VITE_URL_API}/register`;
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            const payload = {
                username: values.username,
                email: values.email,
                password: values.password
            };

            await axios.post(apiLink, payload);
            setError(null);
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError("Email already exists!");
            } else {
                setError("Failed to connect to server. Please try again later.");
            }
        }
    };

    return (
        <div
            className="relative flex justify-center items-center min-h-screen px-4"
            style={{
                backgroundImage: "url('/rs-library20of20el20escorial20rj455f.jpg.webp')", // đổi tên file nếu khác
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >

            {/* Form đăng ký */}
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Let's get you started
                </h1>

                <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                    {error && (
                        <Alert type="error" message={error} style={{ marginBottom: 20 }} />
                    )}

                    {/* Username */}
                    <Form.Item
                        label="Username:"
                        name="username"
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input placeholder="Type your username" />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        label="Email:"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Invalid email format!" }
                        ]}
                    >
                        <Input placeholder="Type your email" />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Password:"
                        name="password"
                        rules={[
                            { required: true, message: "Please input your password!" },
                            { min: 8, message: "Password must be at least 8 characters." },
                            {
                                pattern: /[!@#$%^&*(),.?":{}|<>]/g,
                                message: "Password must contain at least one special character."
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Type your password" />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item
                        label="Confirm Password:"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("Passwords do not match!");
                                }
                            })
                        ]}
                    >
                        <Input.Password placeholder="Re-enter your password" />
                    </Form.Item>

                    {/* Submit */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-500 hover:underline"
                                onClick={() => navigate('/login')}
                            >
                                Click here
                            </button>
                        </span>
                        <Button
                            htmlType="submit"
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Sign up
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
