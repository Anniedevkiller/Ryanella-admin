import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [
            totalRevenue,
            totalOrders,
            totalUsers,
            totalProducts,
            recentOrders
        ] = await Promise.all([
            prisma.order.aggregate({
                where: { paymentStatus: "PAID" },
                _sum: { totalAmount: true }
            }),
            prisma.order.count(),
            prisma.user.count({ where: { role: "USER" } }),
            prisma.product.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true } }
                }
            })
        ]);

        return NextResponse.json({
            summary: {
                revenue: totalRevenue._sum.totalAmount || 0,
                orders: totalOrders,
                customers: totalUsers,
                products: totalProducts,
            },
            recentOrders
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
