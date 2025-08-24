import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { campaignName } = body;

  if (!campaignName) {
    return NextResponse.json(
      { error: "Missing campaign name" },
      { status: 400 }
    );
  }

  try {
    const campaign = await prisma.campaign.create({
      data: {
        name: campaignName,
      },
    });
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
