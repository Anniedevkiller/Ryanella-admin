import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!resetToken || resetToken.isUsed || resetToken.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and mark token as used in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword }
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { isUsed: true }
            })
        ]);

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
