import { NextResponse, type NextRequest } from "next/server";
import { isDeploymentSuspended, SUSPENDED_PATH } from "@/config/deployment";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const suspended = isDeploymentSuspended();

  if (!suspended) {
    // The suspended screen is not reachable while the site is live
    if (pathname === SUSPENDED_PATH) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service suspended", code: "DEPLOYMENT_SUSPENDED" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 503 keeps search engines from indexing the suspended screen as real content
  return NextResponse.rewrite(new URL(SUSPENDED_PATH, request.url), {
    status: 503,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo/|default/|og/).*)",
  ],
};
