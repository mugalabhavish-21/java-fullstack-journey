require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET users
app.get("/api/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM users ORDER BY id DESC"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// POST user
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

    res.status(500).json({
      message: error.message,
    });
  }
});

// AI route - OpenRouter
app.post("/api/ask-ai", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      message: "Question is required.",
    });
  }
  console.log(
  "OpenRouter key loaded:",
  Boolean(process.env.OPENROUTER_API_KEY)
);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: question,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);

      return res.status(response.status).json({
        message: "OpenRouter API request failed.",
        error: data,
      });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({
        message: "No AI response was returned.",
      });
    }

    res.json({
      answer,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Backend running at http://localhost:${process.env.PORT || 5000}`
  );
});