import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDb from "./utils/db.js";
import routeAuth from "./routes/userRoute.js"
import userDataRoute from "./routes/userDataRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

connectDb();

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded bodies

app.use(cookieParser());

// API Endpoints

console.log("Registering route: /api/auth");

app.use('/api/auth', routeAuth);
console.log("Registering route: /api/user");

app.use("/api/user", userDataRoute);



app.listen(PORT, () => {
    console.log(`Server is listening at : ${PORT}`);
});
