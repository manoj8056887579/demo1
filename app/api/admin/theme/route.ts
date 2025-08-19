import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Theme from "@/config/utils/admin/theme/themeSchema";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// GET - Fetch theme settings
export async function GET() {
  try {
    await connectDB();

    // The auto-seeding will happen automatically when the schema is loaded
    const theme = await Theme.findOne({ isActive: true }).lean();

    if (!theme) {
      return NextResponse.json(
        {
          success: false,
          message: "No active theme found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: theme,
        message: "Theme settings fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching theme settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch theme settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to delete old file
async function deleteOldFile(filePath: string | null): Promise<void> {
  if (!filePath) return;
  
  try {
    // Convert URL path to file system path
    const fileName = path.basename(filePath);
    const fullPath = path.join(process.cwd(), 'public', 'admin', 'logo', fileName);
    
    // Check if file exists and delete it
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      console.log(`✅ Deleted old file: ${fileName}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting old file ${filePath}:`, error);
    // Don't throw error - file deletion failure shouldn't stop the update
  }
}

// Helper function to save base64 image to file
async function saveImageToFile(base64Data: string, fileName: string, type: 'logo' | 'favicon'): Promise<string> {
  try {
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'admin', 'logo');
    await mkdir(uploadDir, { recursive: true });

    // Extract base64 data and convert to buffer
    const base64Image = base64Data.split(';base64,').pop();
    if (!base64Image) {
      throw new Error('Invalid base64 data');
    }

    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = type === 'favicon' ? '.ico' : '.png';
    const uniqueFileName = `${type}-${timestamp}${extension}`;
    
    // Save file
    const filePath = path.join(uploadDir, uniqueFileName);
    await writeFile(filePath, imageBuffer);
    
    // Return public URL path
    return `/admin/logo/${uniqueFileName}`;
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
    throw new Error(`Failed to save ${type} file`);
  }
}

// PUT - Update theme settings
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      siteName, 
      logo, 
      favicon, 
      primaryColor, 
      secondaryColor, 
      gradientDirection 
    } = body;

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (primaryColor && !hexColorRegex.test(primaryColor)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid primary color format. Use hex format like #2563eb",
        },
        { status: 400 }
      );
    }

    if (secondaryColor && !hexColorRegex.test(secondaryColor)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid secondary color format. Use hex format like #9333ea",
        },
        { status: 400 }
      );
    }

    // Get current theme data to access old file paths
    const currentTheme = await Theme.findOne({ id: "default" });

    let logoPath = logo;
    let faviconPath = favicon;

    // Handle logo upload if it's base64 data
    if (logo && logo.startsWith('data:image/')) {
      // Delete old logo file if it exists
      if (currentTheme?.logo) {
        await deleteOldFile(currentTheme.logo);
      }
      logoPath = await saveImageToFile(logo, 'logo', 'logo');
    }

    // Handle favicon upload if it's base64 data
    if (favicon && favicon.startsWith('data:image/')) {
      // Delete old favicon file if it exists
      if (currentTheme?.favicon) {
        await deleteOldFile(currentTheme.favicon);
      }
      faviconPath = await saveImageToFile(favicon, 'favicon', 'favicon');
    }

    // Find and update the theme settings
    const updatedTheme = await Theme.findOneAndUpdate(
      { id: "default" },
      {
        ...(siteName && { siteName }),
        ...(logoPath !== undefined && { logo: logoPath }),
        ...(faviconPath !== undefined && { favicon: faviconPath }),
        ...(primaryColor && { primaryColor }),
        ...(secondaryColor && { secondaryColor }),
        ...(gradientDirection && { gradientDirection }),
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        data: updatedTheme,
        message: "Theme settings updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating theme settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update theme settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Reset theme to default
export async function POST() {
  try {
    await connectDB();

    // Get current theme data to clean up old files
    const currentTheme = await Theme.findOne({ id: "default" });

    // Delete old logo and favicon files if they exist
    if (currentTheme?.logo) {
      await deleteOldFile(currentTheme.logo);
    }
    if (currentTheme?.favicon) {
      await deleteOldFile(currentTheme.favicon);
    }

    const defaultTheme = {
      id: "default",
      siteName: "Filigree Solutions",
      logo: null,
      favicon: null,
      primaryColor: "#2563eb",
      secondaryColor: "#9333ea",
      gradientDirection: "135deg",
      isActive: true,
      lastUpdated: new Date()
    };

    const resetTheme = await Theme.findOneAndUpdate(
      { id: "default" },
      defaultTheme,
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        data: resetTheme,
        message: "Theme settings reset to default successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting theme settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset theme settings",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}