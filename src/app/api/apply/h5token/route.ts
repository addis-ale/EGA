import { NextResponse } from "next/server";
import authToken from "src/service/authTokenService";
export async function POST(req: Request) {
  try {
    const result = await authToken(req);
    if (!result) {
      return NextResponse.json({
        msg: "error on from apply/h5token",
      });
    }
    return NextResponse.json({
      msg: "return auth",
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "error" + error,
    });
  }
}
