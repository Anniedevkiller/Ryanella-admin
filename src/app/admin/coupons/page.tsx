"use client";

import { useEffect, useState } from "react";
import { Plus, Ticket, Calendar, TrendingUp, MoreHorizontal, Settings, Copy, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        expiresAt: "",
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/admin/coupons");
            setCoupons(response.data || []);
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin/coupons", formData);
            fetchCoupons();
            setIsDialogOpen(false);
            setFormData({
                code: "",
                discountType: "PERCENTAGE",
                discountValue: "",
                expiresAt: "",
                isActive: true
            });
        } catch (error) {
            console.error("Failed to create coupon:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this coupon code?")) return;
        try {
            await axios.delete(`/api/admin/coupons?id=${id}`);
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete coupon:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Promotions Terminal</h2>
                    <p className="text-muted-foreground text-sm">Issue and regulate luxury reward certificates.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl gap-2 shadow-xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
                            <Plus className="h-4 w-4" />
                            Issue Certificate
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-gold/10 backdrop-blur-xl bg-white/95">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">NEW PROMO CERTIFICATE</DialogTitle>
                            <DialogDescription className="text-[10px] font-black uppercase text-gold opacity-50">
                                Define the protocol for this promotional reward.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Promo Code</Label>
                                <Input
                                    className="rounded-xl border-gold/10 bg-cream/30 h-12 uppercase font-black"
                                    placeholder="e.g. LUXURY25"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reward Type</Label>
                                    <Select value={formData.discountType} onValueChange={(val) => setFormData({ ...formData, discountType: val })}>
                                        <SelectTrigger className="rounded-xl border-gold/10 bg-cream/30 h-12 text-xs font-black">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gold/10 font-black text-xs">
                                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                            <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</Label>
                                    <Input
                                        type="number"
                                        className="rounded-xl border-gold/10 bg-cream/30 h-12 font-black text-xs"
                                        placeholder="0"
                                        required
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiration Lifecycle</Label>
                                <Input
                                    type="date"
                                    className="rounded-xl border-gold/10 bg-cream/30 h-12 font-black text-xs"
                                    required
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-xl">Authorize Promo Pulse</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {coupons.length > 0 ? coupons.map((coupon) => (
                        <Card key={coupon.id} className="border-gold/10 shadow-sm relative overflow-hidden group rounded-3xl backdrop-blur-sm bg-white/50">
                            <div className={cn(
                                "absolute top-0 right-0 p-1 px-4 text-[9px] font-black uppercase tracking-widest rounded-bl-2xl",
                                coupon.isActive ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                            )}>
                                {coupon.isActive ? "Active Pulse" : "Inactive"}
                            </div>
                            <CardHeader className="pb-4 pt-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <Ticket className="h-4 w-4 text-gold" />
                                    <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">{coupon.discountType} Reward</span>
                                </div>
                                <CardTitle className="text-3xl font-black tracking-tighter flex items-center justify-between text-primary">
                                    {coupon.code}
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-gold rounded-xl transition-all">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pb-8">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-primary tracking-tighter">
                                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₦${coupon.discountValue.toLocaleString()}`}
                                    </span>
                                    <span className="text-[10px] font-black uppercase text-muted-foreground opacity-50 tracking-widest">Global Applied Discount</span>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gold/5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Calendar className="h-4 w-4 text-gold/40" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Vault Expiry</span>
                                        </div>
                                        <span className="text-xs font-black text-primary uppercase">{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <TrendingUp className="h-4 w-4 text-gold/40" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Usage Cycle</span>
                                        </div>
                                        <span className="text-xs font-black text-primary uppercase">0 Records</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gold/10">
                                    <div className="flex items-center gap-3">
                                        <Switch checked={coupon.isActive} className="data-[state=checked]:bg-gold scale-90" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Sync State</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-xl"
                                        onClick={() => handleDelete(coupon.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="col-span-full h-[400px] border-2 border-dashed border-gold/10 rounded-3xl flex flex-col items-center justify-center gap-4 bg-cream/20">
                            <Ticket className="h-12 w-12 text-gold/20" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reward database is currently empty</p>
                            <Button variant="outline" className="rounded-xl border-gold/20 text-gold font-black uppercase text-[10px] tracking-widest h-10 px-8" onClick={() => setIsDialogOpen(true)}>
                                Issue First Certificate
                            </Button>
                        </div>
                    )}
                </div>
            )
            }
        </div>
    );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
