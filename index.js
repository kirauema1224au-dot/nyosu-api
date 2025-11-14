import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // フロント(Vite)のURL
  })
);
app.use(express.json());

// MySQL 接続設定（さっき作ったユーザー）
const pool = mysql.createPool({
  host: "localhost",
  user: "taiping",          // ← CREATE USER したユーザー名
  password: "tap_pass_123", // ← あなたが決めたパスワード
  database: "typing_app",   // ← 作ったDB名
});

// GET /api/prompts : お題一覧取得
app.get("/api/prompts", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, text, romaji, difficulty, created_at FROM prompts ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET /api/prompts error", error);
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

// POST /api/prompts : お題追加
app.post("/api/prompts", async (req, res) => {
  try {
    const { text, romaji, difficulty } = req.body;

    if (!text || !romaji || difficulty == null) {
      return res.status(400).json({
        error: "text, romaji, difficulty are required",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO prompts (text, romaji, difficulty) VALUES (?, ?, ?)",
      [text, romaji, difficulty]
    );

    const [rows] = await pool.query(
      "SELECT id, text, romaji, difficulty, created_at FROM prompts WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("POST /api/prompts error", error);
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
