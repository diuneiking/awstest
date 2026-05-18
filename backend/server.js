const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "awstest_user",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "awstest_db",
  port: process.env.DB_PORT || 3306,
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Node API is running from GitHub deploy",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS server_time");

    res.json({
      success: true,
      message: "MySQL connection is working",
      data: rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});