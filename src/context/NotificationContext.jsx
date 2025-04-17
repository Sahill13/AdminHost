import React, { createContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children,cafeteriaId }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const previousOrderCount = useRef(0);
  const url = import.meta.env.VITE_BACKEND_URL;

  const fetchPendingOrders = async () => {
    try {
      const cafeteriaId = localStorage.getItem("cafeteriaId"); // ✅ Get cafeteriaId from storage
      if (!cafeteriaId) {
        console.error("❌ No cafeteriaId found in localStorage");
        return;
      }
  
      const response = await axios.get(`${url}/api/order/admin/pending?cafeteriaId=${cafeteriaId}`);
      console.log("API Response:", response.data);
  
      if (response.data.success) {
        const newOrders = response.data.orders;
  
        console.log("Previous Count:", previousOrderCount.current, "New Count:", newOrders.length);
        if (newOrders.length > previousOrderCount.current) {
          toast.info("New pending order has arrived!");
          previousOrderCount.current = newOrders.length;
        }
        setPendingOrders(newOrders);
      } else {
        console.error("Error in API response:", response.data.message);
      }
    } catch (error) {
      console.error("Error in fetchPendingOrders:", error.message);
      toast.error("Failed to fetch pending orders. Please check your connection.");
    }
  };
  

  useEffect(() => {
    let isMounted = true;
    const pollOrders = async () => {
      await fetchPendingOrders();
      if (isMounted) {
        setTimeout(pollOrders, 10000); // Poll every 10 seconds
      }
    };

    pollOrders();

    return () => {
      isMounted = false;
    };
  }, [cafeteriaId]);

  return (
    <NotificationContext.Provider value={{ pendingOrders }}>
      {children}
    </NotificationContext.Provider>
  );
};
