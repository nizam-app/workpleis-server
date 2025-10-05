import mongoose from "mongoose";



  

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["CLIENT", "SERVICE_PROVIDER", "ADMIN"],
      default: "SERVICE_PROVIDER",
    },
    subRole: {
      type: String,
      enum: ["INDIVIDUAL", "BUSINESS"],
      default: "INDIVIDUAL",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    phoneNumber: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    isPaymentVerified :{
      type: Boolean,
      default: false
    },
    isVerifiedEmail: { 
      type: Boolean, 
      default: false 
    },
    isVerifiedPhone: { 
      type: Boolean, 
      default: false 
    },
    isVerifiedIdentity: { 
      type: Boolean,  
      default: false 
    },

    identityFrontDoc: {
      type: String,  
    },
    identityBackDoc: {
      type: String,  
    },
    businessIdentityDoc :{
      type : [String]
    },

    emailVerificationCode: {type : String},
    emailVerificationExpires: {type : Date},

    phoneVerificationCode: {type :  String},
    phoneVerificationExpires: {type :  Date},
  },
  { timestamps: true, versionKey : false }
);



const User = mongoose.model("User", userSchema);

export default User;