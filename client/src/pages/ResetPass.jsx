import React, { useState, useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const ResetPass = () => {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmit, setIsOtpSubmit] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email
      }, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((input) => input.value);
      const joinedOtp = otpArray.join('');

      if (joinedOtp.length !== 6) {
        toast.error("Please enter a 6-digit OTP.");
        return;
      }

      setOtp(joinedOtp);
      setIsOtpSubmit(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      }, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="reset-password-container">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="logo"
      />

      {!isEmailSent &&
        <form className="email-form" onSubmit={onSubmitEmail}>
          <h1>Reset Password</h1>
          <p>Enter your registered email address</p>
          <div className="input-group">
            <img src={assets.mail_icon} alt="email icon" className="input-icon" />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email ID"
              className="email-input"
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      }

      {isEmailSent && !isOtpSubmit &&
        <form className="otp-form" onSubmit={onSubmitOtp}>
          <h1>Reset Password OTP</h1>
          <p>Enter the 6-digit code sent to your email address</p>
          <div className="otp-input-group" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="otp-input"
                required
                ref={el => inputRef.current[index] = el}
                onInput={e => handleInput(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button type="submit" className="submit-btn">Submit OTP</button>
        </form>
      }

      {isEmailSent && isOtpSubmit &&
        <form className="password-form" onSubmit={onSubmitNewPassword}>
          <h1>New Password</h1>
          <p>Enter new password below</p>
          <div className="input-group">
            <img src={assets.lock_icon} alt="lock icon" className="input-icon" />
            <input
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              type="password"
              placeholder="Enter a new password"
              className="password-input"
            />
          </div>
          <button type="submit" className="submit-btn">Reset Password</button>
        </form>
      }
    </div>
  );
};

export default ResetPass;
