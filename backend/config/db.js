import mongoose from "mongoose";

const connectDB = async() => {
    try {
const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db connected");
    } catch(error) {
        console.log("database not connected");
        console.log(error.message);
    }  
};
export default connectDB;
