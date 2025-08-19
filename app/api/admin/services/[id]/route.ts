import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Services from "@/config/utils/admin/services/servicesSchema";
import { unlink, rmdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET - Fetch single service by ID or title
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    let service;
    
    // Check if params.id is a MongoDB ObjectId (24 characters hex) or a title-based slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    
    if (isObjectId) {
      // Search by MongoDB _id
      service = await Services.findById(params.id);
    } else {
      // Search by title (convert URL slug back to title for matching)
      const titleFromSlug = params.id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Try to find by exact title match or by slug-like title variations
      service = await Services.findOne({
        $or: [
          { title: titleFromSlug },
          { title: { $regex: new RegExp(titleFromSlug.replace(/\s+/g, '.*'), 'i') } },
          // Also try direct slug matching if we add slug field later
        ]
      });
    }
    
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: service,
      message: "Service fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT - Update service by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if maximum featured services limit reached when trying to feature a service
    if (body.featured) {
      // Get the current service to check if it's already featured
      const currentService = await Services.findById(params.id);
      
      // If the service is not currently featured and we're trying to feature it
      if (currentService && !currentService.featured) {
        const existingFeaturedCount = await Services.countDocuments({ featured: true });
        if (existingFeaturedCount >= 3) {
          return NextResponse.json(
            {
              success: false,
              message: "Maximum limit of 3 featured services reached. Please unfeature an existing service to feature this one.",
            },
            { status: 400 }
          );
        }
      }
    }
    
    // Generate slug from title if title is being updated
    if (body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    
    const updatedService = await Services.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedService,
      message: "Service updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update service",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete service by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // First get the service to access its data before deletion
    const serviceToDelete = await Services.findById(params.id);
    
    if (!serviceToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }
    
    // Generate service title slug for directory path
    const serviceTitleSlug = serviceToDelete.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Delete the service from database
    await Services.findByIdAndDelete(params.id);
    
    // Delete related image files and directories
    try {
      const baseDir = path.join(process.cwd(), "public", "admin", "services", "main");
      
      // Delete main image directory
      const mainImageDir = path.join(baseDir, serviceTitleSlug);
      if (existsSync(mainImageDir)) {
        // Delete all files in the main image directory
        const fs = require('fs');
        const files = fs.readdirSync(mainImageDir);
        for (const file of files) {
          await unlink(path.join(mainImageDir, file));
        }
        // Delete the directory
        await rmdir(mainImageDir);
      }
      
      // Delete gallery directory
      const galleryDir = path.join(baseDir, "gallery", serviceTitleSlug);
      if (existsSync(galleryDir)) {
        // Delete all files in the gallery directory
        const fs = require('fs');
        const files = fs.readdirSync(galleryDir);
        for (const file of files) {
          await unlink(path.join(galleryDir, file));
        }
        // Delete the directory
        await rmdir(galleryDir);
      }
      
      console.log(`Deleted image directories for service: ${serviceToDelete.title}`);
    } catch (fileError) {
      console.error("Error deleting image files:", fileError);
      // Don't fail the entire operation if file deletion fails
    }
    
    return NextResponse.json({
      success: true,
      message: "Service and related files deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete service",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}