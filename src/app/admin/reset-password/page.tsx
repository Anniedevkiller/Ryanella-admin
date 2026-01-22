"use client";

import { useEffect, useState } from "react";
import { Shield, Loader2, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid recovery link. Please request a new one.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        if (password.length < 8) {
            return setError("Password must be at least 8 characters.");
        }

        setIsLoading(true);
        setError("");

        try {
            await axios.post("/api/admin/auth/reset-password", { token, password });
            setIsSuccess(true);
            setTimeout(() => router.push("/admin/login"), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-6 transform -rotate-6">
                        <Shield className="h-8 w-8 text-gold" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-primary uppercase italic">Ryanella</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mt-2">Security Vault</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gold/10 shadow-2xl">
                    {!isSuccess ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Security Reset</h2>
                                <p className="text-sm text-muted-foreground font-medium">Define a new high-strength password for your account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2 relative">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="rounded-2xl border-gold/10 bg-cream/30 h-14 font-bold text-sm pr-12 focus:ring-gold/20"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Identity</Label>
                                    <Input
                                        type="password"
                                        required
                                        className="rounded-2xl border-gold/10 bg-cream/30 h-14 font-bold text-sm focus:ring-gold/20"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 text-destructive text-[11px] font-black uppercase p-4 rounded-xl border border-destructive/20">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-[11px] font-black uppercase tracking-widest text-gold shadow-xl"
                                    disabled={isLoading || !token}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize New Passport"}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="flex justify-center">
                                <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center ring-8 ring-emerald-50/50">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Security Updated</h2>
                                <p className="text-sm text-muted-foreground font-medium antialiased">
                                    Your administrative credentials have been successfully updated. Redirecting to terminal...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
