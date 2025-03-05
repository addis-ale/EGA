import { NextResponse } from "next/server";
import applyFabricToken from "@/service/applyFabricTokenService"; // Adjust path
import tools from "@/utils/tools"; // Adjust path
import config from "@/config/config"; // Adjust path

export async function POST(req) {
  try {
    const { title, amount, ContractNo } = await req.json(); // Extract request body
    console.log(
      `Title: ${title}, Amount: ${amount}, ContractNo: ${ContractNo}`
    );

    // Get Fabric Token
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token;
    console.log("fabricToken =", fabricToken);

    // Create Order
    let createOrderResult = await requestCreateOrder(
      fabricToken,
      title,
      amount,
      ContractNo
    );
    console.log(createOrderResult);

    let prepayId = createOrderResult.biz_content.prepay_id;
    let rawRequest = createRawRequest(prepayId);
    console.log("RAW_REQ_Ebsa: ", rawRequest);

    return NextResponse.json({ success: true, rawRequest });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Function to create an order request
async function requestCreateOrder(fabricToken, title, amount, ContractNo) {
  try {
    let reqObject = createRequestObject(title, amount, ContractNo);
    console.log(reqObject);

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

// Function to create request object
function createRequestObject(title, amount, ContractNo) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://node-api-muxu.onrender.com/api/v1/notify",
    trade_type: "InApp",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    payee_identifier: "220311",
    payee_identifier_type: "04",
    payee_type: "5000",
    mandate_data: {
      mctContractNo: ContractNo,
      mandateTemplateId: "103001",
      executeTime: "2023-08-04",
    },
    redirect_url: "https://216.24.57.253/api/v1/notify",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

// Genera
