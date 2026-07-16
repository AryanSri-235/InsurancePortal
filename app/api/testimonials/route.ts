import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, city, rating, body, category } = await req.json();

    if (!name || !body || !rating) {
      return NextResponse.json(
        { success: false, error: "Name, rating, and review text are required." },
        { status: 400 }
      );
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be a number between 1 and 5." },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        city: city || null,
        rating: ratingVal,
        body,
        category: category || "general",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (err: any) {
    console.error("Error creating testimonial:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    );
  }
}
