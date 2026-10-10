// Deployment billing state.
//
// DEPLOYMENT_PAID_UNTIL  last paid day, "YYYY-MM-DD". The site goes down
//                        automatically once that day is over (Kigali time).
// SITE_STATUS            set to "DOWN" to take the site down immediately,
//                        regardless of the date.
// NEXT_PUBLIC_BILLING_CONTACT_EMAIL  shown on the suspended screen.

const KIGALI_UTC_OFFSET = "+02:00";
const DAY_MS = 24 * 60 * 60 * 1000;

export const PAID_UNTIL = process.env.DEPLOYMENT_PAID_UNTIL?.trim() || null;
export const BILLING_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_BILLING_CONTACT_EMAIL?.trim() || null;

export const SUSPENDED_PATH = "/suspended";

/** First instant at which the deployment is no longer paid for. */
export function getSuspensionStart(): Date | null {
  if (!PAID_UNTIL || !/^\d{4}-\d{2}-\d{2}$/.test(PAID_UNTIL)) return null;
  const startOfPaidDay = new Date(`${PAID_UNTIL}T00:00:00${KIGALI_UTC_OFFSET}`);
  if (Number.isNaN(startOfPaidDay.getTime())) return null;
  return new Date(startOfPaidDay.getTime() + DAY_MS);
}

export function isDeploymentSuspended(now: Date = new Date()): boolean {
  if (process.env.SITE_STATUS?.trim().toUpperCase() === "DOWN") return true;
  const suspensionStart = getSuspensionStart();
  return suspensionStart !== null && now >= suspensionStart;
}

/** "2026-10-31" -> "31 October 2026" */
export function formatPaidUntil(): string | null {
  if (!getSuspensionStart() || !PAID_UNTIL) return null;
  return new Date(`${PAID_UNTIL}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
