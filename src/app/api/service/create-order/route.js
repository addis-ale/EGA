import { NextResponse } from "next/server";
import applyFabricToken from "@/service/applyFabricTokenService"; // Adjust path
// import config from "@/config"; // Adjust path
import tools from "@/utils/tools"; // Adjust path
import request from "request";
import config from "../../../../config/config";
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
  return new Promise((resolve, reject) => {
    let reqObject = createRequestObject(title, amount);

    var options = {
      method: "POST",
      url: `${config.baseUrl}/payment/v1/merchant/preOrder`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      body: JSON.stringify(reqObject),
    };

    request(options, (error, response) => {
      if (error) {
        console.error("Request error:", error);
        reject(error);
      }
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

// Function to create request object
function createRequestObject(title, amount) {
  return {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
    biz_content: {
      notify_url: "https://localhost:3000/api/updatestatus",
      appid: config.merchantAppId,
      merch_code: config.merchantCode,
      merch_order_id: createMerchantOrderId(),
      trade_type: "Checkout",
      title,
      total_amount: amount,
      trans_currency: "ETB",
      timeout_express: "120m",
      business_type: "BuyGoods",
      payee_identifier: config.merchantCode,
      payee_identifier_type: "04",
      payee_type: "5000",
      redirect_url: "https://localhost:3000/order",
      callback_info: "From web",
    },
    sign: tools.signRequestObject({
      title,
      amount,
    }),
    sign_type: "SHA256WithRSA",
  };
}

// Generate unique order ID
function createMerchantOrderId() {
  return new Date().getTime().toString();
}

// Create the raw request URL
function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };

  let sign = tools.signRequestObject(map);
  return `appid=${map.appid}&merch_code=${map.merch_code}&nonce_str=${map.nonce_str}&prepay_id=${map.prepay_id}&timestamp=${map.timestamp}&sign=${sign}&sign_type=SHA256WithRSA`;
}
