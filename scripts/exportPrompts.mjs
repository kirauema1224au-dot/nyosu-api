import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// .env から DB 設定を読む（index.js と同じ）
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "taiping",
  password: process.env.DB_PASSWORD || "tap_pass_123",
  database: process.env.DB_NAME || "typing_app",
});

// SQL用にシングルクォートをエスケープする関数
function esc(str) {
  return String(str).replace(/'/g, "''");
}

async function main() {
  try {
    // 今の prompts テーブルの中身を全部取ってくる
    const [rows] = await pool.query(
      "SELECT text, romaji, difficulty FROM prompts ORDER BY id ASC"
    );

    console.log(`Exporting ${rows.length} prompts...`);

    // 1) 既存のデータを消す TRUNCATE
    let sql = "TRUNCATE TABLE prompts;\n\n";

    // 2) INSERT 文を組み立てる
    if (rows.length > 0) {
      sql += "INSERT INTO prompts (text, romaji, difficulty) VALUES\n";
      sql += rows
        .map((r) => {
          return `  ('${esc(r.text)}', '${esc(r.romaji)}', ${r.difficulty})`;
        })
        .join(",\n");
      sql += ";\n";
    }

    // 3) db/seed_prompts.sql に書き出す
    const outPath = path.join(process.cwd(), "db", "seed_prompts.sql");
    await fs.writeFile(outPath, sql, "utf8");

    console.log(`Done! Wrote to ${outPath}`);
  } catch (err) {
    console.error("Export failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
