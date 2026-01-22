"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("/api/admin/auth/login", { email, password });
            const { token, user } = response.data;
            login(token, user);
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 selection:bg-gold/30">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-gold/10 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/80 animate-in fade-in zoom-in duration-700 relative z-10">
                <CardHeader className="space-y-1 pb-8 text-center bg-white/50">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl font-bold text-2xl shadow-lg border border-gold/20">
                            R
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter">
                        RYANELLA<span className="text-gold">.</span>
                    </CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                        Administrative Access Only
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">
                                Admin Email
                            </Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@ryanella.com"
                                    className="pl-10 h-12 rounded-xl border-gold/10 bg-cream/30 focus-visible:ring-gold/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">
                                    Secure Password
                                </Label>
                                <button type="button" className="text-[10px] font-bold text-gold uppercase hover:underline">
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 h-12 rounded-xl border-gold/10 bg-cream/30 focus-visible:ring-gold/50 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-gold transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold text-center animate-in shake duration-500">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl hover:shadow-gold/20"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authorize Access"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="pb-8 pt-4 px-8 text-center block">
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1">
                        <Lock size={10} /> Protected by Ryanella Identity Service
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
