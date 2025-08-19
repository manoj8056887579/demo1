import mongoose from "mongoose";

const keyMetricSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    category: {
      type: String,
      required: true,
      trim: true,
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
    challenges: {
      type: String,
      required: true,
      trim: true,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
    },
    results: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
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
    tags: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
    methodology: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    keyMetrics: [keyMetricSchema],
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
    slug: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
portfolioSchema.index({ title: 1 });
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ status: 1 });
portfolioSchema.index({ year: 1 });
portfolioSchema.index({ title: "text", shortDescription: "text" });

const Portfolio =
  mongoose.models.Portfolio ||
  mongoose.model("Portfolio", portfolioSchema, "portfolioschemas");

export default Portfolio;