import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminActivity } from "@/lib/logger";

// GET all coupons
export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
    }
}

// POST create coupon
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, discountType, discountValue, expiresAt, isActive } = body;

        if (!code || !discountType || !discountValue || !expiresAt) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue: parseFloat(discountValue),
                expiresAt: new Date(expiresAt),
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        await logAdminActivity(
            request.headers.get("x-user-id")!,
            "CREATE_COUPON",
            `Created: ${coupon.code}`
        );

        return NextResponse.json(coupon, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
        }
        console.error("Create Coupon Error:", error);
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}

// DELETE coupon
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
        }

        await prisma.coupon.delete({
            where: { id },
        });

        await logAdminActivity(
            request.headers.get("x-user-id")!,
            "DELETE_COUPON",
            `ID: ${id}`
        );

        return NextResponse.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}
