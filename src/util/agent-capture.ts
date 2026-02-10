import { headers } from "next/headers";

export async function getUserAgent() {
  const h = await headers();
  return h.get("user-agent");
}

export async function getClientIp() {
  const h = await headers();

  const xForwardedFor = h.get("x-forwarded-for");
  const xRealIp = h.get("x-real-ip");

  if (xForwardedFor) {
    // x-forwarded-for can be a comma-separated list
    return xForwardedFor.split(",")[0].trim();
  }

  if (xRealIp) {
    return xRealIp;
  }

  return "UNKNOWN";
}