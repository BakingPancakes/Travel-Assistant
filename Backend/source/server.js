import express from "express";
import TripRoutes from "../routes/TripRoutes.js";

class Server {
    constructor() {
        this.app = express();
        this.configureMiddleWare();
        this.setupRoutes();
    }

    // Configure middleware for static files and JSON parsing
    configureMiddleWare() {
        // Serve static files from the front end
        this.app.use(express.static("../Frontend/src"));

        // Parse JSON bodies, limited to 10mb
        this.app.use(express.json({ limit: "10mb" }));
    }

    // Setup routes
    setupRoutes() {
        this.app.use("/v1", TripRoutes); // Mount TripRoutes on the app
    }
    // Start the server on a specified port
    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
}

// Initialize and start the server
console.log("Starting server...");
const server = new Server();
server.start();