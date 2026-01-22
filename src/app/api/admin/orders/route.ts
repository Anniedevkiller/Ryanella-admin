import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminActivity } from "@/lib/logger";

// GET all orders
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderStatus = searchParams.get("status") as any;
        const paymentStatus = searchParams.get("paymentStatus") as any;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (orderStatus) where.orderStatus = orderStatus;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    },
                    items: {
                        include: { product: true }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// PATCH update order or payment status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, orderStatus, paymentStatus } = body;

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const data: any = {};
        if (orderStatus) data.orderStatus = orderStatus;
        if (paymentStatus) data.paymentStatus = paymentStatus;

        const order = await prisma.order.update({
            where: { id: orderId },
            data,
            include: {
                user: { select: { name: true, email: true } }
            }
        });

        await logAdminActivity(
            request.headers.get("x-user-id")!,
            "UPDATE_ORDER",
            `Ref ${order.id}: ${JSON.stringify(data)}`
        );

        return NextResponse.json(order);
    } catch (error) {
        console.error("Update Order Error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
