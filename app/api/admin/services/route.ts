import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Services from "@/config/utils/admin/services/servicesSchema";
import { uploadToCloudinary } from "@/config/utils/cloudinary";


// GET - Fetch all services with optional pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = parseInt(searchParams.get('limit') || '6');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search'); 
    const all = searchParams.get('all');
    const isAdmin = searchParams.get('isAdmin') === 'true';
     
    // Build query based on whether it's an admin or frontend request
    const query: any = {};
    
    if (isAdmin) {
      // Admin query - show all services unless filtered
      if (status && status !== 'all') {
        query.status = status;
      }
    } else {
      // Frontend query - only show active services
      query.status = 'active';
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { features: { $in: [new RegExp(search, 'i')] } },
        { applications: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // If 'all' parameter is present or no page parameter, return all services without pagination
    if (all === 'true' || !page) {
      const services = await Services.find(query)
        .sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        data: services,
        message: "All services fetched successfully",
      });
    }
    
    // Otherwise, use pagination (for admin services page)
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limit;
    
    // Get total count for pagination
    const totalServices = await Services.countDocuments(query);
    const totalPages = Math.ceil(totalServices / limit);
    
    // Fetch services with pagination
    const services = await Services.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      data: services,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalServices,
        limit,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      message: "Services fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new service or handle file upload
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    
    // Handle file upload
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const type = formData.get("type") as string;
      const serviceTitle = formData.get("serviceTitle") as string;
      const action = formData.get("action") as string;
      
      if (!file || !type || !serviceTitle || action !== "upload") {
        return NextResponse.json(
          { success: false, message: "Missing required upload parameters" },
          { status: 400 }
        );
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to Cloudinary with appropriate folder structure
      const folder = `services/${type === "main" ? serviceTitle : `gallery/${serviceTitle}`}`;
      const result = await uploadToCloudinary(buffer, folder);
      
      return NextResponse.json({
        success: true,
        filePath: result.secure_url,
        publicId: result.public_id,
        message: "File uploaded successfully",
      });
    }
    
    // Handle regular service creation
    await connectDB();
    
    const body = await request.json();
    
    // Check if maximum featured services limit reached (3 featured services max)
    if (body.featured) {
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
    
    // Validate required fields
    const requiredFields = ['title', 'heading', 'shortDescription', 'fullDescription', 'image', 'seoTitle', 'seoDescription', 'seoKeywords'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required and cannot be empty`,
          },
          { status: 400 }
        );
      }
    }
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const serviceData = {
      ...body,
      slug,
    };
    
    const newService = new Services(serviceData);
    const savedService = await newService.save();
    
    return NextResponse.json({
      success: true,
      data: savedService,
      message: "Service created successfully",
    });
  } catch (error: unknown) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to process request",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}