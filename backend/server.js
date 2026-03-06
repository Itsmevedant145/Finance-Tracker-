require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db");

// Import routes
const Authroutes = require("./routes/Authroutes");
const incomeroutes = require("./routes/Incomeroutes");
const nlpRoutes = require('./routes/nlp');
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardroutes = require("./routes/dashboardroutes");
const insightsRoutes = require('./routes/insightsRoutes');

// Import rate limiter from config
const rateLimiter = require("./config/rateLimiter"); // adjust path if needed

const app = express();

// ----------------------------
// CORS configuration
// ----------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://finance-tracker-frontend-s41f.onrender.com" // deployed frontend
    ],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "accepted",
      "X-Requested-With"
    ]
  })
);

// ----------------------------
// Middleware to parse JSON
// ----------------------------
app.use(express.json());

// ----------------------------
// Connect to the database
// ----------------------------
connectDb();

// ----------------------------
// Global Rate Limiting (optional)
// ----------------------------
// Example: 200 requests per minute per user for all routes
app.use(rateLimiter(200, 60));

// ----------------------------
// Mounting Routes
// ----------------------------
app.use("/api/v1/auth", Authroutes);
app.use("/api/v1/income", incomeroutes);
app.use("/api/v1/expense", expenseRoutes);

// ----------------------------
// Apply stricter rate limits for heavy endpoints
// ----------------------------

// Dashboard: 30 requests per minute
app.use("/api/v1/dashboard", rateLimiter(30, 60), dashboardroutes);

// Insights: 10 requests per minute (AI-heavy)
app.use("/api/v1/insights", rateLimiter(10, 60), insightsRoutes);

// NLP endpoints (if using AI models): 5 requests per minute
// app.use("/api/v1/nlp", rateLimiter(5, 60), nlpRoutes);

// ----------------------------
// Static file serving for uploads
// ----------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------------
// Start server
// ----------------------------
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});