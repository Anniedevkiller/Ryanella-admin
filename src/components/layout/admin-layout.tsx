"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isAuthPage = pathname === "/admin/login" ||
        pathname === "/admin/forgot-password" ||
        pathname === "/admin/reset-password";

    useEffect(() => {
        if (!isLoading && !user && !isAuthPage) {
            router.push("/admin/login");
        }
    }, [user, isLoading, router, isAuthPage]);

    // Don't show the dashboard shell for auth pages
    if (isAuthPage) {
        if (isLoading) {
            return (
                <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                </div>
            );
        }
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-cream">
                <Loader2 className="h-10 w-10 animate-spin text-gold" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-cream selection:bg-gold/30">
            <Sidebar />
            <div className="flex flex-col lg:pl-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
