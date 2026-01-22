import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // For security, don't reveal if the user exists
        if (!user) {
            return NextResponse.json({ message: "If this email is registered, you will receive a reset link shortly." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        });

        // Simulate sending email
        console.log(`[PASS_RESET] Reset link for ${email}: /admin/reset-password?token=${token}`);

        return NextResponse.json({ message: "If this email is registered, you will receive a reset link shortly." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
