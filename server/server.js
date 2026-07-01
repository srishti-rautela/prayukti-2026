require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// index.html / welcome.html / assets are one level up from server.js
const FRONTEND_DIR = path.join(__dirname, "..");
app.use(express.static(FRONTEND_DIR));

// Moved off "/" so it no longer conflicts with serving index.html at the root.
app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS serverTime");
        res.json({
            success: true,
            message: "Prayukti Backend Running",
            database: "Connected",
            serverTime: rows[0].serverTime
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            database: "Not Connected",
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 5000;
const adminRoute = require("./routes/admin");
app.use("/api/admin", adminRoute);
const adminDashboardRoute = require("./routes/adminDashboard");
app.use("/api/admin", adminDashboardRoute);
const registrationRoute = require("./routes/registration");
app.use("/api/register", registrationRoute);
const dashboardRoute = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoute);
const registrationManagementRoute = require("./routes/registrationManagement");
app.use("/api/admin", registrationManagementRoute);
const loginRoute = require("./routes/login");
app.use("/api/login", loginRoute);
const qrRoute = require("./routes/qr");
app.use("/api/qr", qrRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});