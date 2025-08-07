import mongoose from "mongoose";


const connectToDb = async () => {
    const conn = await mongoose.connect(process.env.DB_URI);
    return conn;
}

export {connectToDb};



