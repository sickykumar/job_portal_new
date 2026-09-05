import path from "path";

/**
 * Robust DataURI generator from Multer memory buffer
 * Handles undefined originalname safely and returns content, mimetype, fileName, and base64.
 */
const getDataUri = (file) => {
  if (!file || !file.buffer) return null;
  const originalname = file.originalname || "upload";
  const extName = path.extname(originalname).toString().toLowerCase();
  const mimeMap = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".svg": "image/svg+xml",
  };
  const mimeType = file.mimetype || mimeMap[extName] || "application/octet-stream";
  const base64Content = file.buffer.toString("base64");
  return {
    fileName: originalname,
    content: `data:${mimeType};base64,${base64Content}`,
    mimetype: mimeType,
    base64: base64Content,
  };
};

export default getDataUri;