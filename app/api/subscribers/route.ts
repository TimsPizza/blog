import { NextResponse } from "next/server";
import { createSubscriber, getSubscribers } from "@/lib/newsletter";
import { z } from "zod";

// Validation schema
const subscriberSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = subscriberSchema.parse(body);
    
    // Create new subscriber through Newsletter API
    try {
      await createSubscriber({
        email: validatedData.email,
        status: "confirmed",
      });
      
      return NextResponse.json(
        { message: "Successfully subscribed" },
        { status: 201 }
      );
    } catch (error: any) {
      // Handle case where email already exists
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { message: "Email address already subscribed" },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error("[SUBSCRIBE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 10;

    // Get subscribers from Newsletter API
    const subscribers = await getSubscribers({
      page,
      per_page,
    });
    
    return NextResponse.json({
      subscribers,
      page,
      per_page,
    });
  } catch (error) {
    console.error("[GET_SUBSCRIBERS_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
