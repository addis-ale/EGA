import applyFabricToken from "@/service/applyFabricTokenService";
import * as tools from "../utils/tools";
import config from "@/config/config";

export default async function applyFabricservice(req) {
  try {
    const body = await req.json();
    const appToken = body.authToken;

    console.log("token =", appToken);

    const applyFabricTokenResult = await applyFabricToken();
    const fabricToken = applyFabricTokenResult.token;

    console.log("fabricToken =", fabricToken);

    const result = await requestAuthToken(fabricToken, appToken);

    console.log("***********START RES****************");
    console.log(result);
    console.log("************END RES***************");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in authToken:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function requestAuthToken(fabricToken, appToken) {
  return new Promise((resolve, reject) => {
    const reqObject = createRequestObject(appToken);
    console.log("REQUEST_OBJECT", reqObject);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      body: JSON.stringify(reqObject),
    };

    fetch(`${config.baseUrl}/payment/v1/auth/authToken`, options)
      .then(async (response) => {
        const result = await response.json();
        console.log("result*", result);
        resolve(result);
      })
      .catch((error) => {
        console.error("Error in requestAuthToken:", error);
        reject(error);
      });
  });
}

function createRequestObject(appToken) {
  const req = {
    timestamp: tools.createTimeStamp(),
    method: "payment.authtoken",
    nonce_str: tools.createNonceStr(),
    version: "1.0",
    biz_content: {
      access_token: appToken,
      trade_type: "InApp",
      appid: config.merchantAppId,
      resource_type: "OpenId",
    },
  };

  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  return req;
}
