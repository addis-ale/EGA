import { NextResponse } from "next/server";
import applyFabricToken from "@/services/applyFabricTokenService"; // Adjust path
import config from "@/config/config"; // Adjust path
import tools from "@/utils/tools"; // Adjust path

export async function POST(req) {
  try {
    const { title, amount } = await req.json(); // Extract body data
    console.log(`Title: ${title}, Amount: ${amount}`);

    // Get Fabric Token
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token;
    console.log("fabricToken =", fabricToken);

    // Create Order
    let createOrderResult = await requestCreateOrder(
      fabricToken,
      title,
      amount
    );
    console.log(createOrderResult);

    let prepayId = createOrderResult.biz_content.prepay_id;
    let rawRequest = createRawRequest(prepayId);

    // Construct the Payment URL
    const paymentUrl = `${config.webBaseUrl}${rawRequest}&version=1.0&trade_type=Checkout`;

    return NextResponse.json({ success: true, paymentUrl });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Function to create an order request
async function requestCreateOrder(fabricToken, title, amount) {
  try {
    let reqObject = createRequestObject(title, amount);

    const response = await fetch(
      `${config.baseUrl}/payment/v1/merchant/preOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
          Authorization: fabricToken,
        },
        body: JSON.stringify(reqObject),
      }
    );

    if (!response.ok) throw new Error("Failed to create order");

    return await response.json();
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
}

// Function to create
