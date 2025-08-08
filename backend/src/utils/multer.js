import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const userId = req.user?.id;
      if (!userId) return cb(new Error("User ID missing in request"), "");

      const scanId = uuidv4();
     
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const dir = path.join(__dirname, "..", "uploads", userId, scanId);

      fs.mkdirSync(dir, { recursive: true });

      req.uploadPath = dir;
      req.scanId = scanId;

      cb(null, dir);
    } catch (err) {
      cb(err, "");
    }
  },

  filename: function (req, file, cb) {
    cb(null, "uploaded.zip");
  }
});


const fileFilter = function (req, file, cb) {
  if (file.mimetype === "application/zip" || file.originalname.endsWith(".zip")) {
    cb(null, true);
  } else {
    cb(new Error("Only ZIP files are allowed"), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, 
  },
});

export { upload };
