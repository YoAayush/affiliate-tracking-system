import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { affiliate_id: string } }
) {
  const { affiliate_id } = context.params;

  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliate_id },
    });
    if (!affiliate) {
      return NextResponse.json(
        { error: "Affiliate not found" },
        { status: 404 }
      );
    }

    const clicks = await prisma.click.findMany({
      where: { affiliateId: affiliate_id },
      include: { campaign: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clicks, { status: 200 });
  } catch (error) {
    console.error("Error fetching clicks:", error);
    return new Response("Error fetching clicks", { status: 500 });
  }
}
