import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true }
    },
    pageName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    keywords: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better performance
seoSchema.index({ isActive: 1 });

const SEO = mongoose.models.SEO || mongoose.model("SEO", seoSchema);

// Default SEO data
const defaultSEOData = [
  {
    id: "home",
    pageName: "Home Page",
    title:
      "Filigree Solutions - Advanced CAD & CAE Services | Engineering Excellence",
    description:
      "Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India. Expert solutions for automotive, telecom, and industrial sectors.",
    keywords:
      "CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation, FEA, automotive engineering, telecom analysis",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "about",
    pageName: "About Us",
    title: "About Filigree Solutions - Expert CAD & Engineering Team",
    description:
      "Learn about our experienced team of engineers specializing in CAD, CAE, and structural analysis. Discover our mission, vision, and commitment to engineering excellence.",
    keywords:
      "about filigree solutions, engineering team, CAD experts, structural analysis specialists, company profile",
    lastUpdated: new Date("2024-01-14"),
  },
  {
    id: "services",
    pageName: "Services",
    title:
      "Engineering Services - CAD, CAE, Structural Analysis | Filigree Solutions",
    description:
      "Comprehensive engineering services including CAD drafting, 3D modeling, structural analysis, EV component simulation, and telecom tower analysis.",
    keywords:
      "engineering services, CAD drafting, 3D modeling, structural analysis, EV simulation, telecom analysis, GD&T application",
    lastUpdated: new Date("2024-01-13"),
  },
  {
    id: "portfolio",
    pageName: "Portfolio",
    title:
      "Engineering Portfolio - Case Studies & Projects | Filigree Solutions",
    description:
      "Explore our portfolio of successful engineering projects including telecom towers, EV components, industrial systems, and structural analysis case studies.",
    keywords:
      "engineering portfolio, case studies, telecom projects, EV analysis, structural projects, engineering solutions",
    lastUpdated: new Date("2024-01-12"),
  },
  {
    id: "contact",
    pageName: "Contact Us",
    title: "Contact Filigree Solutions - Get Engineering Consultation",
    description:
      "Contact our engineering experts for CAD, CAE, and structural analysis services. Located in Madurai, Tamil Nadu. Get quotes and consultations.",
    keywords:
      "contact filigree solutions, engineering consultation, CAD services quote, Madurai engineering, structural analysis contact",
    lastUpdated: new Date("2024-01-11"),
  },
];

// Auto-seed function
const autoSeedSEO = async () => {
  try {
    const count = await SEO.countDocuments();
    if (count === 0) {
      await SEO.insertMany(defaultSEOData);
      console.log("✅ SEO database auto-seeded with default data");
    }
  } catch (error) {
    console.error("❌ Error auto-seeding SEO data:", error);
  }
};

// Auto-seed when model is first loaded
if (mongoose.connection.readyState === 1) {
  autoSeedSEO();
} else {
  mongoose.connection.once("open", autoSeedSEO);
}

export default SEO;
