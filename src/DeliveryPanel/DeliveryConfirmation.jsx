import { useState } from "react";
import axios from "axios";

const DeliveryConfirmation = ({ orderId, userId, deliveryPersonId }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const verifyCode = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/orders/${orderId}/verify-security-code`, {
        securityCode: code,
        userId,
        deliveryPersonId
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error || "Error verifying code");
    }
  };

  return (
    <div>
      <h2>Enter Security Code to Confirm Delivery</h2>
      <input
        type="text"
        placeholder="Enter 4-digit code"
        maxLength="4"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={verifyCode}>Confirm Delivery</button>
      <p>{message}</p>
    </div>
  );
};

export default DeliveryConfirmation;
