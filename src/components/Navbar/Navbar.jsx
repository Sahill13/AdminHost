import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = ({ cafeteriaId }) => {
  // Optional: format the cafeteria name (capitalize first letter)
  const formattedCafeteria = cafeteriaId.charAt(0).toUpperCase() + cafeteriaId.slice(1);

  return (
    <div className="navbar">
        <img className="logo" src={assets.logo} alt="" />
        <div className="cafeteria-info">
        <span className="cafeteria-name">Cafeteria: {formattedCafeteria}</span>
      </div>
        <img className="profile" src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar;