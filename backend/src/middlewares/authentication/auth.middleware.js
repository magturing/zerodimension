import jwt from "jsonwebtoken";
import { User } from "../../models/users/user.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { catchAsyncError } from "../errors/error.middleware.js";


const validateToken = (sessionTokenReceived,user) => {
    if (!user.sessionToken) return false;
    const token = user.sessionToken;
    return token === sessionTokenReceived;
}



export const isAuthenticated = catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to access this resource ",401));
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const sessionTokenReceived = decoded.sessionToken;

    const user = await User.findById(decoded._id).select("+sessionToken +isDeleted");

    if(user.isDeleted){
        return next(new ErrorHandler("Something Went Wrong",500));
    }

    const validate = validateToken(sessionTokenReceived,user);

    if(!validate){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }

    req.user=user;

    next();
});


export const isAuthorizedUser = catchAsyncError(async(req,res,next) => {
    const token = req.headers.authorization?.split(" ");
    if(!token){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }
    const tokenType = token[0];
    const tokenValue = token[1];

    if(tokenType !== "Bearer"){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }

    const decoded = jwt.verify(tokenValue,process.env.JWT_SECRET);
    if(decoded.role !== "USER"){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }
    
    next();
});


export const isAuthorizedAdmin = catchAsyncError(async(req,res,next) => {
    const token = req.headers.authorization?.split(" ");
    if(!token){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }
    const tokenType = token[0];
    const tokenValue = token[1];

    if(tokenType !== "Bearer"){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }

    const decoded = jwt.verify(tokenValue,process.env.JWT_SECRET);
    if(decoded.role !== "ADMIN"){
        return next(new ErrorHandler("UNAUTHORIZED",401));
    }
    
    next();
});