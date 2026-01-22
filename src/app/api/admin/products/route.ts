import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAdminActivity } from "@/lib/logger";

// GET all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where = categoryId ? { categoryId } : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            description,
            priceNGN,
            categoryId,
            images,
            sizes,
            colors,
            stock,
            isActive
        } = body;

        if (!name || !priceNGN || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                priceNGN: parseFloat(priceNGN),
                priceUSD: body.priceUSD ? parseFloat(body.priceUSD) : null,
                categoryId,
                images: images || [],
                sizes: sizes || [],
                colors: colors || [],
                stock: parseInt(stock || "0"),
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        await logAdminActivity(
            request.headers.get("x-user-id")!,
            "CREATE_PRODUCT",
            `Created: ${product.name}`
        );

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
