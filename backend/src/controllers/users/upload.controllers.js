import { catchAsyncError } from "../../middlewares/errors/error.middleware.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { Upload } from "../../models/users/upload.model.js";


const uploadFile = catchAsyncError(async(req,res,next) => {
    const file = req.file;

    if(!file){
        return next(new ErrorHandler("File required",400));
    }

    const {user} = req;
    const { scanId, uploadPath } = req;

    const newUpload = await Upload.create({
      userId: user._id,
      uploadId: scanId,
      originalFilename: file.originalname,
      uploadPath: uploadPath,
      extractedPath: "", 
      scanStatus: "PENDING",
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      uploadId: scanId,
      upload: newUpload,
    });

});



export {
    uploadFile
};