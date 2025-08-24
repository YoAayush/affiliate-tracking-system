import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { affiliateName } = body;

  if (!affiliateName) {
    return NextResponse.json(
      { error: "Missing affiliate name" },
      { status: 400 }
    );
  }

  try {
    const affiliate = await prisma.affiliate.create({
      data: {
        name: affiliateName,
      },
    });
    return NextResponse.json(affiliate, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const affiliates = await prisma.affiliate.findMany();
    return NextResponse.json(affiliates);
  } catch (error) {
    console.error("Error fetching affiliate data:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate data" },
      { status: 500 }
    );
  }
}
