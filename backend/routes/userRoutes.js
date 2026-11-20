import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getAdmin, getCurrentUser, getDeliveryInfo, saveDeliveryInfo, getProfileStats } from "../controller/userController.js"
import adminAuth from "../middleware/adminAuth.js"


let userRoutes = express.Router()

userRoutes.post("/getCurrentUser", isAuth, getCurrentUser)
userRoutes.get("/getadmin",adminAuth,getAdmin)

// Profile page
userRoutes.get("/delivery", isAuth, getDeliveryInfo)
userRoutes.put("/delivery", isAuth, saveDeliveryInfo)
userRoutes.get("/stats", isAuth, getProfileStats)


export default userRoutes;