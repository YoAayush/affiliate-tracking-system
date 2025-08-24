import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const affiliateId = searchParams.get("affiliate_id");
  const clickId = searchParams.get("click_id");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency") || "USD";

  if (!affiliateId || !clickId) {
    return NextResponse.json(
      {
        error: "Missing required query parameters: affiliate_id or click_id",
      },
      { status: 400 }
    );
  }

  const click = await prisma.click.findUnique({
    where: { clickId: clickId },
    include: {
      affiliate: true,
      campaign: true,
    },
  });

  if (!click) {
    return NextResponse.json(
      {
        error: "Click not found",
      },
      { status: 404 }
    );
  }

  try {
    const conversion = await prisma.conversion.create({
      data: {
        clickId: click.clickId,
        amount: amount ? parseFloat(amount) : null,
        currency,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Conversion tracked successfully",
      data: {
        conversion,
        affiliate: click.affiliate,
        campaign: click.campaign,
      },
    });
  } catch (error) {
    console.error("Error fetching postback:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
