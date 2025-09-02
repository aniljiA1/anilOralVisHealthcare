import bcrypt from "bcryptjs";
import { dbPromise, initDb } from "./db.js";

async function run() {
  await initDb();
  const db = await dbPromise;

  const users = [
    { email: "tech@oralvis.com", pass: "tech123", role: "Technician" },
    { email: "dentist@oralvis.com", pass: "dentist123", role: "Dentist" }
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.pass, 10);
    try {
      await db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [u.email, hash, u.role]);
      console.log(`Seeded ${u.email} (${u.role})`);
    } catch {
      console.log(`${u.email} already exists, skipping`);
    }
  }
  process.exit(0);
}

run();
