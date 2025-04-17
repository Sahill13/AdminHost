import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      let cafeteriaId = sessionStorage.getItem("cafeteriaId") || "mblock";
      cafeteriaId = cafeteriaId.trim().toLowerCase();

      console.log("📌 Fetching Paid Orders for Cafeteria:", cafeteriaId);

      const response = await axios.get(`${url}/api/order/list?cafeteriaId=${cafeteriaId}`);
      console.log("📥 API Response:", response.data);

      if (response.data.success) {
        console.log("📌 Total Orders Received:", response.data.data.length);

        const paidOrders = response.data.data.filter(order => order.payment === true);
        console.log("✅ Filtered Paid Orders:", paidOrders.length);

        setOrders([...paidOrders].sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else {
        toast.error("⚠️ Error fetching orders");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  return (
    <div className="content">
      <div className='order add'>
        <h3>Order Page</h3>
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="" />
              <div>
                <h4>Order #{order.orderNumber || "N/A"}</h4>
                <div className="order-type-label">
                {order.orderType === 'Takeaway' ? '🛍️ Takeaway' : '🚚 Delivery'}
                </div>
                <p className='order-item-food'>
                  {order.items.map((item, index) => (
                    index === order.items.length - 1
                      ? `${item.name} x${item.quantity}`
                      : `${item.name} x${item.quantity}, `
                  ))}
                </p>

                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>

                {order.orderType === "Takeaway" ? (
                  <div className="order-item-address">
                    <p><strong>Pickup from cafeteria</strong></p>
                    {order.pickupTime && (
                      <p><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                  </div>
                ) : (
                  <div className="order-item-address">
                    <p>Block: {order.address.block}, Hostel: {order.address.hostel}</p>
                    <p>
                      Floor: {order.address.floorNo}, Room: {order.address.roomNo},{" "}
                      {order.address.anyOtherLocation}
                    </p>
                  </div>
                )}

                <p className='order-item-phone'>{order.address.phone}</p>

                <p className="order-item-time">
                  <strong>Placed at:</strong>
                  <span className="order-date">
                    {order.date ? new Date(order.date).toLocaleDateString("en-IN") : "Date not available"}
                  </span>{" "}
                  <span className="order-time">
                    {order.date ? new Date(order.date).toLocaleTimeString("en-IN") : "Time not available"}
                  </span>
                </p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                {order.orderType !== "Takeaway" && <option value="Out for delivery">Out for delivery</option>}
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
