import { NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Broucher from "@/config/utils/admin/broucher/broucherSchema";
import cloudinary from "@/config/utils/cloudinary";

export async function GET(req: Request) {
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

    try {
      // Get the public ID and generate a signed URL with proper options
      const timestamp = Math.round(new Date().getTime() / 1000);
      const publicId = broucher.publicId;
      
      // Generate the signature
      const signature = cloudinary.utils.api_sign_request({
        public_id: publicId,
        timestamp: timestamp,
        resource_type: 'raw'
      }, process.env.CLOUDINARY_API_SECRET || '');

      // Construct the signed URL
      const signedUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${broucher.publicId}?timestamp=${timestamp}&signature=${signature}`;

    // Fetch the file from Cloudinary
    const response = await fetch(signedUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch file from Cloudinary');
    }

    // Get the file content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the file as a download
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(broucher.fileName)}"`,
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length.toString()
      }
    });

  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate download link",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
  // Close the outer try block
} catch (error) {
  console.error("Download Error:", error);
  return NextResponse.json({ 
    error: "Failed to generate download link",
    details: error instanceof Error ? error.message : "Unknown error"
  }, { status: 500 });
}
}
