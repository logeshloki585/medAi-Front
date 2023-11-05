import React, { useState } from 'react';
import './Register.css'; // Create a CSS file for styling
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const walletAddress =  localStorage.getItem('walletAddress');
    const response = await axios.post('http://localhost:4000/register',{"id":walletAddress,"content":formData});
     console.log(response)
  };

  return (
    <div className="dark-theme">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="text"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;
