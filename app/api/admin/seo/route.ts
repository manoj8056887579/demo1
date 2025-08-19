import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import SEO from "@/config/utils/admin/seo/seoSchema";

// GET - Fetch all SEO pages
export async function GET() {
  try {
    await connectDB();

    // The auto-seeding will happen automatically when the schema is loaded
    const seoPages = await SEO.find({ isActive: true })
      .sort({ lastUpdated: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: seoPages,
        message: "SEO pages fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching SEO pages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch SEO pages",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing SEO page
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, pageName, title, description, keywords } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID is required for updating",
        },
        { status: 400 }
      );
    }

    // Find and update the SEO page
    const updatedSEO = await SEO.findOneAndUpdate(
      { id },
      {
        ...(pageName && { pageName }),
        ...(title && { title }),
        ...(description && { description }),
        ...(keywords !== undefined && { keywords }),
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSEO) {
      return NextResponse.json(
        {
          success: false,
          message: "SEO page not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedSEO,
        message: "SEO page updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating SEO page:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update SEO page",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
