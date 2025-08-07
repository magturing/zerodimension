

export const sendToken = async (res,user,message,statusCode) => {
    const token = user.getJwtSessionToken();
    const authToken = user.getJwtAuthorizationToken();

    await user.save();

    const options = {
        httpOnly:true,
        secure:false,
        sameSite:"lax",
    };

    user = user.toObject();
    delete user.password;
    delete user.role;
    delete user.sessionToken;
    delete user.isDeleted;
    delete user.failedLoginAttempts;
    delete user.lockUntil;

   res.status(statusCode)
    .cookie("token",token,options)
    .setHeader("Authorization", `Bearer ${authToken}`)
    .json({
        success:true,
        message:message,
        user
    });

}



