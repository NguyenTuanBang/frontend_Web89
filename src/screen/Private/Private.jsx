import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserFromLocalStorage } from '../../assets/getToken';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUserFromLocalStorage();
      setUser(u);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return null; // hoặc loader

  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
