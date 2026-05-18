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

app.get("/api/clients", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, status, created_at FROM clients ORDER BY id DESC"
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO clients (name, email, phone, status) VALUES (?, ?, ?, ?)",
      [name, email || null, phone || null, status || "active"]
    );

    res.status(201).json({
      success: true,
      message: "Client created",
      data: {
        id: result.insertId,
        name,
        email,
        phone,
        status: status || "active",
      },
    });
  } catch (error) {
    console.error("Create client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
});