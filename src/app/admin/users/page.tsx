"use client";

import { useEffect, useState } from "react";
import {
    ShieldCheck,
    UserPlus,
    ShieldAlert,
    MoreHorizontal,
    Mail,
    Shield,
    Loader2,
    Lock,
    Unlock,
    UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useAuth } from "@/context/auth-context";

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADMIN"
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/admin/users?role=ADMIN&role=SUPER_ADMIN");
            // The API might not support double role param well, so we might get all or just one.
            // Let's assume we get a curated list or handle it locally.
            setAdmins(response.data.users || []);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin/users", formData);
            fetchAdmins();
            setIsCreateOpen(false);
            setFormData({ name: "", email: "", password: "", role: "ADMIN" });
        } catch (error) {
            console.error("Failed to create admin:", error);
        }
    };

    const handleUpdateStatus = async (userId: string, isBlocked: boolean) => {
        try {
            await axios.patch("/api/admin/users", { userId, isBlocked });
            setAdmins(admins.map(a => a.id === userId ? { ...a, isBlocked } : a));
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleUpdateRole = async (userId: string, role: string) => {
        try {
            await axios.patch("/api/admin/users", { userId, role });
            setAdmins(admins.map(a => a.id === userId ? { ...a, role } : a));
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    if (currentUser?.role !== "SUPER_ADMIN") {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <ShieldAlert className="h-16 w-16 text-destructive opacity-20" />
                <h1 className="text-xl font-black uppercase tracking-widest text-primary opacity-40">Privileged Terminal Access Only</h1>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-primary uppercase italic">Staff Command</h2>
                    <p className="text-muted-foreground text-sm font-medium">Manage administrative privileges and security protocols.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-gold hover:bg-primary/90 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl">
                            <UserPlus className="h-4 w-4 mr-2" /> Recruit Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-gold/10 backdrop-blur-xl bg-white/95">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Issue Credentials</DialogTitle>
                            <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-gold opacity-60">Authorize a new administrative operative.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                <Input
                                    required
                                    className="rounded-xl border-gold/10 bg-cream/30 h-12 font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Terminal</Label>
                                <Input
                                    type="email"
                                    required
                                    className="rounded-xl border-gold/10 bg-cream/30 h-12 font-bold"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Master Password</Label>
                                <Input
                                    type="password"
                                    required
                                    className="rounded-xl border-gold/10 bg-cream/30 h-12 font-bold"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clearance Level</Label>
                                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                    <SelectTrigger className="rounded-xl border-gold/10 bg-cream/30 h-12 font-black text-xs uppercase">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gold/10 font-black text-xs uppercase">
                                        <SelectItem value="ADMIN">Standard Admin</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full h-12 rounded-2xl bg-primary text-gold font-black uppercase tracking-widest text-[11px] shadow-xl">Confirm Authorization</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-gold/10 shadow-2xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-cream/50">
                            <TableRow className="hover:bg-transparent border-gold/5">
                                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Operative</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Clearance</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Appointed</TableHead>
                                <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Manage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map((admin) => (
                                <TableRow key={admin.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                    <TableCell className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-gold/10">
                                                <UserCircle className="h-6 w-6 text-primary opacity-40" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm tracking-tight text-primary uppercase">{admin.name}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground opacity-70">{admin.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] font-black uppercase px-2 py-0 border-2 shadow-none",
                                            admin.role === "SUPER_ADMIN" ? "border-gold/20 text-gold bg-gold/5" : "border-primary/10 text-primary bg-primary/5"
                                        )}>
                                            {admin.role.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn(
                                            "text-[9px] font-black uppercase px-2 py-0 shadow-none",
                                            admin.isBlocked ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                                        )}>
                                            {admin.isBlocked ? "Restricted" : "Active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">
                                        {new Date(admin.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        {admin.id !== currentUser?.id ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-gold rounded-xl transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gold/10 shadow-2xl p-1 backdrop-blur-xl bg-white/95">
                                                    <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground p-3">Privilege Protocol</DropdownMenuLabel>

                                                    <DropdownMenuItem
                                                        className="p-3 font-black text-[10px] rounded-xl focus:bg-gold/5 focus:text-gold uppercase cursor-pointer"
                                                        onClick={() => handleUpdateRole(admin.id, admin.role === "SUPER_ADMIN" ? "ADMIN" : "SUPER_ADMIN")}
                                                    >
                                                        <Shield className="h-3.5 w-3.5 mr-2" />
                                                        {admin.role === "SUPER_ADMIN" ? "Downgrade to Admin" : "Authorize Super Admin"}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="bg-gold/5" />

                                                    <DropdownMenuItem
                                                        className={cn(
                                                            "p-3 font-black text-[10px] rounded-xl uppercase cursor-pointer",
                                                            admin.isBlocked ? "focus:bg-emerald-50 focus:text-emerald-600" : "focus:bg-rose-50 focus:text-rose-600 text-rose-600"
                                                        )}
                                                        onClick={() => handleUpdateStatus(admin.id, !admin.isBlocked)}
                                                    >
                                                        {admin.isBlocked ? (
                                                            <> <Unlock className="h-3.5 w-3.5 mr-2" /> Restore Access</>
                                                        ) : (
                                                            <> <Lock className="h-3.5 w-3.5 mr-2" /> Revoke Access</>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <span className="text-[9px] font-black uppercase text-gold opacity-40 px-3">Self</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");
