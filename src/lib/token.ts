import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Resource } from "sst";

const TOKEN_PATTERN = /^([A-Za-z0-9_-]{8})\.([A-Za-z0-9_-]{16})$/;

function sign(id: string) {
  return createHmac("sha256", Resource.LinkSecret.value)
    .update(id)
    .digest()
    .subarray(0, 12)
    .toString("base64url");
}

export function createToken() {
  const id = randomBytes(6).toString("base64url");
  return `${id}.${sign(id)}`;
}

export function verifyToken(token: string) {
  const match = TOKEN_PATTERN.exec(token);
  if (!match) return false;
  return timingSafeEqual(Buffer.from(sign(match[1])), Buffer.from(match[2]));
}
