import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for password reset"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    otp: {
      type: String,
      required: [true, "OTP code is required"],
      minlength: [6, "OTP must be at least 6 digits"],
      maxlength: [6, "OTP cannot be longer than 6 digits"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

export default ForgotPassword;
