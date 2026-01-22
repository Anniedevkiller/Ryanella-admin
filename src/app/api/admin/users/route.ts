import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAdminActivity } from "@/lib/logger";

// GET all users (Admins or Users)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role") as any;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (role) where.role = role;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phone: true,
                    isBlocked: true,
                    createdAt: true,
                    _count: {
                        select: { orders: true }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// POST create new admin (SUPER_ADMIN only)
export async function POST(request: NextRequest) {
    const creatorRole = request.headers.get("x-user-role");
    const creatorId = request.headers.get("x-user-id");

    if (creatorRole !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden: Only SUPER_ADMIN can create admins" }, { status: 403 });
    }

    try {
        const { name, email, password, role, phone } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role as any,
                phone
            }
        });

        await logAdminActivity(creatorId!, "CREATE_ADMIN", `Created ${role}: ${email}`);

        return NextResponse.json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }
}

// PATCH update user (SUPER_ADMIN only)
export async function PATCH(request: NextRequest) {
    const updaterRole = request.headers.get("x-user-role");
    const updaterId = request.headers.get("x-user-id");

    if (updaterRole !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden: Only SUPER_ADMIN can manage administrative roles" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { userId, role, isBlocked } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updateData: any = {};
        if (role) updateData.role = role;
        if (typeof isBlocked === 'boolean') updateData.isBlocked = isBlocked;

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isBlocked: true
            }
        });

        await logAdminActivity(
            updaterId!,
            "UPDATE_ADMIN",
            `Updated admin ${user.email}: ${JSON.stringify(updateData)}`
        );

        return NextResponse.json(user);
    } catch (error) {
        console.error("Update User Error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
