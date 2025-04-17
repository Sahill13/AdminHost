import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PendingOrders.css';

const PendingOrders = ({ url }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [cafeteriaId, setCafeteriaId] = useState(
    sessionStorage.getItem("cafeteriaId") || 
    localStorage.getItem("cafeteriaId") || 
    "mblock" // ✅ Default correct format
  );

  console.log("📝 CafeteriaId before API call:", cafeteriaId);

  useEffect(() => {
    sessionStorage.setItem("cafeteriaId", cafeteriaId.trim());
    setCafeteriaId(cafeteriaId.trim());
  }, []);

  useEffect(() => {
    const storedCafeteriaId = sessionStorage.getItem("cafeteriaId") || "mblock";
    if (storedCafeteriaId !== cafeteriaId) {
      setCafeteriaId(storedCafeteriaId.trim());
    }
  }, [sessionStorage.getItem("cafeteriaId")]); // ✅ React to sessionStorage changes

  // ✅ Fetch Pending Orders
  const fetchPendingOrders = async () => {
    const cafeteriaIdStored = sessionStorage.getItem("cafeteriaId")?.trim().toLowerCase().replace(/\s+/g, '-') || "mblock"; // ✅ Normalize
    console.log(`🚀 Fetching pending orders for cafeteria: ${cafeteriaIdStored}`);

    try {
      const response = await axios.get(`${url}/api/order/admin/pending?cafeteriaId=${cafeteriaIdStored}`);
      console.log("📥 API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.orders)) {
        console.log("✅ Orders to be displayed:", response.data.orders);
        setPendingOrders([...response.data.orders]); // ✅ Update state correctly
      } else {
        toast.error("⚠️ Error fetching pending orders");
        setPendingOrders([]); // ❌ Prevent old orders from persisting
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("Failed to fetch pending orders.");
      setPendingOrders([]); // ✅ Ensure UI updates correctly on failure
    }
  };

  useEffect(() => {
    console.log("📡 Fetching orders due to cafeteria change:", cafeteriaId);
    fetchPendingOrders();
  }, [cafeteriaId, url]);

  useEffect(() => {
    console.log("✅ UI Updated - Pending Orders State:", pendingOrders);
  }, [pendingOrders]);

  // ✅ Handle Accept Order
  const handleAccept = async (orderId) => {
    try {
      const response = await axios.patch(`${url}/api/order/${orderId}/approve`);
      if (response.data.success) {
        toast.success('✅ Order approved');
        fetchPendingOrders();
      } else {
        toast.error("⚠️ Failed to accept order");
      }
    } catch (error) {
      console.error("❌ Error accepting order:", error);
    }
  };

  // ✅ Handle Reject Order
  const handleReject = async (orderId) => {
    try {
      const response = await axios.patch(`${url}/api/order/${orderId}/reject`);
      if (response.data.success) {
        toast.error("❌ Order rejected");
        fetchPendingOrders();
      } else {
        toast.error("⚠️ Error rejecting order");
      }
    } catch (error) {
      console.error("❌ Error rejecting order:", error);
    }
  };

  return (
    <div className="content">
      <div className="pending-orders">
        <h2>Pending Orders</h2>

        {/* Debugging Log */}
        {console.log("📌 Current Pending Orders State:", pendingOrders)}

        {pendingOrders.length === 0 ? (
          <p className='no-pending-order'>No pending orders available.</p>
        ) : (
          pendingOrders.map((order) => (
            <div key={order._id} className="order-item">
              <img src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png" alt="Order" className="order-icon" />
              <div className="order-details">
                <h4 className="order-number">Order #{order?.orderNumber || "N/A"}</h4>
                <p className="order-item-food">
                  {order?.items?.map((item) => `${item.name} x${item.quantity}`).join(', ') || "No items"}
                </p>
                <p className="order-item-name">{order?.address?.firstName} {order?.address?.lastName}</p>
                {order.orderType === "Takeaway" ? (
  <div className="order-item-address">
    <p><strong>Takeaway Order</strong></p>
    {order.pickupTime && (
      <p><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}</p>
    )}
  </div>
) : (
  <div className="order-item-address">
    <p>Block: {order?.address?.block}, Hostel: {order?.address?.hostel}</p>
    <p>Floor: {order?.address?.floorNo}, Room: {order?.address?.roomNo}, {order?.address?.anyOtherLocation}</p>
  </div>
)}
                <p className="order-item-phone">{order?.address?.phone || "No phone available"}</p>
                <p className="order-item-time">
                  <strong>Placed at:</strong>
                  <span className="order-date">{order?.date ? new Date(order.date).toLocaleDateString("en-IN") : "Date not available"}</span>
                  <span className="order-time">{order?.date ? new Date(order.date).toLocaleTimeString("en-IN") : "Time not available"}</span>
                </p>
              </div>
              <div className="order-buttons">
                <button className="accept-btn" onClick={() => handleAccept(order._id)}>Accept</button>
                <button className="reject-btn" onClick={() => handleReject(order._id)}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingOrders;
