"use strict";

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const brandingDir = path.join(__dirname, "../public/uploads/branding");
const notificationDir = path.join(__dirname, "../public/uploads/notifications");

for (const dir of [brandingDir, notificationDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const imageFilter = (_req, file, cb) => {
  if (!file.mimetype?.startsWith("image/")) {
    return cb(new Error("Chỉ được upload ảnh"));
  }
  return cb(null, true);
};

const makeUploader = (dir, prefix) =>
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, dir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
        const safeExt = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext) ? ext : ".png";
        cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
      },
    }),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: imageFilter,
  });

const uploadBranding = makeUploader(brandingDir, "branding");
const uploadNotification = makeUploader(notificationDir, "notification");

/** Chỉ xóa file nằm trong public/uploads/{folder}/ — tránh path traversal. */
const deleteLocalUpload = (url, folder) => {
  if (!url || typeof url !== "string") return false;
  const prefix = `/uploads/${folder}/`;
  if (!url.startsWith(prefix)) return false;
  const filename = path.basename(url);
  if (!filename || filename !== url.slice(prefix.length)) return false;
  const fullPath = path.join(__dirname, "../public/uploads", folder, filename);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch (_err) {
    // ponytail: best-effort delete; ignore race/ENOENT
  }
  return false;
};

module.exports = {
  uploadBranding,
  uploadNotification,
  uploadDir: brandingDir,
  notificationDir,
  deleteLocalUpload,
};
