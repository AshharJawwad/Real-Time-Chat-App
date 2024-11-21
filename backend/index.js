import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/dbconnect.js";
import authRouter from "./routes/userAuth.js";
import messageRouter from "./routes/messageRoute.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import path from "path";

import { app, server } from "./socket/socket.js";

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  dbConnect();
  console.log(`Working at ${PORT}`);
});
