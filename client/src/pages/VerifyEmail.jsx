import React, { useContext, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();

  const { backendUrl, getUserData,isLoggedIn,userData } = useContext(AppContent);
  const inputRef = useRef([]);

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');

    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((input) => input.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp },{
withCredentials:true
      });

      if (data.success) {
        toast.success(data.message);
        inputRef.current.forEach(input => input.value = '');
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(()=>{
    isLoggedIn && userData && userData.isVerify && navigate("/")
  },[isLoggedIn,userData])

  return (
    <div className="verify-email-container">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="verify-email-logo"
      />

      <form className="verify-email-form" onSubmit={onSubmitHandler}>
        <h1 className="verify-email-title">Verify Your Email</h1>
        <p className="verify-email-description">
          Enter the 6-digit code sent to your email address.
        </p>

        <div className="verify-email-input-group" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              key={index}
              className="verify-email-input"
              required
              ref={el => inputRef.current[index] = el}
              onInput={e => handleInput(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button type="submit" className="verify-email-button">Verify Email</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
