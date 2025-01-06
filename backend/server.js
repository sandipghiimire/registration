require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
