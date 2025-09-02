import express from "express";
import multer from "multer";
import dayjs from "dayjs";
import fs from "fs";
import { dbPromise } from "./db.js";
import cloudinary from "./cloudinary.js";
import { authRequired, requireRole } from "./middleware/auth.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Technician: upload a scan
router.post(
  "/scans",
  authRequired,
  requireRole("Technician"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { patientName, patientId, scanType, region } = req.body;

      if (!req.file)
        return res.status(400).json({ error: "Image file required" });

      // Upload image to Cloudinary
      const cloudRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "oralvis/scans",
        resource_type: "image",
      });

      const imageUrl = cloudRes.secure_url;
      const uploadDate = dayjs().toISOString();

      // Save scan info in SQLite
      const db = await dbPromise;
      const { lastID } = await db.run(
        `INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [patientName, patientId, scanType, region, imageUrl, uploadDate]
      );

      // Delete local file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });

      res.json({ id: lastID, patientName, patientId, scanType, region, imageUrl, uploadDate });
    } catch (e) {
      console.error("Upload error:", e);
      res.status(500).json({ error: "Upload failed", details: e.message });
    }
  }
);

// Dentist: fetch all scans
router.get(
  "/scans",
  authRequired,
  requireRole("Dentist"),
  async (_req, res) => {
    try {
      const db = await dbPromise;
      const rows = await db.all("SELECT * FROM scans ORDER BY datetime(uploadDate) DESC");
      res.json(rows);
    } catch (e) {
      console.error("Fetch scans error:", e);
      res.status(500).json({ error: "Failed to fetch scans", details: e.message });
    }
  }
);

export default router;

