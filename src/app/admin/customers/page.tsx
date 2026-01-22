"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, ShoppingBag, MoreHorizontal, User, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/admin/users?role=USER");
            setCustomers(response.data.users || []);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            await axios.patch("/api/admin/users", { userId, role: newRole });
            fetchCustomers();
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Client Directory</h2>
                    <p className="text-muted-foreground text-sm">Oversee your elite clientele and their purchase history.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-gold/5 shadow-sm">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 h-10 border-gold/10 bg-cream/30 focus-visible:ring-gold/50 rounded-xl text-xs font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="rounded-xl border-gold/10 hover:bg-gold/5 text-xs font-bold uppercase tracking-widest h-10 px-6" onClick={fetchCustomers}>
                    <Loader2 className={cn("h-3 w-3 mr-2", isLoading && "animate-spin")} />
                    Refresh List
                </Button>
            </div>

            <div className="bg-white rounded-3xl border border-gold/5 shadow-sm overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-cream/50">
                            <TableRow className="hover:bg-transparent border-gold/5 font-black uppercase text-[10px] tracking-widest">
                                <TableHead className="py-4">Patron</TableHead>
                                <TableHead>Communication</TableHead>
                                <TableHead>Activity</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Member Since</TableHead>
                                <TableHead className="text-right">Manage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length > 0 ? customers.map((customer) => (
                                <TableRow key={customer.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-gold/10 shadow-sm ring-2 ring-cream">
                                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black uppercase">
                                                    {customer.name.split(" ").map((n: string) => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm tracking-tight text-primary">{customer.name}</span>
                                                <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Luxe Tier</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-black">
                                                <Mail className="h-3 w-3 text-gold opacity-50" /> {customer.email}
                                            </div>
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-black">
                                                    <Phone className="h-3 w-3 text-gold opacity-50" /> {customer.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="font-black text-xs text-primary">{customer._count?.orders || 0} Transactions</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase border-gold/20 text-gold bg-cream/50 px-2 py-0">
                                            {customer.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[11px] text-muted-foreground font-black uppercase tracking-tight">
                                        {new Date(customer.createdAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-gold rounded-xl transition-colors">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gold/10 shadow-2xl overflow-hidden p-1 backdrop-blur-xl bg-white/95">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-black text-muted-foreground p-3">Privilege Control</DropdownMenuLabel>
                                                <DropdownMenuItem className="p-3 cursor-pointer flex gap-3 text-xs font-black rounded-xl focus:bg-gold/5 focus:text-gold">
                                                    <User className="h-4 w-4" /> Comprehensive Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="p-3 cursor-pointer flex gap-3 text-xs font-black rounded-xl focus:bg-gold/5 focus:text-gold">
                                                    <ShoppingBag className="h-4 w-4" /> Ledger History
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gold/5" />
                                                <DropdownMenuItem
                                                    className="p-3 cursor-pointer flex gap-3 text-xs font-black rounded-xl focus:bg-emerald-50 focus:text-emerald-700"
                                                    onClick={() => handleUpdateRole(customer.id, "ADMIN")}
                                                >
                                                    <ShieldCheck className="h-4 w-4" /> Promote to Staff
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="p-3 cursor-pointer flex gap-3 text-xs font-black rounded-xl text-destructive focus:bg-destructive/10">
                                                    <ShieldAlert className="h-4 w-4" /> Restrict Access
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-[400px] text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="h-20 w-20 bg-secondary/30 rounded-full flex items-center justify-center mb-2">
                                                <User className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Exclusive membership is currently empty</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
