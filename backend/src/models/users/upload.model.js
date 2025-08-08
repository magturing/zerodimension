import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const uploadSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author of the file is required"],
    index: true
  },
  uploadId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  originalFilename: {
    type: String,
    required: [true, "File name is required"]
  },
  fileSize: {
    type: Number // in bytes
  },
  fileType: {
    type: String // e.g., "application/zip"
  },
  uploadPath: {
    type: String,
    select: false
  },
  extractedPath: {
    type: String,
    select: false
  },
  extractionStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },
  scanStatus: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING",
    index: true
  },
  linkedScanId: {
    type: String
  },
  scanSummary: {
    type: String,
    default: ""
  },
  errorLog: {
    type: String,
    select: false
  },
  deleted: {
    type: Boolean,
    default: false,
    select:false
  },
  sourceIP: {
    type: String
  },
  userAgent: {
    type: String
  },
  // Optional: future feature support
//   projectId: {
//     type: Schema.Types.ObjectId,
//     ref: "Project"
//   }
}, { timestamps: true });

export const Upload = mongoose.model("Upload", uploadSchema);
