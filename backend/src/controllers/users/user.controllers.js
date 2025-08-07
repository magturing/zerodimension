import { catchAsyncError } from "../../middlewares/errors/error.middleware.js";
import { User } from "../../models/users/user.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { sendToken } from "../../utils/sendToken.js";
import { 
    invalidateToken, 
    sanitizeAndValidateSignup, 
    validateChangePassword, 
    validateLogin 
} from "../../utils/validation.js";
import { AccountLockOut } from "../../utils/rateLimiter.js";


/**
 * Function to signup to the application.
 */
const signUp = catchAsyncError(async(req,res,next) => {
    const {name,age,email,gender,password} = req.body;

    if(!sanitizeAndValidateSignup(req)){
        return next(new ErrorHandler("BAD Request",400));
    }

    let user = await User.findOne({email:email}).select("+isDeleted");

    if(user){
        if(user.isDeleted){
            return next(new ErrorHandler("Account deleted , wanna restore account ",404));
        }
        return next(new ErrorHandler("User exists",400));
    }
    
    // TODO
    // const file=req.file;
    // const fileUri=getDataUri(file);
    // const mycloud=await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        age,
        gender,
        avatar:{
            public_id:"random id",
            url:"random url",
        }

    });
    sendToken(res,user,"user created successfully!",201);
});

/**
 * Function to login to the application.
 */
const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!validateLogin(req)) {
        return next(new ErrorHandler("Bad request", 400));
    }

    const user = await User.findOne({ email }).select("+password +failedLoginAttempts +lockUntil +isDeleted");

    if (!user) {
        return next(new ErrorHandler("Incorrect Email or password", 401));
    }

    if(user.isDeleted){
        return next(new ErrorHandler("User does not exits",404));
    }

    if (user.isLocked()) {
        return next(new ErrorHandler("Account is locked. Try again later.", 403));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        await AccountLockOut(user);
        return next(new ErrorHandler("Incorrect Email or password", 401));
    }

    // Reset attempts on successful login using atomic update
    await User.updateOne({ _id: user._id }, { $set: { failedLoginAttempts: 0, lockUntil: null } });

    sendToken(res, user, `Welcome back !! ${user.name}`, 200);
});


/**
 * Function to get all users stored in the db.
 */
const getAllUsers = catchAsyncError(async(req,res,next) => {
    const user = await User.find({});
    res.status(200).json({
        success:true,
        user
    });
});

/**
 * Function to get myProfile.
 */
const myProfile = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    if(!user){
        return next(new ErrorHandler("Profile not Found",400));
    }
    res.status(200).json({
        success:true,
        user
    })
});

/**
 * Function to update user.
 */
const updateUser = catchAsyncError(async(req,res,next) => {
    const userId = await User.findById(req.user._id);
    if(!userId){
        return next(new ErrorHandler("Bad Request",400));
    }

    const data = req.body;

    if(Object.keys(data).length === 0){
        return next(new ErrorHandler("Nothing to update",400));
    }

    const ALLOWED_UPDATES = [
        "name","age","gender","avatar"
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if(!isUpdateAllowed){
        return res.status(400).json({
            success:false,
            message:"Update not allowed"
        })
    }

    const user = await User.findByIdAndUpdate(userId,data,{
        returnDocument:"after",
        runValidators:true,
    });

    res.status(200).json({
        success:true,
        user
    });
});

/**
 * Controller function to update user password.
 */
const changePassword = catchAsyncError(async(req,res,next) => {
    const {oldPassword,newPassword} = req.body;
    
    validateChangePassword(req);

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);


    if(!isMatch){
        await AccountLockOut(user);
        return next(new ErrorHandler("Please enter correct old password to update password ",401));
    }

    user.password = newPassword;
    await user.save();

 
    sendToken(res,user,"Password updated successfully!",200)
    
});

/**
 * Controller function to soft_delete the current_user.
 */
const deleteUser = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.user._id).select("+isDeleted");
    const isDeleted = user.isDeleted;

    if(isDeleted){
        return res.status(404).json({
            success:false,
            message:"User does not exists"
        });
    }

    user.isDeleted = true;
    await user.save();

    invalidateToken(user,res,"user Deleted Successfully",200);
});

/**
 * Controller function to logout user from the application..
 */
const logout = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user._id);
    invalidateToken(user,res,"Logged out successfully",200);
});



export {
    signUp,
    login,
    getAllUsers,
    myProfile,
    updateUser,
    changePassword,
    deleteUser,
    logout
}