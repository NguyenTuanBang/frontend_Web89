export const getUserFromLocalStorage = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_URL_API}/users/getProfile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      // Redirect chỉ khi ở protected page, ví dụ bạn kiểm tra bên component
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy user:', error);
    return null;
  }
};
