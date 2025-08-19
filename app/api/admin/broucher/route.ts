import { NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Broucher from "@/config/utils/admin/broucher/broucherSchema";
import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET all brochures
export async function GET() {
  try {
    await connectDB();
    const brochures = await Broucher.find().sort({ uploadDate: -1 });
    return NextResponse.json({ brochures });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch brochures" }, { status: 500 });
  }
}

// POST - Add new brochure
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "broucher");
    const filePath = path.join(uploadDir, fileName);

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file to disk
    await writeFile(filePath, buffer);

    // Save to database
    const newBroucher = new Broucher({
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for title
      fileName,
      filePath: `/broucher/${fileName}`,
    });

    await newBroucher.save();
    return NextResponse.json({ 
      message: "Brochure uploaded successfully", 
      broucher: newBroucher 
    });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ 
      error: "Failed to upload brochure", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// DELETE - Remove brochure
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Brochure ID is required" }, { status: 400 });
    }

    await connectDB();
    const broucher = await Broucher.findById(id);

    if (!broucher) {
      return NextResponse.json({ error: "Brochure not found" }, { status: 404 });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), "public", broucher.filePath);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await Broucher.findByIdAndDelete(id);
    return NextResponse.json({ message: "Brochure deleted successfully" });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete brochure" }, { status: 500 });
  }
}

// PUT - Update brochure
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Brochure ID is required" }, { status: 400 });
    }

    await connectDB();
    const data = await req.formData();
    const file = data.get("file") as File | null;

    const broucher = await Broucher.findById(id);
    if (!broucher) {
      return NextResponse.json({ error: "Brochure not found" }, { status: 404 });
    }

    // Update file if provided
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Only PDF files are allowed" },
          { status: 400 }
        );
      }

      // Delete old file
      const oldFilePath = path.join(process.cwd(), "public", broucher.filePath);
      if (existsSync(oldFilePath)) {
        try {
          await unlink(oldFilePath);
        } catch (fileError) {
          console.error("Error deleting old file:", fileError);
        }
      }

      // Save new file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "public", "broucher");
      const filePath = path.join(uploadDir, fileName);

      // Ensure upload directory exists
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      await writeFile(filePath, buffer);

      broucher.title = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension for title
      broucher.fileName = fileName;
      broucher.filePath = `/broucher/${fileName}`;
    }

    await broucher.save();
    return NextResponse.json({ 
      message: "Brochure updated successfully", 
      broucher 
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update brochure" }, { status: 500 });
  }
}