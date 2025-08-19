import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/config/models/connectDB"
import PortfolioCategory from "@/config/utils/admin/portfolio/PortfolioCategorySchema"

// PUT - Update portfolio category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { id } = params

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required and cannot be empty",
        },
        { status: 400 },
      )
    }

    // Check if category already exists (excluding current category)
    const existingCategory = await PortfolioCategory.findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, "i") },
      _id: { $ne: id },
    })

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category with this name already exists",
        },
        { status: 400 },
      )
    }

    const updatedCategory = await PortfolioCategory.findByIdAndUpdate(
      id,
      { name: body.name.trim() },
      { new: true, runValidators: true },
    )

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: "Portfolio category updated successfully",
    })
  } catch (error: unknown) {
    console.error("Error updating portfolio category:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update portfolio category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete portfolio category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params

    const deletedCategory = await PortfolioCategory.findByIdAndDelete(id)

    if (!deletedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: deletedCategory,
      message: "Portfolio category deleted successfully",
    })
  } catch (error: unknown) {
    console.error("Error deleting portfolio category:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete portfolio category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
