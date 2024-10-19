import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/dbconnect.js";
import authRouter from "./routes/userAuth.js"

const app = express();

dotenv.config();

app.use(express.json())

app.use('/api/auth', authRouter)

app.get("/", (req, res) => {
  res.send("Server is working!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  dbConnect();
  console.log(`Working at ${PORT}`);
});
