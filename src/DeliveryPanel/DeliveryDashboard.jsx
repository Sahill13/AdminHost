import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./DeliveryDashboard.css";

const DeliveryDashboard = ({ url, auth ,setAuth }) => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [securityCode, setSecurityCode] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Restore auth from localStorage if page is refreshed
    if (!auth?.token) {
      const storedBlock = sessionStorage.getItem("deliveryBlock");
      const token = storedBlock ? localStorage.getItem(`deliveryToken_${storedBlock}`) : null;

      if (token && storedBlock) {
        setAuth({ token, block: storedBlock }); // ✅ Restore auth correctly
      } else {
        navigate("/delivery-login");
        return;
      }
    }
    if (auth?.block){
    fetchAssignedOrders();
    }
  }, [auth]);


  const getValidToken = async () => {
    const storedBlock = auth?.block || localStorage.getItem("deliveryBlock");
    if (!storedBlock) {
      toast.error("Session expired. Please log in again.");
      handleLogout();
      return null;
    }
    let token = localStorage.getItem(`deliveryToken_${storedBlock}`);
    const refreshToken = localStorage.getItem(`refreshToken_${storedBlock}`);

    if (!token || !refreshToken) {
      toast.error("Session expired. Please log in again.");
      handleLogout();
      return null;
    }

    try {
      const response = await axios.post(`${url}/api/delivery/refresh-token`, { refreshToken });

      if (response.data.success) {
        localStorage.setItem(`deliveryToken_${storedBlock}`, response.data.token);
        return response.data.token;
      } else {
        toast.error("Session expired. Please log in again.");
        handleLogout();
        return null;
      }
    } catch (error) {
      console.error("❌ Token Refresh Failed:", error.response?.data || error);
      toast.error("Session expired. Please log in again.");
      handleLogout();
      return null;
    }
  };

  const fetchAssignedOrders = async () => {
    try {
      let token = await getValidToken();
      if (!token) return;
  
      const storedBlock = auth?.block || "mblock"; // ✅ Ensure correct block usage
      const tokenFromStorage = localStorage.getItem(`deliveryToken_${storedBlock}`);
  
      console.log("📌 Auth Block:", storedBlock); 
      console.log("🔑 Using Token:", tokenFromStorage);
  
      if (!storedBlock) {
        toast.error("Error: Delivery block not found. Please re-login.");
        handleLogout();
        return;
      }
  
      console.log("📌 Fetching orders for Block:", storedBlock);
  
      const response = await axios.get(`${url}/api/order/delivery/orders`, {
        headers: { Authorization: `Bearer ${tokenFromStorage}` },
        params: { block: storedBlock }  // ✅ Fetch only orders for the correct block
      });
  
      console.log("📥 API Response:", response.data);
  
      if (response.data.success) {
        // ✅ Ensure only orders for the correct block are stored
        const filteredOrders = response.data.orders.filter(order => 
          order.cafeteriaId.toLowerCase() === storedBlock.toLowerCase()
        );
  
        console.log("✅ Filtered Orders for Block:", filteredOrders);
        setAssignedOrders(filteredOrders);
      } else {
        toast.error("⚠️ Failed to fetch orders.");
      }
    } catch (error) {
      console.error("❌ Error fetching delivery orders:", error.response?.data || error);
      toast.error("Error fetching delivery orders");
    }
  };
  

  const openSecurityCodeModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleSecurityCodeSubmit = async () => {
    if (!securityCode) {
      toast.error("Security code is required!");
      return;
    }

    try {
      let token = await getValidToken();
      if (!token) return;

      const response = await axios.post(
        `${url}/api/delivery/deliver/${selectedOrder._id}`,
        { securityCode, userId: selectedOrder.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order marked as delivered");
        setShowModal(false);
        setSecurityCode("");
        fetchAssignedOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error);
      toast.error("Error updating delivery status");
    }
  };

  const handleLogout = () => {
    const block = auth?.block;
    if (block) {
      localStorage.removeItem(`deliveryToken_${block}`);
      localStorage.removeItem("deliveryBlock");
      localStorage.removeItem(`refreshToken_${block}`); // ✅ Ensure refresh token is removed
    }
    setAuth(null);
    navigate("/delivery-login");
  };

  return (
    <div className="delivery-dashboard">
      <h2>Delivery Dashboard  - {auth.block?.toUpperCase()} </h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      {assignedOrders.length === 0 ? (
        <p>No orders assigned</p>
      ) : (
        assignedOrders.filter(order => {
          const storedBlock = auth?.block || "mblock"; // ✅ Default to mblock
          return storedBlock && order.cafeteriaId.toLowerCase() === storedBlock.toLowerCase();
        }) // ✅ Only show orders for this block
        .map((order, index) => (
          <div key={index} className="order-item">
            <div>
              <p className="order-item-food">Order Number#{order.orderNumber || "N/A"}</p>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>
            </div>
            <div className="order-item-address">
              <p>{order.address.block}, {order.address.hostel}</p>
              <p>
                Floor: {order.address.floorNo}, Room: {order.address.roomNo},{" "}
                {order.address.anyOtherLocation}
              </p>
            </div>
            <div className="order-item-phone">
              <p>{order.address.phone}</p>
            </div>
            <div className="order-item-status">
              <p>Status: {order.status}</p>
            </div>
            {/* ✅ Added Date & Time Here */}
            <div className="order-item-time">
              <strong>Placed at:</strong>
              {/* <span className="order-date">
                {order.date ? new Date(order.date).toLocaleDateString("en-IN") : "Date not available"}
              </span> */}
              <span className="order-time">
                {order.date ? new Date(order.date).toLocaleTimeString("en-IN") : "Time not available"}
              </span>
            </div>
            <div className="order-item-action">
              <button onClick={() => openSecurityCodeModal(order)}>Mark as Delivered</button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Security Code</h3>
            <input
              type="text"
              placeholder="Enter security code"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSecurityCodeSubmit}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
