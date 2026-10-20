import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true,
        },

        originalFileName : {
            type : String,
            required: true,
        },
        atsScore : {
            type : Number,
            required: true,
        },
        summary : {
            type : String,
            default : "",
        },

        strengths : [
            {
                type : String,
            },
        ],

        weaknesses : [
            {
                type : String,
            },
        ],
        missingSkills : [
            {
                type : String,
            },
        ],

        suggestions : [
            {
                type : String,
            },
        ],

        extractedSkills : [
            {
                type : String,
            },
        ],

        experienceLevel : {
            type : String,
            default : "",
        },

        suggestedRoles : [
            {
                type : String,
            },
        ],
    },
        {
           timestamps : true, 
        }
);

const Resume = mongoose.model("Resume" , resumeSchema);

export default Resume;