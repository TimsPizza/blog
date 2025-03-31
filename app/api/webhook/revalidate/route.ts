import { WHPostCreatedRequestBody } from "@/lib/types/revalidatehook";
import { revalidateWordPressData } from "@/lib/wordpress";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Webhook Secret for authentication
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

/**
 * Generate tags that need to be revalidated
 */
function generateTagsToRevalidate(body: WHPostCreatedRequestBody): string[] {
  const tags = new Set<string>();

  // 基础tags (Base tags)
  tags.add("wordpress");
  tags.add("posts");

  // 文章相关tags (Post related tags)
  if (body.post_id) {
    tags.add(`post-${body.post_id}`);
  }

  if (body.post?.slug) {
    tags.add(`post-${body.post.slug}`);
  }

  // 分类相关tags (Category related tags)
  if (body.taxonomies?.length) {
    for (const taxonomy of body.taxonomies) {
      if (taxonomy.taxonomy === "category") {
        tags.add("categories");
        if (taxonomy.term_id) {
          tags.add(`category-${taxonomy.term_id}`);
        }
        if (taxonomy.slug) {
          tags.add(`category-${taxonomy.slug}`);
        }
      }
      // 标签相关tags (Tag related tags)
      else if (taxonomy.taxonomy === "post_tag") {
        tags.add("tags");
        if (taxonomy.term_id) {
          tags.add(`tag-${taxonomy.term_id}`);
        }
        if (taxonomy.slug) {
          tags.add(`tag-${taxonomy.slug}`);
        }
      }
    }
  }

  return Array.from(tags);
}

export async function POST(request: Request) {
  try {
    // 验证webhook请求 (Verify webhook request)
    const body = (await request.json()) as WHPostCreatedRequestBody;
    const signature = request.headers.get("x-webhook-signature");

    if (!signature || signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 获取需要revalidate的tags (Get tags to revalidate)
    const tagsToRevalidate = generateTagsToRevalidate(body);

    console.log("[WEBHOOK_REVALIDATE] Revalidating tags:", tagsToRevalidate);

    // 重新验证所有相关tags (Revalidate all related tags)
    revalidateWordPressData(tagsToRevalidate);

    return NextResponse.json(
      {
        message: "Revalidation successful",
        revalidatedTags: tagsToRevalidate,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[WEBHOOK_REVALIDATE_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
