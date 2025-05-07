import express from "express";
import {
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
    sendResetOtp,
    sendVerifyOtp,
    verifyEmail,
} from "../controllers/authControllers.js";
import { userAuth } from "../middleware/middleware.js";

const routeAuth = express.Router();

// Debugging logs for route registration
routeAuth.post("/register", register);

routeAuth.post("/login", login);

routeAuth.post("/logout", logout);

routeAuth.post("/send-verify-otp", userAuth, sendVerifyOtp);

routeAuth.post("/verify-account", userAuth, verifyEmail);

routeAuth.get("/is-auth", userAuth, isAuthenticated);

routeAuth.post("/send-reset-otp", sendResetOtp);

routeAuth.post("/reset-password", resetPassword);

export default routeAuth;