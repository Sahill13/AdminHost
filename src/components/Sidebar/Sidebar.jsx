import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const Sidebar = ({ setAdminAuth }) => {
  const navigate = useNavigate();
  let { cafeteriaId } = useParams();
cafeteriaId = (cafeteriaId || sessionStorage.getItem("cafeteriaId") || "mblock")
  .trim().toLowerCase().replace(/\s+/g, '-');

  const handleLogout = () => {
    sessionStorage.removeItem(`adminToken_${cafeteriaId}`); // ✅ Remove admin token
    setAdminAuth(false); // ✅ Update authentication state
    navigate(`/admin/${cafeteriaId}/login`); // ✅ Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to={`/admin/${cafeteriaId}/add-food`} className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to={`/admin/${cafeteriaId}/list`} className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to={`/admin/${cafeteriaId}/orders`} className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to={`/admin/${cafeteriaId}/orders/pending`} className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Pending Orders</p>
        </NavLink>
      </div>
      <div className="sidebar-logout">
        <div className="sidebar-option" onClick={handleLogout}>
          <img src={assets.logout_icon} alt="Logout" />
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
