import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import PortfolioCategory from "@/config/utils/admin/portfolio/PortfolioCategorySchema";

// GET - Fetch all portfolio categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const categories = await PortfolioCategory.find({})
      .sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: "Portfolio categories fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching portfolio categories:", error); 
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch portfolio categories",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new portfolio category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required and cannot be empty",
        },
        { status: 400 }
      );
    }
    
    // Check if category already exists
    const existingCategory = await PortfolioCategory.findOne({ 
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } 
    });
    
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category with this name already exists",
        },
        { status: 400 }
      );
    }
    
    const categoryData = {
      name: body.name.trim(),
    };
    
    const newCategory = new PortfolioCategory(categoryData);
    const savedCategory = await newCategory.save();
    
    return NextResponse.json({
      success: true,
      data: savedCategory,
      message: "Portfolio category created successfully",
    });
  } catch (error: unknown) {
    console.error("Error creating portfolio category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create portfolio category",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}