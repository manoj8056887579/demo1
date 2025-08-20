import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Portfolio from "@/config/utils/admin/portfolio/PortfolioSchema";
import { deleteFromCloudinary } from "@/config/utils/cloudinary";

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
    const existingPortfolio = await Portfolio.findById(params.id);

    if (!existingPortfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio item not found",
        },
        { status: 404 }
      );
    }

    // Handle main image update
    if (body.image && body.image !== existingPortfolio.image) {
      try {
        // Delete old main image from Cloudinary
        const oldImageUrlParts = existingPortfolio.image.split('/');
        const oldImagePublicId = oldImageUrlParts.slice(oldImageUrlParts.indexOf('portfolio')).join('/').split('.')[0];
        await deleteFromCloudinary(oldImagePublicId);
      } catch (error) {
        console.error("Error deleting old main image:", error);
      }
    }

    // Handle gallery images update
    if (body.gallery) {
      // Find images that were removed
      const oldGalleryUrls = existingPortfolio.gallery || [];
      const removedImages = oldGalleryUrls.filter((oldUrl: string) => !body.gallery.includes(oldUrl));

      // Delete removed images from Cloudinary
      for (const removedUrl of removedImages) {
        try {
          const urlParts = removedUrl.split('/');
          const publicId = urlParts.slice(urlParts.indexOf('portfolio')).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error("Error deleting removed gallery image:", error);
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
  context: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);
    await connectDB();

    // First get the portfolio item to access its data before deletion
    const portfolioItemToDelete = await Portfolio.findById(id);

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
    await Portfolio.findByIdAndDelete(id);

    // Delete related images from Cloudinary
    try {
      // Delete main image if it exists
      if (portfolioItemToDelete.image) {
        try {
          // Extract public_id from the URL
          const urlParts = portfolioItemToDelete.image.split('/');
          const publicId = urlParts.slice(urlParts.indexOf('portfolio')).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error("Error deleting main image:", error);
        }
      }

      // Delete gallery images if they exist
      if (portfolioItemToDelete.gallery && portfolioItemToDelete.gallery.length > 0) {
        for (const imageUrl of portfolioItemToDelete.gallery) {
          try {
            // Extract public_id from the URL
            const urlParts = imageUrl.split('/');
            const publicId = urlParts.slice(urlParts.indexOf('portfolio')).join('/').split('.')[0];
            await deleteFromCloudinary(publicId);
          } catch (error) {
            console.error("Error deleting gallery image:", error);
          }
        }
      }

      console.log(
        `Deleted images from Cloudinary for portfolio item: ${portfolioItemToDelete.title}`
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
