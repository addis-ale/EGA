import { NextResponse } from "next/server";
import config from "../config/config";
export default async function POST() {
  try {
    const response = await fetch(`${config.baseUrl}/payment/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching Fabric token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
