import { NextResponse } from "next/server";
import authToken from "./service/authTokenService";
export async function POST(req: Request, res: Response) {
  authToken.authToken(req, res);
}
EG-Store\src\app\api\service\authTokenService.js 