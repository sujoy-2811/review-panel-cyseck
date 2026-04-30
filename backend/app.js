import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.js";
import employeeRoutes from "./src/routes/employees.js";
import reviewRoutes from "./src/routes/reviews.js";
import assignmentRoutes from "./src/routes/assignments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev", { skip: (req) => req.path === '/api/health' }))

app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/reviews", reviewRoutes);
app.use("/assignments", assignmentRoutes);

// Container/platform health probe endpoint.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

export default app;
