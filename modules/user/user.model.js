import mongoose from "mongoose";



  

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
      minlength: 6,
      required : function(){
            return !this.isGoogle;
     }, 
    },
    role: {
      type: String,
      enum: ["CLIENT", "JOB_SEEKER", "ADMIN"],
      default: "JOB_SEEKER",
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

    identitySessionId : {type : String},


    emailVerificationCode: {type : String},
    emailVerificationExpires: {type : Date},

    phoneVerificationCode: {type :  String},
    phoneVerificationExpires: {type :  Date},
  },
  { timestamps: true, versionKey : false }
);



const User = mongoose.model("User", userSchema);

export default User;