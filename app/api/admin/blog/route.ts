import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin/auth";
import { z } from "zod";

const blogPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().nullable(),
  bodyHtml: z.string().min(5),
  category: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  try {
    const posts = await db.blogPost.findMany({
      where: {
        ...(category && category !== "All" ? { category } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
                { bodyHtml: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (e) {
    console.error("[blog GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = blogPostSchema.parse(body);

    const post = await db.blogPost.create({
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (err) {
    console.error("[blog POST]", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 422 });
    }
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

const patchSchema = blogPostSchema.partial();

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 422 });

    const data = patchSchema.parse(body);

    const existing = await db.blogPost.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let publishedAt = existing.publishedAt;
    if (data.isPublished !== undefined) {
      if (data.isPublished && !existing.isPublished) {
        publishedAt = new Date();
      } else if (!data.isPublished) {
        publishedAt = null;
      }
    }

    const post = await db.blogPost.update({
      where: { id: Number(id) },
      data: {
        ...data,
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (err) {
    console.error("[blog PATCH]", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 422 });
    }
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
