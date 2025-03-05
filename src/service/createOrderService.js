import applyFabricToken from "@/service/applyFabricTokenService"; // Adjust path
import config from "@/config/config"; // Adjust path
import * as tools from "../utils/tools";

export default async function createOrder({
  title,
  amount,
  cartId,
  authToken,
}) {
  try {
    console.log(`Title: ${title}, Amount: ${amount}, Auth Token: ${authToken}`);

    // Step 1: Get Fabric Token
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token; // Get fabric token
    console.log("fabricToken =", fabricToken);

    // Step 2: Create Order
    let createOrderResult = await requestCreateOrder(
      fabricToken,
      authToken,
      title,
      amount,
      cartId
    ); // Pass authToken
    console.log("Order creation result:", createOrderResult);

    let prepayId = createOrderResult.biz_content.prepay_id;
    let rawRequest = createRawRequest(prepayId); // Prepare the payment request

    // Step 3: Construct the Payment URL
    const paymentUrl = `${config.webBaseUrl}${rawRequest}&version=1.0&trade_type=Checkout`;

    // Return success response with the payment URL
    return { success: true, paymentUrl };
  } catch (error) {
    console.error("Error creating order:", error.message);
  }
}

// Function to send the API request to create an order
async function requestCreateOrder(
  fabricToken,
  authToken,
  title,
  amount,
  cartId
) {
  try {
    let reqObject = createRequestObject(title, amount, cartId, authToken); // Include authToken in the request body

    const response = await fetch(
      `${config.baseUrl}/payment/v1/merchant/preOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId,
          Authorization: fabricToken, // Send the fabric token in the request headers
        },
        body: JSON.stringify(reqObject), // Pass the request body
      }
    );

    if (!response.ok) throw new Error("Failed to create request object");
    const data = await response.json();
    return data; // Return the order response
  } catch (error) {
    console.error("Request error:", error);
    throw error; // Re-throw error to be handled in the outer catch block
  }
}

// Function to create the order request object
function createRequestObject(title, amount, cartId, authToken) {
  let req = {
    timestamp: tools.createTimeStamp(), // Current timestamp
    method: "payment.preorder", // API method
    nonce_str: tools.createNonceStr(), // Generate random nonce string
    version: "1.0", // API version
  };

  let biz = {
    notify_url: "https://localhost:3000/api/paymentStatus",
    merch_code: config.merchantCode,
    title: title,
    merch_order_id: createMerchantOrderId(),
    appid: config.merchantAppId,
    trade_type: "Checkout", // Assuming in-app payment
    access_token: authToken, // Pass the authToken here.
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    payee_identifier: config.merchantCode,
    // payee_identifier:{{payeeConsumerMsisdn}},
    payee_identifier_type: "04",
    payee_type: "5000",
    redirect_url: "https://localhost:3000/orderPage",
    callback_info: "From web",
    cart_id: cartId,
  };

  req.biz_content = biz;
  req.sign = "generated-signature"; // Assuming you have a method to generate the signature
  req.sign_type = "SHA256WithRSA"; // Example signing method

  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}
function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}
