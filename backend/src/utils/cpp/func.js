import { exec } from "child_process";
import { catchAsyncError }  from "../../middlewares/errors/error.middleware.js";
import ErrorHandler from "../errorHandler.js";
import { fileURLToPath } from 'url';
import path from "path";

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = "./a.out";
const cppBinaryPath = path.join(__dirname, `../../../cpp/${fileName}`);



const callCppAdd = catchAsyncError(async (req, res, next) => {
  const { x, y } = req.body;

  if (typeof x !== 'number' || typeof y !== 'number') {
    return next(new ErrorHandler("Bad request: x and y must be numbers", 400));
  }

  exec(`${cppBinaryPath} ${x} ${y}`, (error, stdout, stderr) => {
    if (error) {
      return next(new ErrorHandler(`C++ Error: ${stderr || error.message}`, 500));
    }

    const result = Number(stdout.trim());

    res.status(200).json({
      success: true,
      msg:`Addition of entered two numbers is ${result}`,
    });

  });

});

export {
    callCppAdd
}
