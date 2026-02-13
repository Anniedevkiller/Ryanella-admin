const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'erisannieannie@gmail.com';
    const hashedPassword = await bcrypt.hash('Admin@123', 10); // Default password, should be changed on first login

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'SUPER_ADMIN',
            password: hashedPassword, // Update password to ensure it's correct
        },
        create: {
            email,
            name: 'Super Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
