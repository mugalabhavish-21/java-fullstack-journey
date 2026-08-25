require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/api/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM users ORDER BY id DESC"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required.",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "This email already exists.",
      });
    }

    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Backend running at http://localhost:${process.env.PORT || 5000}`);
});