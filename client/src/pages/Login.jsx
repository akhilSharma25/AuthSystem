import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, setIsLoggedIn,getUserData } = useContext(AppContent);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const endpoint = state === "Sign up" ? "/api/auth/register" : "/api/auth/login";

      const data = state === "Sign up" 
        ? { email, password, name } 
        : { email, password };

      const res = await axios.post(
        backendUrl + endpoint,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setIsLoggedIn(true);
        getUserData()
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

  return (
    <div className="login-page">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="logo"
      />
      <div className="login-box">
        <h2>{state === "Sign up" ? "Create Account" : "Login"}</h2>
        <p>{state === "Sign up" ? "Create your account" : "Login to your account"}</p>

        <form onSubmit={handleSubmit}>
          {state === "Sign up" && (
            <div className="input-group">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="input-group">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email ID"
              required
            />
          </div>
          <div className="input-group">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
            />
          </div>

          <p onClick={() => navigate("/reset-password")} className="forgot">
            Forgot Password?
          </p>
          <button type="submit">{state}</button>
        </form>

        <p className="switch">
          {state === "Sign up" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("Login")}>Login here</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setState("Sign up")}>Sign up</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
