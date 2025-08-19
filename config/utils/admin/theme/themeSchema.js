import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      default: "default",
      index: { unique: true }
    },
    siteName: {
      type: String,
      required: true,
      trim: true,
      default: "Filigree Solutions"
    },
    logo: {
      type: String,
      trim: true,
      default: null
    },
    favicon: {
      type: String,
      trim: true,
      default: null
    },
    primaryColor: {
      type: String,
      required: true,
      trim: true,
      match: /^#[0-9A-F]{6}$/i,
      default: "#2563eb"
    },
    secondaryColor: {
      type: String,
      required: true,
      trim: true,
      match: /^#[0-9A-F]{6}$/i,
      default: "#9333ea"
    },
    gradientDirection: {
      type: String,
      enum: ["135deg", "90deg", "45deg", "180deg"],
      default: "135deg"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

// Create index for better performance
themeSchema.index({ isActive: 1 });

const Theme = mongoose.models.Theme || mongoose.model("Theme", themeSchema);

// Default theme data
const defaultThemeData = {
  id: "default",
  siteName: "Filigree Solutions",
  logo: null,
  favicon: null,
  primaryColor: "#2563eb",
  secondaryColor: "#9333ea",
  gradientDirection: "135deg",
  isActive: true,
  lastUpdated: new Date()
};

// Auto-seed function
const autoSeedTheme = async () => {
  try {
    const count = await Theme.countDocuments();
    if (count === 0) {
      await Theme.create(defaultThemeData);
      console.log("✅ Theme database auto-seeded with default data");
    }
  } catch (error) {
    console.error("❌ Error auto-seeding theme data:", error);
  }
};

// Auto-seed when model is first loaded
if (mongoose.connection.readyState === 1) {
  autoSeedTheme();
} else {
  mongoose.connection.once("open", autoSeedTheme);
}

export default Theme;