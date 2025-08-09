import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const vulnerabilitySchema = new Schema({
  name: { 
    type: String, 
    required: true 
  }, 
  description: { 
    type: String, 
    required: true 
  }, 
  file: { 
    type: String, 
    required: true 
  }, 
  line: { 
    type: Number, 
    required: true 
  }, 
  severity: { 
    type: String, 
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], 
    required: true 
  },
  codeSnippet: { 
    type: String, 
    required: true 
  }, 
  remediation: { 
    type: String, 
    required: true 
   } 
}, { _id: false });



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
    type: Number
  },
  fileType: {
    type: String
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
  scanResults: {
    vulnerabilities: [vulnerabilitySchema] 
  },
  scanCompletedAt: {
    type: Date
  },
  errorLog: {
    type: String,
    select: false
  },
  deleted: {
    type: Boolean,
    default: false,
    select: false
  },
  sourceIP: {
    type: String
  },
  userAgent: {
    type: String
  }
}, { timestamps: true });

export const Upload = mongoose.model("Upload", uploadSchema);
