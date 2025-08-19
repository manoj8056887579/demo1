import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // Basic Contact Information
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    
    // Address Information
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    
    // Social Media Links
    facebook: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    twitter: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    linkedin: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    instagram: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    youtube: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    whatsapp: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    telegram: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    github: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    behance: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    dribbble: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    
    // Google Maps Integration
    mapEmbedCode: {
      type: String,
      trim: true,
    },
    
    // Contact Page Content
    pageTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    pageDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    officeTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    officeDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    

  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });

const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema, "contactschemas");

export default Contact;