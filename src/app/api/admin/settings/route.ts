import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

// Mock settings data - in production, store in database
let platformSettings = {
  siteName: "LMS Platform",
  siteDescription: "Learning Management System",
  siteUrl: "https://lms-platform.com",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  maxUploadSize: 100,
  defaultCurrency: "USD",
  timezone: "UTC",
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and is an admin
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // In production, fetch from database
    // const settings = await db.settings.findFirst()
    
    return NextResponse.json(platformSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and is an admin
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    // Update settings
    platformSettings = {
      ...platformSettings,
      ...body,
    }

    // In production, save to database
    // await db.settings.upsert({
    //   where: { id: 'default' },
    //   update: platformSettings,
    //   create: { id: 'default', ...platformSettings }
    // })

    return NextResponse.json({ 
      success: true, 
      settings: platformSettings 
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
