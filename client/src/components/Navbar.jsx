import React, { useContext } from 'react';
import {assets} from "../assets/assets";
import {useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate=useNavigate()
  const {userData,backendUrl,setUserData,setIsLoggedIn}=useContext(AppContent)
  const logout = async () => {
    try {



      const res = await axios.post(
        backendUrl + '/api/auth/logout',{},
        {
          withCredentials: true,
          
        }
      );

      if (res.data.success) {
        setIsLoggedIn(false);
        setUserData("")
        navigate("/");

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error("Something went wrong!");
    }
  };
  const sendVerificationOtp = async () => {
    try {



      const res = await axios.post(
        backendUrl + '/api/auth/send-verify-otp',{},
        {
          withCredentials: true,
          
        }
      );

      if (res.data.success) {
        navigate("/email-verify");

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error("Something went wrong!");
    }
  };


  return (
    <div className="navbar">  {/* Applying the navbar class for styling */}
        <img src={assets.logo} alt="Logo" />
        {
          userData?
          <div className="profile-container">
          <div className="profile-icon">
            {userData.name[0].toUpperCase()}
          </div>
          <div className="dropdown-menu">
            <ul>
              {!userData.isVerify &&
                            <li onClick={sendVerificationOtp}>Verify Email</li>
}
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        
          </div>:
          <button onClick={()=>navigate('/login')}>
            Login
            <img src={assets.arrow_icon} alt="Arrow" />
        </button>
        }
        
    </div>
  );
}

export default Navbar;
