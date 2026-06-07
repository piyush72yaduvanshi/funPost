import express from "express";
import dotenv from "dotenv";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Aerver is ruuning on http://localhost:${PORT}`);
});
