import express from "express";
import bodyParser from "body-parser";
import mapRoutes from "./routes/mapRoutes.js";
import cors from "cors";
import os from "os";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: "*" })); // Allow all origins
app.use(bodyParser.json()); // Parses JSON request bodies

// Routes
app.use("/api/map", mapRoutes);

// Get Local Network IP for External Access
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost";
};

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log(`✅ Server running on:
   - Local:   http://localhost:${PORT}
   - Network: http://${localIP}:${PORT} (Use this for mobile testing)`);
});
