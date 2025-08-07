import mongoose from "mongoose";
import validator from "validator";


export const sanitizeAndValidateSignup = (req) => {
    let { name, age, gender, email, password } = req.body;

    if (!name || !age || !gender || !email || !password) {
        throw new Error("Bad request: All fields are required");
    }

    name = validator.trim(name); 
    name = validator.escape(name); 

    email = validator.trim(email); 
    gender = validator.trim(gender); 

    //  Validate Name: Only alphabets, no special characters
    if (!/^[a-zA-Z ]+$/.test(name)) {
        throw new Error("Invalid name: Only letters and spaces are allowed");
    }

    //  Validate Age: Must be a number between 18-100
    if (!validator.isInt(String(age), { min: 18, max: 100 })) {
        throw new Error("Invalid age: Must be a number between 18 and 100");
    }

    //  Validate Gender: Only "male" or "female"
    if (!["male", "female"].includes(gender.toLowerCase())) {
        throw new Error("Invalid gender: Must be 'male' or 'female'");
    }

    //  Validate Email: Ensure a proper email format
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format");
    }

    // Validate Password: Minimum 6 characters, at least one number & one letter
    if (!validator.isStrongPassword(password, { minLength: 6, minNumbers: 1, minLowercase: 1, minUppercase: 0 })) {
        throw new Error("Invalid password: Must be at least 6 characters and contain at least one number");
    }
    
    return true;
};


export const validateLogin = (req) => {
    const {email,password} = req.body;
    if(!email || !password){
        throw new Error("Enter all fields");
    }

    if(!validator.isEmail(email)){
        throw new Error("Invalid Email format");
    }

    return true;
}


export const validateChangePassword = (req) => {
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        throw new Error("Please enter all fields");
    }
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please Enter a strong password");
    }
    return true;
}


export const invalidateToken = async (user,res, message, statusCode = 200) => {
    user.getJwtSessionToken();
    await user.save();
    return res
        .status(statusCode)
        .cookie("token", "", {  
            expires: new Date(0),  
            httpOnly: true,  
            secure: true,  
            sameSite: "None" 
        })
        .setHeader("Authorization", "") 
        .json({
            success: true,
            message: message
        });
};


export const isValidId = async (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return false;
    }
    return true;
}