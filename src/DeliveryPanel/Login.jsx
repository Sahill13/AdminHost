import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ url, setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/delivery/login`, { username, password });

      if (response.data.success) {
        const { token, refreshToken, block } = response.data; // ✅ Destructure block
        const blockKey = `deliveryToken_${block}`; // ✅ Block-specific token storage

        // ✅ Store Block-Specific Tokens
        localStorage.setItem(blockKey, token);
        localStorage.setItem(`refreshToken_${block}`, refreshToken);
        localStorage.setItem("deliveryBlock", block); // ✅ Save block for persistence

        setAuth({ token, block }); // ✅ Store in React state
        toast.success(`Welcome! Assigned to ${block}`);
        
        navigate('/delivery-dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="delivery-login">
      <form onSubmit={handleLogin} className="delivery-login-container">
        <div className="delivery-login-title">
          <h2>Delivery Personnel Login</h2>
          <img src="\src\assets\profile_image.png" alt="Close" />
        </div>
        <div className="delivery-login-inputs">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

export default Login;
