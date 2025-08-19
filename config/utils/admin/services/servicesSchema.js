import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema(
  {
    step: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const servicesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    fullDescription: {
      type: String,
      required: true,
      trim: true,
    },
    features: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    applications: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    technologies: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    image: {
      type: String,
      required: true,
      trim: true,
    },
    gallery: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    seoDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    seoKeywords: {
      type: String,
      required: true,
      trim: true,
    },
    process: [processStepSchema],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
servicesSchema.index({ title: 1 });
servicesSchema.index({ status: 1 });
servicesSchema.index({ featured: 1 });
servicesSchema.index({ title: "text", shortDescription: "text" });

const Services =
  mongoose.models.Services ||
  mongoose.model("Services", servicesSchema, "servicesschemas");

export default Services;
