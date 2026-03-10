import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import taskRoutes from "./routes/task.route.js"
import reportRoutes from "./routes/report.route.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express() // ✅ define app FIRST

// Middleware
app.use(express.json())
app.use(cookieParser())

// CORS for cross-origin cookie requests
app.use(
  cors({
    origin: process.env.FRONT_END_URL || "https://client-v22j.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ allow cookies
  })
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/reports", reportRoutes)

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})