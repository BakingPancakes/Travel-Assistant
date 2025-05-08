import express from "express";
import TripRoutes from "../routes/TripRoutes.js";

const app = express();
const PORT = 3000;

// Configure middleware
app.use(express.json({ limit: "10mb" }));

// CORS headers for cross-origin requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Simple home route
app.get("/", (req, res) => {
    res.json({ message: "Server is working! Use API endpoints to interact with data." });
});

// Test API endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "API test endpoint is working!" });
});

// Mount trip routes
app.use("/api", TripRoutes);

// Start the server
console.log("Starting server...");
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});