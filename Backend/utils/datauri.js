import path from "path";

/**
 * Robust DataURI generator from Multer memory buffer
 * Does not depend on vulnerable image-size sub-dependencies
 */
const getDataUri = (file) => {
  if (!file || !file.buffer) return null;
  const extName = path.extname(file.originalname).toString().toLowerCase();
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
    content: `data:${mimeType};base64,${base64Content}`,
    mimetype: mimeType,
  };
};

export default getDataUri;