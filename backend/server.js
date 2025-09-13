// // // import express from "express";
// // // import mongoose from "mongoose";
// // // import cors from "cors";
// // // import dotenv from "dotenv";
// // // import eventRoutes from "./routes/eventRoutes.js";

// // // dotenv.config();

// // // const app = express();
// // // const PORT = process.env.PORT || 5000;

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json());

// // // // Routes
// // // app.use("/api/events", eventRoutes);

// // // // Connect DB & Start Server
// // // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// // //   .then(() => {
// // //     console.log("✅ MongoDB Connected");
// // //     app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// // //   })
// // //   .catch(err => console.error("❌ MongoDB Error:", err));
// // import express from "express";
// // import mongoose from "mongoose";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import eventRoutes from "./routes/eventRoutes.js";

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Middleware
// // app.use(cors());
// // app.use(express.json()); // ✅ needed to read req.body

// // // Mount routes
// // app.use("/api/events", eventRoutes);

// // mongoose.connect(process.env.MONGO_URI)
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch(err => console.error(err));

// // app.listen(process.env.PORT || 5000, () =>
// //   console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
// // // )
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import eventRoutes from "./routes/eventRoutes.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // Needed to parse JSON requests

// // Routes
// app.use("/api/events", eventRoutes);

// // Connect to MongoDB and start server
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example API
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working fine 🚀" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));