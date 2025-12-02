// index.js（DBなし・seed配列だけで動く版）

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// .env を読み込む（FRONT_ORIGIN と PORT だけ使う）
dotenv.config();

const app = express();

// フロントエンドのURL（.env に FRONT_ORIGIN があればそれを優先）
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";

// CORS と JSON ボディの処理
app.use(
  cors({
    origin: FRONT_ORIGIN,
  })
);
app.use(express.json());

// ★ データベースの代わりに使う seed データ（メモリ上の配列）
let prompts = [
  {
    id: 1,
    text: "猫が好きです",
    romaji: "nekogasukidesu",
    difficulty: 320,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    text: "明日は雨が降ります",
    romaji: "asitahaamegafurimasu",
    difficulty: 550,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    text: "速い車を運転する",
    romaji: "hayaikurumawounntensuru",
    difficulty: 400,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    text: "日本語を勉強しています",
    romaji: "nihonngowobennkyousiteimasu",
    difficulty: 600,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    text: "プログラミングは楽しい",
    romaji: "puroguraminnguhatanosii",
    difficulty: 750,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    text: "映画を観に行きます",
    romaji: "eigawominiikimasu",
    difficulty: 420,
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    text: "今日は友達と遊びます",
    romaji: "kyouhatomodatitoasobimasu",
    difficulty: 480,
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    text: "美味しいケーキを作る",
    romaji: "oisiike-kiwotukuru",
    difficulty: 390,
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    text: "朝ご飯を食べました",
    romaji: "asagohannwotabemasita",
    difficulty: 330,
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    text: "本を読むのが好きです",
    romaji: "honnwoyomunogasukidesu",
    difficulty: 345,
    created_at: new Date().toISOString(),
  },
  {
    id: 11,
    text: "夏休みに旅行したい",
    romaji: "natuyasuminiryokousitai",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 12,
    text: "キノコよりタケノコ派です",
    romaji: "kinokoyoritakenokohadesu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 13,
    text: "今日の晩御飯はハンバーグです",
    romaji: "kyounobanngohannhahanba-gudesu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 14,
    text: "好きなスポーツは野球です",
    romaji: "sukinasupo-tuhayakyudesu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 14,
    text: "昨日は家族でドライブしました",
    romaji: "kinouhakazokudedoraibusimasita",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 15,
    text: "私は虫が苦手です",
    romaji: "watasihamusiganigatedesu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 16,
    text: "友達と旅行に行きます",
    romaji: "tomodatitoryokouniikimasu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 17,
    text: "最近は肌寒いですね",
    romaji: "saikinnhahadazamuidesune",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
  {
    id: 18,
    text: "好きな科目は歴史です",
    romaji: "sukinakamokuharekisidesu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
 {
    id: 19,
    text: "私は料理がすきです",
    romaji: "watasiharyourigasukidesu",
    difficulty: 465,
    created_at: new Date().toISOString(),

  },
  {
    id: 20,
    text: "午後から予定があります",
    romaji: "gogokarayoteigaarimasu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
 {
    id: 21,
    text: "新しい鉛筆を買いたい",
    romaji: "atarasiiennpituwokaitai",
    difficulty: 465,
    created_at: new Date().toISOString(),

  },
  {
    id: 22,
    text: "今年の干支はへびです",
    romaji: "kotosinoetohahebidesu",
    difficulty: 465,
    created_at: new Date().toISOString(),
  },
    {
    id: 23,
    text: "私はてんびん座です",
    romaji: "watasihatennbinnzadesu",
    difficulty: 465,
    created_at: new Date().toISOString(),

  },






















];

// ルート：動作確認用
app.get("/", (req, res) => {
  res.send("Typing API server is running without DB. Try GET /api/prompts ✨");
});

// GET /api/prompts : お題一覧取得（新しいidが先に来るように並び替え）
app.get("/api/prompts", (req, res) => {
  const sorted = [...prompts].sort((a, b) => b.id - a.id);
  res.json(sorted);
});

// POST /api/prompts : お題追加（配列に追加するだけ）
app.post("/api/prompts", (req, res) => {
  try {
    const { text, romaji, difficulty } = req.body;

    if (!text || !romaji || difficulty == null) {
      return res.status(400).json({
        error: "text, romaji, difficulty are required",
      });
    }

    // いちばん大きい id + 1 を新しい id にする
    const newId = prompts.length > 0 ? Math.max(...prompts.map((p) => p.id)) + 1 : 1;

    const newPrompt = {
      id: newId,
      text,
      romaji,
      difficulty,
      created_at: new Date().toISOString(),
    };

    // メモリ上の配列に追加
    prompts.push(newPrompt);

    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("POST /api/prompts error", error);
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// ポート番号（.env に PORT があればそれを優先）
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
