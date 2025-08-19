import { NextResponse } from "next/server"
import connectDB from "../../../../config/models/connectDB"
import Admin from "../../../../config/utils/admin/login/loginSchema"
import jwt from "jsonwebtoken"
import { unlink, rmdir, writeFile } from "fs/promises"
import path from "path"
import { existsSync, mkdirSync } from "fs"

interface DecodedToken {
  adminId: string
  email: string
  role: string
}

// Helper function to ensure directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
}

// Helper function to delete old avatar
async function deleteOldAvatar(avatarPath: string) {
  try {
    if (existsSync(avatarPath) && !avatarPath.includes('placeholder')) {
      await unlink(avatarPath)
      console.log('Old avatar deleted successfully')
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error)
  }
}

// Get admin profile
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured")
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken

    await connectDB()

    // Find admin and exclude sensitive fields
    const admin = await Admin.findById(decoded.adminId)
      .select("-password -resetPasswordToken -resetPasswordExpires")

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        avatar: admin.avatar,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update admin profile
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured")
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken

    // Parse form data
    const formData = await request.formData()
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string
    const location = formData.get("location") as string
    const avatarFile = formData.get("avatar") as File | null

    await connectDB()

    // Find admin
    const admin = await Admin.findById(decoded.adminId)

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Handle avatar upload if provided
    let avatarPath = admin.avatar // Keep existing avatar path by default
    if (avatarFile) {
      const profileDir = path.join(process.cwd(), "public", "admin", "profile")
      ensureDirectoryExists(profileDir)

      // Generate unique filename using timestamp and original extension
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = path.join(profileDir, fileName)

      // Delete old avatar if exists
      if (admin.avatar) {
        const oldAvatarPath = path.join(process.cwd(), "public", admin.avatar)
        await deleteOldAvatar(oldAvatarPath)
      }

      // Write new avatar file
      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      await writeFile(filePath, buffer)

      // Update avatar path in database (store relative path)
      avatarPath = `/admin/profile/${fileName}`
    }

    // Update admin data
    admin.firstName = firstName || admin.firstName
    admin.lastName = lastName || admin.lastName
    admin.phone = phone || admin.phone
    admin.location = location || admin.location
    admin.avatar = avatarPath

    await admin.save()

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        avatar: admin.avatar,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
