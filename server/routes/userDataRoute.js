import express from "express"
import { userAuth } from "../middleware/middleware.js"
import { getUserData } from "../controllers/userControllers.js"



const userDataRoute=express.Router()



userDataRoute.get("/data",userAuth,getUserData)

export default userDataRoute