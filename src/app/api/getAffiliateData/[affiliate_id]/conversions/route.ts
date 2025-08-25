import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: any }) {
  const { affiliate_id } = params;

  try {
    const affiliate = await prisma.click.findFirst({
      where: { affiliateId: affiliate_id },
    });

    if (!affiliate) {
      return new Response("Affiliate not found", { status: 404 });
    }

    const clickId = affiliate.clickId;

    const conversions = await prisma.conversion.findMany({
      where: { clickId: clickId },
    });

    return new Response(JSON.stringify(conversions), { status: 200 });
  } catch (error) {
    console.error("Error fetching affiliate:", error);
    return new Response("Error fetching affiliate", { status: 500 });
  }
}
