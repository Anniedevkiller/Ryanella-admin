import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        console.log("Login attempt for email:", email);

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log("User found:", user ? { id: user.id, email: user.email, role: user.role, isBlocked: user.isBlocked } : "NOT FOUND");

        if (!user) {
            console.log("User not found in database");
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        console.log("Comparing password...");
        const isMatch = await comparePassword(password, user.password);
        console.log("Password match:", isMatch);
        
        if (!isMatch) {
            console.log("Password mismatch");
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (user.isBlocked) {
            return NextResponse.json(
                { error: "Account restricted: Please contact a SUPER_ADMIN" },
                { status: 403 }
            );
        }

        if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
            return NextResponse.json(
                { error: "Forbidden: Access denied" },
                { status: 403 }
            );
        }

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
