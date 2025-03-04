import { KJUR, hextob64 } from "jsrsasign";
import config from "@/config/config";

// Fields not participating in signature
const excludeFields = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  "biz_content",
];

export function signRequestObject(requestObject) {
  let fields = [];
  let fieldMap = {};

  for (let key in requestObject) {
    if (!excludeFields.includes(key)) {
      fields.push(key);
      fieldMap[key] = requestObject[key];
    }
  }

  // Include fields from `biz_content`
  if (requestObject.biz_content) {
    for (let key in requestObject.biz_content) {
      if (!excludeFields.includes(key)) {
        fields.push(key);
        fieldMap[key] = requestObject.biz_content[key];
      }
    }
  }

  // Sort fields by ASCII
  fields.sort();

  let signStrList = fields.map((key) => `${key}=${fieldMap[key]}`);
  let signOriginStr = signStrList.join("&");

  console.log("signOriginStr:", signOriginStr);
  return signString(signOriginStr, config.privateKey);
}

export function signString(text, privateKey) {
  const sha256withrsa = new KJUR.crypto.Signature({
    alg: "SHA256withRSAandMGF1",
  });

  sha256withrsa.init(privateKey);
  sha256withrsa.updateString(text);
  return hextob64(sha256withrsa.sign());
}

export function createTimeStamp() {
  return Math.floor(Date.now() / 1000).toString();
}

export function createNonceStr() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 32; i++) {
    let index = Math.floor(Math.random() * chars.length);
    str += chars[index];
  }
  return str;
}
