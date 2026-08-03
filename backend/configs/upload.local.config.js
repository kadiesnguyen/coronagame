"use strict";

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const brandingDir = path.join(__dirname, "../public/uploads/branding");
const notificationDir = path.join(__dirname, "../public/uploads/notifications");
const mediaDir = path.join(__dirname, "../public/uploads/media");

for (const dir of [brandingDir, notificationDir, mediaDir]) {
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
const uploadMedia = makeUploader(mediaDir, "media");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

/** List image files under public/uploads/{folder}. */
const listUploadFolder = (folder) => {
  const dir = path.join(__dirname, "../public/uploads", folder);
  if (!fs.existsSync(dir)) return [];
  try {
    return fs
      .readdirSync(dir)
      .filter((name) => IMAGE_EXTS.has(path.extname(name).toLowerCase()))
      .map((name) => {
        const full = path.join(dir, name);
        let mtimeMs = 0;
        try {
          mtimeMs = fs.statSync(full).mtimeMs;
        } catch {
          mtimeMs = 0;
        }
        return {
          url: `/uploads/${folder}/${name}`,
          name,
          folder,
          mtimeMs,
        };
      });
  } catch {
    return [];
  }
};

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
  uploadMedia,
  uploadDir: brandingDir,
  notificationDir,
  mediaDir,
  listUploadFolder,
  deleteLocalUpload,
};
