import config from "../config/config";
export default async function applyFabricToken() {
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
    return result;
  } catch (error) {
    console.error("Error fetching Fabric token:", error);
    return { error: error.message };
  }
}
