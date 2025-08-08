import { catchAsyncError } from "../../middlewares/errors/error.middleware.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { Upload } from "../../models/users/upload.model.js";
import { extractZip } from "../../middlewares/fileUpload/multer.js";
import path from "path";


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

  return res.status(201).json({
    message: "File uploaded and extracted successfully",
    uploadId: scanId,
    upload: newUpload,
  });
});


export { 
    uploadFile
};