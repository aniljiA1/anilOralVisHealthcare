import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

const DB_FILE = process.env.SQLITE_FILE || "oralvis.sqlite";

export const dbPromise = open({
  filename: DB_FILE,
  driver: sqlite3.Database,
});

export async function initDb() {
  const db = await dbPromise;

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('Technician', 'Dentist')) NOT NULL
    );
  `);

  // Create scans table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientName TEXT NOT NULL,
      patientId TEXT NOT NULL,
      scanType TEXT CHECK(scanType IN ('RGB', 'XRay')) NOT NULL,
      region TEXT CHECK(region IN ('Frontal', 'Side', 'Upper Arch', 'Lower Arch')) NOT NULL,
      imageUrl TEXT NOT NULL,
      uploadDate TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `);
}
