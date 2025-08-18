import { useState, useEffect } from 'react';
import './App.css';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './comp/Nav/Nav';
import Login from './screen/login/login';
import HomePage from './screen/homePage/homePage';
import Register from './screen/register/register';
import Information from './comp/userInfo/userInfo';
import RentedBook from './comp/RentedBook/RentedBook';
import MyProfile from './screen/userProfile/userProfile';
import { getUserFromLocalStorage } from './assets/getToken.jsx';
import PrivateRoute from './screen/Private/Private.jsx';
import Admin from './screen/admin/admin.jsx';
import BookDetail from './screen/BookDetail/BookDetail.jsx';
import Library from './screen/Library/library.jsx';
import MyRequests from './comp/RequestShow/RequestShow.jsx';
import UsersView from './comp/adminUser/MangeUser.jsx';
import BooksView from './comp/adminBook/ManageBook.jsx';
import RequestsView from './comp/adminRequest/ManageRequest.jsx';

function App() {
  const [user, setUser] = useState({}); // bắt đầu với null
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUserFromLocalStorage();
      setUser(u);
      setLoading(false);
    };
    fetchUser();
  }, []);

  // ví dụ kiểm tra loading
  if (loading) return null; // hoặc <Spin /> nếu muốn hiển thị loading


  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar user={user} setUser={setUser} loading={loading}/>}
      <Routes>
        <Route path='/' element={<HomePage user={user} />} />
        <Route path='/login' element={user ? <Navigate to='/' replace /> : <Login setUser={setUser} />} />
        <Route path='/register' element={user ? <Navigate to='/' replace /> : <Register />} />
        <Route path='/myProfile' element={!user ? <Navigate to='/login' replace /> : <MyProfile user={user} setUser={setUser}/>}>
          <Route index element={<Navigate to='info' replace />} />
          <Route path='info' element={<Information user={user} setUser={setUser}/>} />
          <Route path='rentedBook' element={<RentedBook user={user} />} />
          <Route path='request' element={<MyRequests user = {user}/>} />
        </Route>
        <Route path='/manage' element={<PrivateRoute> <Admin user={user}/></PrivateRoute>}>
          <Route index element={<Navigate to='user' replace />} />
          <Route path='user' element={<UsersView user={user} />} />
          <Route path='book' element={<BooksView user={user} />} />
          <Route path='request' element={<RequestsView user = {user}/>} />
        </Route>
        <Route path="/book/:id" element={<BookDetail user={user}/>} />
        <Route path="/library" element={<Library user={user}/>} />
      </Routes>
    </>
  );
}

export default App;
