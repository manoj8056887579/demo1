import mongoose from "mongoose";

const portfolioCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
portfolioCategorySchema.index({ name: 1 });

const PortfolioCategory =
  mongoose.models.PortfolioCategory ||
  mongoose.model("PortfolioCategory", portfolioCategorySchema, "portfoliocategories");

export default PortfolioCategory;