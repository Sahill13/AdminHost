import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddAdmin.css';  // ✅ Import the new CSS file

const AddAdmin = ({ url }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cafeteriaId, setCafeteriaId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cafeteriaId) {
      toast.error('Please select a cafeteria');
      return;
    }
    
    try {
      const response = await axios.post(`${url}/api/admin/add`, 
        { name, email, password, cafeteriaId },
        { headers: { "Content-Type": "application/json" }}
      );

      if (response.data.success) {
        toast.success('Admin added successfully!');
        setName('');
        setEmail('');
        setPassword('');
        setCafeteriaId('');
      } else {
        toast.error(response.data.message || 'Error adding admin');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Error adding admin');
    }
  };

  return (
    <div className="add-admin">
      <div className="add-admin-container">
        <h2 className="add-admin-title">Add Admin</h2>
        <form onSubmit={handleSubmit} className="add-admin-inputs">
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label>Select Cafeteria:</label>
            <select value={cafeteriaId} onChange={e => setCafeteriaId(e.target.value)} required>
              <option value="">-- Select Cafeteria --</option>
              <option value="mblock">mblock</option>
              <option value="ubblock">ubblock</option>
            </select>
          </div>
          <button type="submit">Add Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
