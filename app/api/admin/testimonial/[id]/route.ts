import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Testimonial from "@/config/utils/admin/testimonial/testimonialSchema";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET - Fetch single testimonial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const testimonial = await Testimonial.findById(params.id);
    
    if (!testimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found", 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: testimonial,
      message: "Testimonial fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonial",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT - Update testimonial by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const contentType = request.headers.get("content-type");
    let body: any;
    let avatarPath = "";

    // Handle multipart form data (with file upload)
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      
      // Extract form fields
      body = {
        name: formData.get("name") as string,
        location: formData.get("location") as string,
        content: formData.get("content") as string,
        rating: formData.get("rating") as string,
        servicesType: formData.get("servicesType") as string,
        date: formData.get("date") as string,
        status: formData.get("status") as string,
      };

      // Handle file upload
      const file = formData.get("avatar") as File;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname(file.name);
        const fileName = `testimonial-${timestamp}${fileExtension}`;
        const filePath = path.join(process.cwd(), "public", "testimonials", fileName);

        // Save file to public/testimonials
        await writeFile(filePath, buffer);
        avatarPath = `/testimonials/${fileName}`;
      } else {
        // Keep existing avatar if no new file is uploaded
        const existingTestimonial = await Testimonial.findById(params.id);
        avatarPath = existingTestimonial?.avatar || "";
      }
    } else {
      // Handle JSON data
      body = await request.json();
      avatarPath = body.avatar || "";
    }
    
    // Validate required fields
    const requiredFields = ['name', 'location', 'content', 'rating', 'servicesType'];
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required and cannot be empty`,
          },
          { status: 400 }
        );
      }
    }
    
    // Validate rating range
    const rating = parseInt(body.rating);
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }
    
    // Create update data
    const updateData = {
      name: body.name.trim(),
      location: body.location.trim(),
      avatar: avatarPath,
      content: body.content.trim(),
      rating: rating,
      servicesType: body.servicesType.trim(),
      date: body.date ? new Date(body.date) : new Date(),
      status: body.status || 'published',
    };
    
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTestimonial) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: "Testimonial updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update testimonial",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // First, find the testimonial to get the avatar path
    const testimonialToDelete = await Testimonial.findById(params.id);
    
    if (!testimonialToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "Testimonial not found",
        },
        { status: 404 }
      );
    }
    
    // Delete the testimonial from database
    const deletedTestimonial = await Testimonial.findByIdAndDelete(params.id);
    
    // Delete the associated image file if it exists
    if (testimonialToDelete.avatar && testimonialToDelete.avatar.startsWith('/testimonials/')) {
      try {
        const fileName = testimonialToDelete.avatar.replace('/testimonials/', '');
        const filePath = path.join(process.cwd(), "public", "testimonials", fileName);
        
        // Check if file exists before trying to delete
        if (existsSync(filePath)) {
          await unlink(filePath);
          console.log(`Deleted image file: ${filePath}`);
        }
      } catch (fileError) {
        console.error("Error deleting image file:", fileError);
        // Don't fail the entire operation if file deletion fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "Testimonial and associated image deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete testimonial",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}