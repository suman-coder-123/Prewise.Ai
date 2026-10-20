import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName : {
            type: String,
            required :true,
            trim :true,
        },

        email :{
            type :String,
            required :true,
            unique :true,
            lowercase :true,
            trim :true,
        },

        password : {
            type:String,
            required :true,
            minlength :6,
        },
        ProfileImage : {
            type : String ,
            default : "",
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            default: 0,
        },
        currentRole: {
            type: String,
            default: "",
        },
        targetRole: {
            type: String,
            default: "",
        },
        experienceLevel: {
            type: String,
            enum: ["fresher", "junior", "mid", "senior", "lead"],
            default: "junior",
        },
        suggestedRoles: {
            type: [String],
            default: [],
        },
        profileSummary: {
            type: String,
            default: "",
        },
        preferences: {
            preferredCity: { type: String, default: "" },
            preferredCities: { type: [String], default: ["Bangalore", "Mumbai", "Delhi", "Hyderabad"] },
            workType: { type: String, enum: ["remote", "hybrid", "onsite", "any"], default: "any" },
            willingToRelocate: { type: Boolean, default: false },
            minSalary: { type: Number, default: 0 },
            maxSalary: { type: Number, default: 0 },
        },
    },
    {
        timestamps : true,
    }
);

const User = mongoose.model("User" , UserSchema);

export default User;