import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Button, message, Spin } from 'antd';
import { BookOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';


const Navbar = ({ user, setUser, loading }) => {
  const navigate = useNavigate();
  console.log(user)
  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      user?.username || 'User'
    )}`;

  const handleLogout = () => {
    localStorage.removeItem("token")// xóa user trong context và token,
    setUser(null)
    message.success('Đã đăng xuất');
  };

  const userMenu = [
    { key: 'profile', label: 'Trang cá nhân', icon: <UserOutlined /> },
    { key: 'library', label: 'Library', icon: <BookOutlined /> },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
  ];

  const adminMenu = [
    { key: 'manage', label: 'Manage', icon: <UserOutlined /> },
    { key: 'library', label: 'Library', icon: <BookOutlined /> },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
  ];

  const onMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/myprofile');
        break;
      case 'library':
        navigate('/library');
        break;
      case 'manage':
        navigate('/manage');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-10">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src="/logo.png" alt="Logo" className="w-30 h-30 object-cover" />
        <span className="text-xl font-bold text-blue-600">MyLibrary</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {loading ? (
          <Spin size="small" />
        ) : !user ? (
          <>
            <Button type="link" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Đăng ký
            </Button>
          </>
        ) : (
          <Dropdown
            menu={{ items: user.role === 'Admin' ? adminMenu : userMenu, onClick: onMenuClick }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar
              src={avatarUrl}
              size={60}
              style={{ cursor: 'pointer' }}
            >
              {!avatarUrl && user.username?.[0].toUpperCase()}
            </Avatar>
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
