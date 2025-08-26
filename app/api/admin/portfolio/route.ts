import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Portfolio from "@/config/utils/admin/portfolio/PortfolioSchema";
import { uploadToCloudinary } from "@/config/utils/cloudinary";

// GET - Fetch all portfolio items with optional pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
     
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = parseInt(searchParams.get('limit') || '6');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const all = searchParams.get('all'); // New parameter to get all portfolio items
    
    // Build query
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // If 'all' parameter is present or no page parameter, return all portfolio items without pagination
    if (all === 'true' || !page) {
      const portfolioItems = await Portfolio.find(query)
        .sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        data: portfolioItems,
        message: "All portfolio items fetched successfully",
      });
    }
    
    // Otherwise, use pagination (for admin portfolio page)
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limit;
    
    // Get total count for pagination
    const totalPortfolioItems = await Portfolio.countDocuments(query);
    const totalPages = Math.ceil(totalPortfolioItems / limit);
    
    // Fetch portfolio items with pagination
    const portfolioItems = await Portfolio.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      data: portfolioItems,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPortfolioItems,
        limit,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      message: "Portfolio items fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch portfolio items",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new portfolio item or handle file upload
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    
    // Handle file upload
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const type = formData.get("type") as string;
      const portfolioTitle = formData.get("portfolioTitle") as string;
      const action = formData.get("action") as string;
      
      if (!file || !type || !portfolioTitle || action !== "upload") {
        return NextResponse.json(
          { success: false, message: "Missing required upload parameters" },
          { status: 400 }
        );
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to Cloudinary with appropriate folder structure
      const folder = `portfolio/${type === "main" ? portfolioTitle : `gallery/${portfolioTitle}`}`;
      const result = await uploadToCloudinary(buffer, folder);
      
      return NextResponse.json({
        success: true,
        filePath: result.secure_url,
        publicId: result.public_id,
        message: "File uploaded successfully",
      });
    }
    
    // Handle regular portfolio item creation
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'shortDescription', 'fullDescription', 'challenges', 'solution', 'results', 'client', 'duration', 'year', 'image', 'seoTitle', 'seoDescription', 'seoKeywords'];
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
    
    const portfolioData = {
      ...body,
      slug,
    };
    
    const newPortfolioItem = new Portfolio(portfolioData);
    const savedPortfolioItem = await newPortfolioItem.save();
    
    return NextResponse.json({
      success: true,
      data: savedPortfolioItem,
      message: "Portfolio item created successfully",
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