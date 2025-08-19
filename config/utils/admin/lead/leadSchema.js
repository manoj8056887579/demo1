import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    // Contact Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },

    // Service Information
    service: {
      type: String,
      required: true,
      trim: true,
    },

    // Project Details
    message: {
      type: String,
      required: true,
      trim: true,
    },
    projectDescription: {
      type: String,
      trim: true,
      default: "",
    },
    additionalRequirements: {
      type: String,
      trim: true,
      default: "",
    },

    // Lead Management
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "high",
    },

    // Form Source Tracking
    formSource: {
      type: String,
      enum: ["quotation", "contact", "lead", "brochure"], // Changed "broucher" to "brochure"
      required: true,
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ formSource: 1 });
leadSchema.index({ submittedAt: -1 });

// Update lastUpdated on save
leadSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
