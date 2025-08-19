import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Contact from "@/config/utils/admin/contact/ContactSchema";

// GET - Fetch contact information
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get the contact information (there should only be one record)
    let contactInfo = await Contact.findOne();
    
    // If no contact info exists, create default data
    if (!contactInfo) {
      const defaultContactInfo = {
        phone: "9158549166",
        email: "info@filigreesolutions.com",
        address: "88/153, East Street, Pandiyan Nagar",
        city: "South Madurai",
        state: "Tamil Nadu",
        pincode: "625006", 
        country: "India",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        youtube: "",
        whatsapp: "",
        telegram: "",
        github: "",
        behance: "",
        dribbble: "",
        mapEmbedCode: "",
        pageTitle: "Let's Discuss Your Engineering Needs",
        pageDescription: "Ready to transform your engineering challenges into innovative solutions? Contact our expert team today and start your journey to excellence.",
        officeTitle: "Visit Our Office in Madurai, Tamil Nadu",
        officeDescription: "Located in the heart of Madurai, our office is easily accessible and welcoming to all our clients",

      };
      
      contactInfo = new Contact(defaultContactInfo);
      await contactInfo.save();
    }
    
    return NextResponse.json({
      success: true,
      data: contactInfo,
      message: "Contact information fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching contact information:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch contact information",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create or update contact information
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['phone', 'email', 'address', 'city', 'state', 'pincode', 'country', 'pageTitle', 'pageDescription', 'officeTitle', 'officeDescription'];
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
    
    // Check if contact info already exists
    let contactInfo = await Contact.findOne();
    
    if (contactInfo) {
      // Update existing contact info
      Object.assign(contactInfo, body);
      await contactInfo.save();
    } else {
      // Create new contact info
      contactInfo = new Contact(body);
      await contactInfo.save();
    }
    
    return NextResponse.json({
      success: true,
      data: contactInfo,
      message: "Contact information saved successfully",
    });
  } catch (error: unknown) {
    console.error("Error saving contact information:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save contact information",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT - Update contact information
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['phone', 'email', 'address', 'city', 'state', 'pincode', 'country', 'pageTitle', 'pageDescription', 'officeTitle', 'officeDescription'];
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
    
    // Find and update the contact info (there should only be one record)
    const contactInfo = await Contact.findOneAndUpdate(
      {},
      body,
      { new: true, upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      data: contactInfo,
      message: "Contact information updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating contact information:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update contact information",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}