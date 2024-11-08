import express from "express";
import isLogin from "../middleware/isLogin.js";
import { getCurrentChats, getUserBySearch } from "../controller/userRouteController.js";

const router = express.Router();

router.get("/search", isLogin, getUserBySearch);

router.get("/currentchats", isLogin, getCurrentChats);

export default router;
