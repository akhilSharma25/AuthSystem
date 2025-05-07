import React, { useContext } from 'react';
import { assets } from '../assets/assets';  // Make sure this path is correct
import { AppContent } from '../context/AppContext';

const Header = () => {

  const {userData}=useContext(AppContent)
  return (
    <div className="header"> {/* Apply header class */}
      <img src={assets.header_img} alt="Header" />
      <h1>
        Hey {userData? userData.name:'Developer'} 
        <img src={assets.hand_wave} alt="Wave" 
 />
      </h1>
      <h2 style={{textAlign:"center"}}>Welcome to our app</h2>
      <p><b>Get started with our app by verifying your email. Forgot your password? We'll help you reset it through email. Let's get you up and running quickly!</b></p>
      <button>Get Started</button>
    </div>
  );
}

export default Header;
