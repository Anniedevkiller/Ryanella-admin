import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth-utils";

export function middleware(request: NextRequest) {
    // Only intercept /api/admin/* routes
    if (request.nextUrl.pathname.startsWith("/api/admin")) {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const payload: any = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Role-based access control
        const allowedRoles = ["ADMIN", "SUPER_ADMIN"];
        if (!allowedRoles.includes(payload.role)) {
            return NextResponse.json(
                { error: "Forbidden: Insufficient permissions" },
                { status: 403 }
            );
        }

        // Pass the payload (user info) to the next handler via headers if needed
        // or just allow the request to proceed.
        const response = NextResponse.next();
        response.headers.set("x-user-id", payload.id);
        response.headers.set("x-user-role", payload.role);

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/admin/:path*",
};
