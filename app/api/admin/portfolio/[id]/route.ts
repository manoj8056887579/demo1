import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Portfolio from "@/config/utils/admin/portfolio/PortfolioSchema";
import { unlink, rmdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET - Fetch single portfolio item by ID or title
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    let portfolioItem;

    // Check if params.id is a MongoDB ObjectId (24 characters hex) or a title-based slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);

    if (isObjectId) {
      // Search by MongoDB _id
      portfolioItem = await Portfolio.findById(params.id);
    } else {
      // Search by title (convert URL slug back to title for matching)
      const titleFromSlug = params.id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Try to find by exact title match or by slug-like title variations
      portfolioItem = await Portfolio.findOne({
        $or: [
          { title: titleFromSlug },
          {
            title: {
              $regex: new RegExp(titleFromSlug.replace(/\s+/g, ".*"), "i"),
            },
          },
          { slug: params.id },
        ],
      });
    }

    if (!portfolioItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: portfolioItem,
      message: "Portfolio item fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch portfolio item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update portfolio item by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    // Generate slug from title if title is being updated
    if (body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updatedPortfolioItem = await Portfolio.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedPortfolioItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPortfolioItem,
      message: "Portfolio item updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update portfolio item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete portfolio item by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // First get the portfolio item to access its data before deletion
    const portfolioItemToDelete = await Portfolio.findById(params.id);

    if (!portfolioItemToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio item not found",
        },
        { status: 404 }
      );
    }

    // Generate portfolio title slug for directory path
    const portfolioTitleSlug = portfolioItemToDelete.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Delete the portfolio item from database
    await Portfolio.findByIdAndDelete(params.id);

    // Delete related image files and directories
    try {
      const baseDir = path.join(
        process.cwd(),
        "public",
        "admin",
        "portfolio",
        "main"
      );

      // Delete main image directory
      const mainImageDir = path.join(baseDir, portfolioTitleSlug);
      if (existsSync(mainImageDir)) {
        // Delete all files in the main image directory
        const fs = require("fs");
        const files = fs.readdirSync(mainImageDir);
        for (const file of files) {
          await unlink(path.join(mainImageDir, file));
        }
        // Delete the directory
        await rmdir(mainImageDir);
      }

      // Delete gallery directory
      const galleryDir = path.join(baseDir, "gallery", portfolioTitleSlug);
      if (existsSync(galleryDir)) {
        // Delete all files in the gallery directory
        const fs = require("fs");
        const files = fs.readdirSync(galleryDir);
        for (const file of files) {
          await unlink(path.join(galleryDir, file));
        }
        // Delete the directory
        await rmdir(galleryDir);
      }

      console.log(
        `Deleted image directories for portfolio item: ${portfolioItemToDelete.title}`
      );
    } catch (fileError) {
      console.error("Error deleting image files:", fileError);
      // Don't fail the entire operation if file deletion fails
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio item and related files deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete portfolio item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
