import express from 'express';
import { adminLogin, registration, login , logout, googleLogin } from '../controller/authController.js';

const authRoutes = express.Router();

authRoutes.post('/registration', registration)
authRoutes.post('/login', login)
authRoutes.post('/google-login', googleLogin)
authRoutes.get('/logout', logout)
authRoutes.post("/adminlogin",adminLogin)

export default authRoutes;