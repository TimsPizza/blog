import { NextResponse } from "next/server";
import { generateEmailTemplate } from "./email-template";
import { sendEmail } from "@/lib/mailgun";
import { getSubscribers } from "@/lib/newsletter";
import { siteConfig } from "@/site.config";
import { WHPostCreatedRequestBody } from "@/lib/types/revalidatehook";

// Webhook Secret for authentication
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const SITE_BASE_URL = process.env.SITE_BASE_URL;

export async function POST(request: Request) {
  try {
    // 验证webhook请求 (Verify webhook request)
    const body = (await request.json()) as WHPostCreatedRequestBody;
    const signature = request.headers.get("x-webhook-signature");

    if (!signature || signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // 获取文章链接 (Get post link)
    const suffix = body.post.post_name;
    const link = SITE_BASE_URL + "/posts/" + suffix;

    // 验证必要的文章信息 (Verify required post information)
    const { post_title, post_excerpt } = body.post;
    if (!post_title || !link) {
      return NextResponse.json(
        { message: "Missing required post information" },
        { status: 400 },
      );
    }

    // 获取活跃订阅者列表 (Get active subscribers)
    const subscribers = await getSubscribers();
    const activeSubscribers = subscribers.filter(
      (sub) => sub.status === "confirmed",
    );

    if (activeSubscribers.length === 0) {
      return NextResponse.json(
        { message: "No active subscribers" },
        { status: 200 },
      );
    }

    // 生成邮件内容 (Generate email content)
    const emailHtml = generateEmailTemplate({
      title: post_title,
      excerpt: post_excerpt,
      link: link,
      siteName: siteConfig.site_name || "Tim's Nest",
      siteUrl: siteConfig.site_domain || "http://localhost:3000",
    });

    // 发送邮件给所有活跃订阅者 (Send email to all active subscribers)
    await sendEmail({
      to: activeSubscribers.map((sub) => sub.email),
      subject: `New Post: ${post_title}`,
      html: emailHtml,
    });

    return NextResponse.json(
      {
        message: "Newsletter sent successfully",
        subscriberCount: activeSubscribers.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[WEBHOOK_NEWSLETTER_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
