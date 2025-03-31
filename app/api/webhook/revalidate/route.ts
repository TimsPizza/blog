import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Webhook Secret for authentication
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    // 验证webhook请求 (Verify webhook request)
    const body = await request.json();
    const signature = request.headers.get("x-webhook-signature");

    if (!signature || signature !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("[WEBHOOK_REVALIDATE] request body:", body);
    // 获取需要revalidate的tags (Get tags to revalidate)
    const tags = body.tags as string[];
    
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Invalid tags format" },
        { status: 400 }
      );
    }

    // Revalidate all provided tags
    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json(
      { 
        message: "Revalidation successful",
        revalidatedTags: tags
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[WEBHOOK_REVALIDATE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
