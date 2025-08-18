import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";




const Login = ({setUser}) => {
    const apiLink = `${import.meta.env.VITE_URL_API}/login`;
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        try {
            const res = await axios.post(apiLink, {
                email: values.email,
                password: values.password
            });

            localStorage.setItem("token", res.data.token);
            setError(null);
            // nếu không thì gọi check-token để lấy user
            const userRes = await axios.get(`${import.meta.env.VITE_URL_API}/users/check-token`, {
                headers: { Authorization: `Bearer ${res.data.token}` }
            });
            setUser(userRes.data.data);
            navigate("/");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError(err.response.data.message || "Invalid email or password");
            } else {
                setError("Server error. Please try again later.");
            }
        }
    };

    return (
        <div
            className="relative flex justify-center items-center min-h-screen w-full overflow-hidden"
            style={{
                backgroundImage: "url('/rs-library20of20el20escorial20rj455f.jpg.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Log In
                </h1>

                <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            style={{ marginBottom: 20 }}
                        />
                    )}

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

                    <Form.Item
                        label="Password:"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Type your password" />
                    </Form.Item>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600">
                            Don’t have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-500 hover:underline"
                                onClick={() => navigate("/register")}
                            >
                                Click here
                            </button>
                        </span>
                        <Button
                            htmlType="submit"
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Login
                        </Button>
                    </div>
                </Form>
            </div>
        </div>

    );
};

export default Login;
