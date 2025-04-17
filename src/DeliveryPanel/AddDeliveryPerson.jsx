import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddDeliveryPerson = ({ url }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [block, setBlock] = useState('mblock'); // ✅ Default to M-Block

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/delivery/add`, { name, phone, username, password,block },
        { headers: { "Content-Type": "application/json" }});
        console.log("API Response:", response.data); // ✅ Log the response for debugging
      if (response.data.success) {
        toast.success('Delivery person added!');
        setName('');
        setPhone('');
        setUsername('');
        setPassword('');
        setBlock('mblock'); // Reset to default
      } else {
        toast.error(response.data.message || 'Error adding delivery person');
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data || error); // ✅ Debugging
      toast.error(error.response?.data?.message || 'Error adding delivery person');
    }
  };

  return (
    <div>
      <h2>Add Delivery Person</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Block:</label>
          <select value={block} onChange={e => setBlock(e.target.value)} required>
            <option value="mblock">mblock</option>
            <option value="ubblock">ubblock</option>
          </select>
        </div>
        <button type="submit">Add Delivery Person</button>
      </form>
    </div>
  );
};

export default AddDeliveryPerson;
