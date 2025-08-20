import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Services from "@/config/utils/admin/services/servicesSchema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/utils/cloudinary";

// GET - Fetch single service by ID or title
export async function GET(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { params } = context;
    const id = params.id;
    
    let service;
    
    // Check if id is a MongoDB ObjectId (24 characters hex) or a title-based slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isObjectId) {
      // Search by MongoDB _id
      service = await Services.findById(id);
    } else {
      // Search by title (convert URL slug back to title for matching)
      const titleFromSlug = id
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
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { params } = context;
    const id = params.id;
    
    const body = await request.json();
    const existingService = await Services.findById(id);

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    // Handle main image update
    if (body.image && body.image !== existingService.image) {
      try {
        // Delete old main image from Cloudinary
        const oldImageUrlParts = existingService.image.split('/');
        const oldImagePublicId = oldImageUrlParts.slice(oldImageUrlParts.indexOf('services')).join('/').split('.')[0];
        await deleteFromCloudinary(oldImagePublicId);
      } catch (error) {
        console.error("Error deleting old main image:", error);
      }
    }

    // Handle gallery images update
    if (body.gallery) {
      // Find images that were removed
      const oldGalleryUrls = existingService.gallery || [];
      const removedImages = oldGalleryUrls.filter((oldUrl: string) => !body.gallery.includes(oldUrl));

      // Delete removed images from Cloudinary
      for (const removedUrl of removedImages) {
        try {
          const urlParts = removedUrl.split('/');
          const publicId = urlParts.slice(urlParts.indexOf('services')).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error("Error deleting removed gallery image:", error);
        }
      }
    }
    
    // Check if maximum featured services limit reached when trying to feature a service
    if (body.featured) {
      // If the service is not currently featured and we're trying to feature it
      if (!existingService.featured) {
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
      id,
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
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { params } = context;
    const id = params.id;
    
    // First get the service to access its data before deletion
    const serviceToDelete = await Services.findById(id);
    
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
    await Services.findByIdAndDelete(id);
    
    // Delete related images from Cloudinary
    try {
      // Delete main image if it exists
      if (serviceToDelete.image) {
        try {
          // Extract public_id from the URL
          const urlParts = serviceToDelete.image.split('/');
          const publicId = urlParts.slice(urlParts.indexOf('services')).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error("Error deleting main image:", error);
        }
      }

      // Delete gallery images if they exist
      if (serviceToDelete.gallery && serviceToDelete.gallery.length > 0) {
        for (const imageUrl of serviceToDelete.gallery) {
          try {
            // Extract public_id from the URL
            const urlParts = imageUrl.split('/');
            const publicId = urlParts.slice(urlParts.indexOf('services')).join('/').split('.')[0];
            await deleteFromCloudinary(publicId);
          } catch (error) {
            console.error("Error deleting gallery image:", error);
          }
        }
      }

      console.log(`Deleted images from Cloudinary for service: ${serviceToDelete.title}`);
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