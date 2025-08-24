import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const affiliateId = searchParams.get("affiliate_id");
  const campaignId = searchParams.get("campaign_id");
  const clickId = searchParams.get("click_id") || nanoid();

  if (!affiliateId || !campaignId) {
    return NextResponse.json(
      {
        error: "Missing required query parameters: affiliate_id or campaign_id",
      },
      { status: 400 }
    );
  }

  const affiliateCheck = await prisma.affiliate.findUnique({
    where: {
      id: affiliateId,
    },
  });

  if (!affiliateCheck) {
    return NextResponse.json(
      {
        error: "Affiliate not found",
      },
      { status: 404 }
    );
  }

  const campaignCheck = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaignCheck) {
    return NextResponse.json(
      {
        error: "Campaign not found",
      },
      { status: 404 }
    );
  }

  try {
    const click = await prisma.click.create({
      data: {
        affiliateId,
        campaignId,
        clickId,
      },
    });
    return NextResponse.json(click, { status: 201 });
  } catch (error) {
    console.error("Error creating click:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
