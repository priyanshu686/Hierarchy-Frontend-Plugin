import { NextResponse } from "next/server";

export async function GET() {
  // Mock test data (can be replaced with Prisma later)
  const hierarchy = [
    { user_Id: 1, prev_Id: null, next_Id: [2, 3] },
    { user_Id: 2, prev_Id: 1, next_Id: [4] },
    { user_Id: 3, prev_Id: 1, next_Id: [] },
    { user_Id: 4, prev_Id: 2, next_Id: [] }
  ];
  return NextResponse.json(hierarchy);
}
