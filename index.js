// index.js（.env 対応版）

import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// .env を読み込む
dotenv.config();

const app = express();

// フロントエンドのURLも環境変数から取れるようにしておく
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONT_ORIGIN, // デフォルトは Vite のURL
  })
);
app.use(express.json());

// MySQL 接続設定：環境変数を優先して、なければ今までの値を使う
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "taiping",          // ← CREATE USER したユーザー名
  password: process.env.DB_PASSWORD || "tap_pass_123", // ← あなたが決めたパスワード
  database: process.env.DB_NAME || "typing_app",   // ← 作ったDB名
});

// 追加: ルートに簡単なメッセージ
app.get("/", (req, res) => {
  res.send("Typing API server is running. Try GET /api/prompts ✨");
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

// ポート番号も .env から取れるようにしておくと後で便利
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
