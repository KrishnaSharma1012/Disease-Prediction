import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { env } from '../config/env';

let db: Database;

export const initDb = async () => {
  db = await open({
    filename: env.DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      prediction TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      confidence_score REAL NOT NULL,
      features_json TEXT NOT NULL
    )
  `);
};

export const historyService = {
  async getHistory() {
    if (!db) await initDb();
    const rows = await db.all('SELECT id, date, prediction, risk_level, confidence_score FROM history ORDER BY date DESC LIMIT 50');
    return rows;
  },

  async addHistory(entry: { prediction: string, risk_level: string, confidence_score: number, features: any }) {
    if (!db) await initDb();
    const date = new Date().toISOString();
    const featuresJson = JSON.stringify(entry.features);
    
    const result = await db.run(
      'INSERT INTO history (date, prediction, risk_level, confidence_score, features_json) VALUES (?, ?, ?, ?, ?)',
      [date, entry.prediction, entry.risk_level, entry.confidence_score, featuresJson]
    );

    return {
      id: result.lastID,
      date,
      prediction: entry.prediction,
      risk_level: entry.risk_level,
      confidence_score: entry.confidence_score
    };
  }
};
