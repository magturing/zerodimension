import { catchAsyncError } from "../../middlewares/errors/error.middleware.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { Upload } from "../../models/users/upload.model.js";
import { extractZip } from "../../middlewares/fileUpload/multer.js";
import path from "path";
import { addScanJob } from "../../../queues/scanQueue.js";


const uploadFile = catchAsyncError(async (req, res, next) => {

  const file = req.file;

  if (!file) {
    return next(new ErrorHandler("File required", 400));
  }

  const { user } = req;
  const { scanId, uploadPath } = req;

  const zipFilePath = path.join(uploadPath, "uploaded.zip");
  const extractedPath = path.join(uploadPath, "unzipped");

  const { success, error } = await extractZip(zipFilePath, extractedPath);

  const newUpload = await Upload.create({
    userId: user._id,
    uploadId: scanId,
    originalFilename: file.originalname,
    uploadPath: uploadPath,
    extractedPath: extractedPath,
    extractionStatus:"SUCCESS"
  });

  if (!success) {
    return res.status(500).json({
      message: "File uploaded but extraction failed.",
      uploadId: scanId,
      error,
    });
  }

  await addScanJob(scanId, uploadPath + '/uploaded.zip');

  return res.status(201).json({
    message: "File uploaded and extracted successfully",
    uploadId: scanId,
    upload: newUpload,
  });
});


const getAllScanResult = catchAsyncError(async (req, res, next) => {
    const id = req.user._id;

    const results = await Upload.find({ userId: id });

    res.status(200).json({
        success: true,
        results
    });
});

const getScanResultById = catchAsyncError(async (req, res, next) => {
    const id = req.user._id;
    const { uploadId } = req.params;

    const upload = await Upload.findOne({ uploadId, userId: id });

    if (!upload) {
        return next(new ErrorHandler("UNAUTHORIZED or File not found", 401));
    }

    res.status(200).json({
        success: true,
        upload
    });
});

export { 
    uploadFile,
    getAllScanResult,
    getScanResultById
};