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
  // Ensure this import is correct


const app = express();

// CORS configuration
// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local development
      "https://finance-tracker-frontend-s41f.onrender.com" // your deployed frontend URL
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


// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to the database
connectDb();

// Mounting Routes
app.use("/api/v1/auth", Authroutes);
app.use("/api/v1/income", incomeroutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardroutes);
app.use("/api/v1/insights", insightsRoutes);
// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/v1', nlpRoutes);


// Start the server on specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
