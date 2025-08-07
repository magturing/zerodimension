import rateLimit from "express-rate-limit";
import { User } from "../models/users/user.model.js";
import { catchAsyncError } from "../middlewares/errors/error.middleware.js";

/**
 * Function to implement IP-Based Rate-Limiting.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
  headers: true,
});


/**
 * Rate limiter to ensure password change does not fall in to brute force attack..
 */
export const changePasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: `Too many password change requests, please try again after 15 minutes`,
  statusCode: 429,
  keyGenerator: (req) => req.user?._id ? `${req.user._id}-${req.ip}` : req.ip, 
});

/**
 * Function to implement account LockOut functionality.
 */
export const AccountLockOut = async (user) => {
  const MAX_ATTEMPTS = process.env.MAX_FAILED_LOGIN_ATTEMPTS;  
  const LOCK_TIME = 15 * 60 * 1000; // Lock duration: 15 minutes

  if (user.isLocked()) return; 

  const updates = { $inc: { failedLoginAttempts: 1 } };


  if (user.failedLoginAttempts + 1 >= MAX_ATTEMPTS) {
      updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  await User.updateOne({ _id: user._id }, updates);
};

