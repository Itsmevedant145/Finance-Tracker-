require("dotenv").config(); // ✅ Loads environment variables
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDb = require("./config/db"); // ✅ Corrected 'connectDb' import
const Authroutes = require("./routes/Authroutes"); // ✅ FIXED: Added the missing quote
const incomeroutes = require("./routes/Incomeroutes");
const expenseRoutes = require("./routes/expenseRoutes")
const dashboardroutes = require("./routes/dashboardroutes"); // ✅ Added dashboard routes
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "accepted", "X-Requested-With"]
  })
);

app.use(express.json()); // ✅ Parses incoming JSON

connectDb(); // ✅ Connect to the database

// ✅ Mount the auth routes
app.use("/api/v1/auth", Authroutes);
app.use("/api/v1/income", incomeroutes); // ✅ Fixed the typo here
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardroutes); // ✅ Added dashboard routes


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
