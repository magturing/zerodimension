import mongoose,{Schema} from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const userSchema = new Schema({
    name:{
        type:String,
        minLength:[2,"Name can not be less than 2 characters"],
        required:true,
        maxLength:[20,"Name can not be more than 20 characters long"],
        trim:true
    },
    email:{
        type:String,
        required:true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email format"
        },
        trim:true,
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
        select:false
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Password can not be less than 6 characters"],
        select:false,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password");
            }
        }
    },
    age:{
        type:Number,
        min:[18,"Minimum age must be 18 to use this application"],
        max:[100,"age exceeded"]
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
            // validate(value){
            //     if(!validator.isURL(value)){
            //         throw new Error("Invalid image url");
            //     }
            // }
        },
        url:{
            type:String,
            required:true,
            // validate(value){
            //     if(!validator.isURL(value)){
            //         throw new Error("Invalid image url");
            //     }
            // }
        }
    },
    sessionToken:{
        type:String,
        select:false
    },
    failedLoginAttempts: { 
        type: Number, 
        default: 0,
        select:false
    },
    lockUntil: { 
        type: Date, 
        default: null,
        select:false
    },
    isDeleted:{
        type:Boolean,
        default:false,
        select:false
    },
    refreshToken:String
},{timestamps:true});


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const hashedPassword=await bcrypt.hash(this.password,10);
    this.password=hashedPassword;
    next();
 });
 
userSchema.methods.getJwtSessionToken = function(){
     const sessionID = uuidv4();
     this.sessionToken = sessionID;
     return jwt.sign(
     {
        _id:this._id,
        sessionToken:sessionID
     },
     process.env.JWT_SECRET,
     { expiresIn:"2d"},
   );
}

userSchema.methods.getRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:"15d"
        }
    )
}

userSchema.methods.getJwtAuthorizationToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            role:this.role
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"},
    ).toString();
}
 
userSchema.methods.comparePassword = async function(password){
     return await bcrypt.compare(password,this.password);
 }


userSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};


export const User = mongoose.model("User",userSchema);


