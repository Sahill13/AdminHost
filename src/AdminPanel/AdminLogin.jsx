import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminLogin.css';

const AdminLogin = ({ url, setAdminAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { cafeteriaId: urlCafeteriaId } = useParams(); // ✅ Get cafeteriaId from URL

  // ✅ Set cafeteriaId from URL, sessionStorage, or localStorage
  const [cafeteriaId, setCafeteriaId] = useState(
    urlCafeteriaId ||
    sessionStorage.getItem("cafeteriaId") ||
    localStorage.getItem("cafeteriaId") ||
    "mblock"
  );

  useEffect(() => {
    console.log("📌 Detected cafeteriaId:", cafeteriaId);
    if (!cafeteriaId || cafeteriaId === "undefined") {
      toast.error("Cafeteria ID is missing! Redirecting...");
      navigate("/admin/mblock/login"); // ✅ Redirect to default cafeteria
    }
  }, [cafeteriaId, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔍 Login Request:", { email, password });

    try {
      const response = await axios.post(`${url}/api/admin/login`, { email, password });
      console.log("🛠 API Response:", response.data);

      if (response.data.success) {
        let { token, cafeteriaId: apiCafeteriaId } = response.data;

        // ✅ Normalize `cafeteriaId`
        let currentCafeteriaId = apiCafeteriaId?.toLowerCase().replace(/[^a-z0-9]/g, "") || "mblock";

        if (!currentCafeteriaId) {
          toast.error("Cafeteria ID is missing!");
          console.error("❌ Error: cafeteriaId is undefined");
          return;
        }

        // ✅ Store token and cafeteriaId in sessionStorage
        sessionStorage.setItem(`adminToken_${currentCafeteriaId}`, token);
        sessionStorage.setItem("cafeteriaId", currentCafeteriaId);
        localStorage.setItem("cafeteriaId", currentCafeteriaId);

        // ✅ Update state immediately
        setCafeteriaId(currentCafeteriaId);
        setAdminAuth(true);
        toast.success("Login successful");

        // ✅ Redirect after a short delay to ensure sessionStorage is set
        setTimeout(() => {
          navigate(`/admin/${currentCafeteriaId}/orders/pending`);
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("❌ Login Request Error:", error);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="admin-login-container">
        <div className="admin-login-title">
          <h2>Admin Login</h2>
          <img src="\src\assets\profile_image.png" alt="Close" />
        </div>
        <div className="admin-login-inputs">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
