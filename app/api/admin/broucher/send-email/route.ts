import { NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import EmailSMTP from "../../../../../config/utils/admin/smtp/emailSMTPSchema";
import { createSMTPTransporter } from "@/config/models/connectSMTP";
import Broucher from "@/config/utils/admin/broucher/broucherSchema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config/utils/cloudinary";


export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, fullName } = await request.json();

    console.log("Processing brochure email request for:", email);

    // Get SMTP configuration
    const smtpConfig = await EmailSMTP.findOne({
      id: "default",
      isActive: true,
    });

    if (!smtpConfig) {
      console.error("SMTP configuration not found");
      return NextResponse.json(
        { error: "SMTP configuration not found" },
        { status: 500 }
      );
    }

    // Get all brochures
    const brochures = await Broucher.find().sort({ uploadDate: -1 });

    if (!brochures || brochures.length === 0) {
      console.error("No brochures available");
      return NextResponse.json(
        { error: "No brochures available" },
        { status: 404 }
      );
    }

    console.log(`Found ${brochures.length} brochures to attach`);

    // Create transporter
    const transporter = createSMTPTransporter(smtpConfig);

    // Process attachments with improved error handling and Cloudinary support
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
    
    for (const brochure of brochures) {
      try {
        console.log(`Processing brochure: ${brochure.fileName} from URL: ${brochure.filePath}`);
        
        // Check if it's a Cloudinary URL and modify if needed
        let fetchUrl = brochure.filePath;
        
        // For Cloudinary URLs, ensure they're publicly accessible
        if (fetchUrl.includes('cloudinary.com')) {
          // Remove any authentication parameters and ensure public access
          fetchUrl = fetchUrl.split('?')[0]; // Remove query parameters
          
          // If it's a Cloudinary URL, try to make it public
          if (fetchUrl.includes('/upload/')) {
            fetchUrl = fetchUrl.replace('/upload/', '/upload/fl_attachment/');
          }
        }
        
        console.log(`Fetching from modified URL: ${fetchUrl}`);
        
        // Try multiple fetch strategies
        let response = null;
        let buffer = null;
        
        // Use our download API to fetch the file
        try {
          response = await fetch(`${process.env.APP_URL}/api/admin/broucher/download?id=${brochure._id}`, {
            method: 'GET',
          });
          
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
          } else {
            console.log(`Failed to fetch ${brochure.fileName} using download API:`, response.status);
          }
        } catch (error) {
          console.log(`Download API fetch failed for ${brochure.fileName}:`, 
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
        
        // Check if we successfully got the file
        if (!buffer || buffer.length === 0) {
          console.error(`Failed to fetch ${brochure.fileName}: No valid response received`);
          continue;
        }
        
        // Validate PDF header (should start with %PDF)
        const pdfHeader = buffer.toString('ascii', 0, 4);
        if (pdfHeader !== '%PDF') {
          console.error(`Invalid PDF file ${brochure.fileName}: Header is ${pdfHeader}`);
          continue;
        }

        // Add to attachments
        attachments.push({
          filename: brochure.fileName,
          content: buffer,
          contentType: 'application/pdf'
        });

        console.log(`✅ Successfully processed attachment: ${brochure.fileName} (${buffer.length} bytes)`);
        
      } catch (error) {
        console.error(`❌ Error processing brochure ${brochure.fileName}:`, error);
        // Continue with other brochures even if one fails
        continue;
      }
    }

    // Prepare brochure list for email display
    const brochureList = brochures
      .map((brochure, index) => {
        const isAttached = attachments.some(att => att.filename === brochure.fileName);
        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 15px; color: #4a5568;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 500;">${brochure.fileName}</span>
              ${isAttached 
                ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">ATTACHED</span>'
                : `<a href="${process.env.APP_URL}/api/admin/broucher/download?id=${brochure._id}" target="_blank" style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-decoration: none;">DOWNLOAD</a>`
              }
            </div>
          </td>
        </tr>`;
      })
      .join("");

    // Enhanced email HTML template
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Requested Brochures - Filigree Solutions</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white;">
            <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700;">Thank You!</h1>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your requested brochures from Filigree Solutions</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 30px;">
              <h2 style="color: #2d3748; font-size: 24px; margin-bottom: 15px;">Dear ${fullName},</h2>
              
              <p style="color: #4a5568; line-height: 1.7; font-size: 16px; margin-bottom: 25px;">
                Thank you for your interest in <strong>Filigree Solutions</strong>! We're excited to share our comprehensive brochures with you.
              </p>
            </div>

            <!-- Brochures Section -->
            <div style="background: linear-gradient(to right, #f7fafc, #edf2f7); padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2d3748; margin-bottom: 20px; font-size: 20px; display: flex; align-items: center;">
                📄 Your Brochures
              </h3>
              
              <p style="color: #4a5568; margin-bottom: 20px; font-size: 14px;">
                ${attachments.length > 0 
                  ? `We've attached ${attachments.length} brochure${attachments.length > 1 ? 's' : ''} to this email. Additional brochures can be downloaded using the links below.`
                  : 'Please use the download links below to access your brochures:'
                }
              </p>
              
              <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                  <tr style="background: #667eea;">
                    <th style="padding: 15px; text-align: left; color: white; font-weight: 600;">Brochure Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${brochureList}
                </tbody>
              </table>
            </div>

            <!-- Additional Information -->
            <div style="background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h4 style="color: #234e52; margin: 0 0 10px 0; font-size: 16px;">📋 What's Next?</h4>
              <ul style="color: #2d3748; margin: 10px 0; padding-left: 20px; line-height: 1.6;">
                <li>Review our comprehensive service offerings</li>
                <li>Contact us for personalized consultation</li>
                <li>Get a free quote for your project</li>
              </ul>
            </div>

            <!-- Contact Information -->
            <div style="margin-top: 40px; padding: 25px; background: #f7fafc; border-radius: 12px; text-align: center;">
              <h4 style="color: #2d3748; margin-bottom: 15px; font-size: 18px;">Need More Information?</h4>
              <p style="color: #4a5568; margin-bottom: 20px;">Our team is ready to help you with any questions!</p>
              
              <div style="display: inline-flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                <a href="tel:+919158549166" style="background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
                  📞 Call Us
                </a>
                <a href="mailto:info@filigreesolutions.com" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #2d3748; color: #a0aec0; padding: 30px; text-align: center;">
            <div style="margin-bottom: 15px;">
              <h3 style="color: white; margin: 0 0 5px 0; font-size: 20px;">Filigree Solutions</h3>
              <p style="margin: 0; font-size: 14px;">Your Partner in Digital Excellence</p>
            </div>
            
            <div style="border-top: 1px solid #4a5568; padding-top: 20px; margin-top: 20px;">
              <p style="margin: 5px 0; font-size: 13px;">
                📧 info@filigreesolutions.com | 📱 +91 9158549166
              </p>
              <p style="margin: 5px 0; font-size: 13px;">
                📍 88/153, East Street, Pandiyan Nagar, South Madurai, Madurai-625006
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} Filigree Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Prepare mail options
    const mailOptions = {
      from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
      to: email,
      subject: `Your Brochures are Ready! - ${smtpConfig.fromName}`,
      html: emailHTML,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    console.log(`Sending email with ${attachments.length} attachments to ${email}`);

    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully:", result.messageId);

    return NextResponse.json({ 
      success: true, 
      message: `Brochures sent successfully! ${attachments.length} file${attachments.length !== 1 ? 's' : ''} attached.`,
      attachedCount: attachments.length,
      totalCount: brochures.length,
      messageId: result.messageId
    });

  } catch (error) {
    console.error("Error sending brochure email:", error);
    return NextResponse.json(
      { 
        error: "Failed to send brochures",
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}