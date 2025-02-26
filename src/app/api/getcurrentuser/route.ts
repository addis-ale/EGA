import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({
      message: "current user not founct",
    });
  }
  return NextResponse.json({
    user,
  });
}
