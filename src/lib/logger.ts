import prisma from "./prisma";

export async function logAdminActivity(
    adminId: string,
    action: string,
    details?: string,
    ipAddress?: string
) {
    try {
        await prisma.adminActivityLog.create({
            data: {
                adminId,
                action,
                details,
                ipAddress
            }
        });
    } catch (error) {
        console.error("Failed to log admin activity:", error);
    }
}
