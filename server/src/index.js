const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoute = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoute.js");

dotenv.config();

// DB Connection
connectDB(); 

const app = express();

// CORS - allow frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://user-registry-fullstack.vercel.app",
  process.env.FRONTEND_URL
];

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "success",
    message: "UserRegistry Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Routes
app.use("/api/auth",            authRoutes);
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/api/users",           userRoutes);


const PORT = process.env.PORT || 8080;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for Vercel
module.exports = app;