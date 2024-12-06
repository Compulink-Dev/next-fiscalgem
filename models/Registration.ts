import mongoose, { Schema } from "mongoose";

const registrationSchema = new Schema({
    firstName: String,
    lastName: String,
    jobTitle: String,
    company: String,
    phoneNumber: String,
    country: String,
    state: String,
    email: String,
    industry: String,
    position: String,
    companySize: String,
},


    {
        timestamps: true
    }
)

const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema)

export default Registration