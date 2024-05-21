require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const activityRoutes = require("./routes/activity.js");
const purchasedActivityRoutes = require("./routes/purchasedActivities.js");
const mongoDB = process.env.DB;

// Connect to MongoDB
mongoose
  .connect(mongoDB)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// User routes
app.use("/activity", activityRoutes);
app.use("/activity/purchased-activities", purchasedActivityRoutes);



const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});

module.exports = app;
