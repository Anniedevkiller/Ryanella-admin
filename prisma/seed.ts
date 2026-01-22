import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Ryanella database...");

    // Create Super Admin
    const superAdminEmail = "erisannieannie@gmail.com";
    const hashedPassword = await bcrypt.hash("SuperSecure123!", 10);

    const superAdmin = await prisma.user.upsert({
        where: { email: superAdminEmail },
        update: {
            role: "SUPER_ADMIN",
            password: hashedPassword,
        },
        create: {
            email: superAdminEmail,
            name: "Eris Annie",
            password: hashedPassword,
            role: "SUPER_ADMIN",
        },
    });

    console.log(`SUPER_ADMIN created/updated: ${superAdmin.email}`);

    // Create some default categories
    const categories = ["Apparel", "Accessories", "Jewelry", "Bags"];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.toLowerCase() },
            update: {},
            create: {
                name: cat,
                slug: cat.toLowerCase(),
            },
        });
    }

    console.log("Categories seeded successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
