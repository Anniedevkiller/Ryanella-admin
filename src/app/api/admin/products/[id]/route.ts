import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

// PATCH update product
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Convert numbers if present
        if (body.priceNGN) body.priceNGN = parseFloat(body.priceNGN);
        if (body.priceUSD) body.priceUSD = parseFloat(body.priceUSD);
        if (body.stock !== undefined) body.stock = parseInt(body.stock);

        const product = await prisma.product.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
