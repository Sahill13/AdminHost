import React, { useEffect, useState } from 'react';
// Import Admin panel components
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Add from './pages/Add/Add';
import Orders from './pages/Orders/Orders';
import List from './pages/List/List';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PendingOrders from './pages/PendingOrders/PendingOrders';
import { NotificationProvider } from './context/NotificationContext';
// Import Delivery Personnel Components
import DeliveryDashboard from './DeliveryPanel/DeliveryDashboard';
import Login from './DeliveryPanel/Login';
import AddDeliveryPerson from './DeliveryPanel/AddDeliveryPerson';
import AdminLogin from './AdminPanel/AdminLogin';
import AddAdmin from './AdminPanel/AddAdmin';

const App = () => {
  const url = import.meta.env.VITE_BACKEND_URL ;
  console.log("🔗 Backend URL:", url);
  console.log("backend URL",import.meta.env.VITE_BACKEND_URL);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get the current route

  const pathParts = location.pathname.split("/");
  const cafeteriaId = pathParts[2] || sessionStorage.getItem("cafeteriaId") || "mblock";
  sessionStorage.setItem("cafeteriaId", cafeteriaId.trim());

    const storedBlock = sessionStorage.getItem("deliveryBlock");
    const token = storedBlock ? localStorage.getItem(`deliveryToken_${storedBlock}`):null;
    const [auth, setAuth] = useState(token && storedBlock  ? { token, block:storedBlock } : null);


useEffect(() => {
  if (auth) {
    localStorage.setItem("deliveryToken_${auth.block}", auth.token);
    sessionStorage.setItem("deliveryBlock", auth.block);
  }
}, [auth]);

useEffect(() => {
  console.log("🔍 Auth Updated:", auth);
}, [auth]);

  const storedCafeteriaId = sessionStorage.getItem("cafeteriaId") || "mblock";
  const [adminAuth, setAdminAuth] = useState(!!sessionStorage.getItem(`adminToken_${storedCafeteriaId}`));

  const isDeliveryRoute = location.pathname.startsWith("/delivery-");

  const handleAdminLogout = () => {
    sessionStorage.removeItem(`adminToken_${cafeteriaId}`);
    setAdminAuth(false);
    navigate(`/admin/${cafeteriaId}/login`);
  };

  return (
    <NotificationProvider cafeteriaId={cafeteriaId}>
      <div>
        <ToastContainer />
        {adminAuth && <Navbar cafeteriaId={cafeteriaId} handleLogout={handleAdminLogout} />} {/* ✅ Show only if admin is logged in */}
        <hr />
        <div className="app-content">
          {adminAuth && !isDeliveryRoute && <Sidebar setAdminAuth={setAdminAuth} cafeteriaId={cafeteriaId} />} {/* ✅ Sidebar only for logged-in admin */}

          <Routes>
            {/* ✅ Redirect default admin login to a specific cafeteria */}
            <Route path="/admin-login" element={<Navigate to={`/admin/${storedCafeteriaId}/login`} />} />


            {/* ✅ Admin Panel Routes with cafeteriaId */}
            <Route path="/admin/:cafeteriaId/login" element={<AdminLogin url={url} setAdminAuth={setAdminAuth} />} />
            <Route path="/" element={<Navigate to={adminAuth ? `/admin/${cafeteriaId}/orders/pending` : `/admin/${cafeteriaId}/login`} />} />
            <Route path="/admin/:cafeteriaId/add-admin" element={adminAuth ? <AddAdmin url={url} /> : <Navigate to={`/admin/${cafeteriaId}/login`} />} />
            <Route path="/admin/:cafeteriaId/orders/pending" element={adminAuth ? <PendingOrders url={url} cafeteriaId={cafeteriaId} /> : <Navigate to={`/admin/${cafeteriaId}/login`} />} />
            <Route path="/admin/:cafeteriaId/orders" element={adminAuth ? <Orders url={url} /> : <Navigate to={`/admin/${cafeteriaId}/login`} />} />
            <Route path="/admin/:cafeteriaId/add-food" element={adminAuth ? <Add url={url} /> : <Navigate to={`/admin/${cafeteriaId}/login`} />} />
            <Route path="/admin/:cafeteriaId/list" element={adminAuth ? <List url={url} /> : <Navigate to={`/admin/${cafeteriaId}/login`} />} />

            {/* ✅ Delivery Personnel Panel Routes */}
            <Route path="/delivery-login" element={<Login url={url} setAuth={setAuth} />} />
            <Route path="/delivery-dashboard" element={auth ? <DeliveryDashboard url={url} auth={auth} setAuth={setAuth} /> : <Navigate to="/delivery-login" />} />
            <Route path="/delivery/add" element={auth ? <AddDeliveryPerson url={url} /> : <Navigate to="/delivery-login" />} />
          </Routes>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;
