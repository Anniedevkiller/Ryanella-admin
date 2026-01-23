"use client";

import { useState } from "react";
import {
    Store,
    CreditCard,
    Truck,
    ShieldCheck,
    Bell,
    Database,
    ChevronRight,
    Globe,
    Lock,
    Users,
    Shield,
    Mail,
    UserPlus,
    MoreHorizontal,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const settingsGroups = [
    {
        id: "store",
        title: "Store Policy",
        description: "Manage your store name, logo, and public info.",
        icon: Store,
        items: ["General Profile", "Contact Information", "Store Branding"]
    },
    {
        id: "financials",
        title: "Financials",
        description: "Payment methods, currency, and taxes.",
        icon: CreditCard,
        items: ["Payment Gateways", "Default Currency", "Tax Rules"]
    },
    {
        id: "operations",
        title: "Operations",
        description: "Shipping and order management rules.",
        icon: Truck,
        items: ["Shipping Zones", "Delivery Estimates", "Package Sizes"]
    },
    {
        id: "security",
        title: "Security & Roles",
        description: "Admin permissions and access control.",
        icon: ShieldCheck,
        items: ["Admin List", "Access Logs", "Password Policy"]
    }
];

const admins = [
    { id: 1, name: "Ryanella Admin", email: "admin@ryanella.com", role: "Super Admin", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@ryanella.com", role: "Manager", status: "Active" },
    { id: 3, name: "Michael Chen", email: "michael@ryanella.com", role: "Support", status: "Inactive" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("store");

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Global Settings</h2>
                    <p className="text-muted-foreground text-sm">Configure your Ryanella workspace and preferences.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {settingsGroups.map((group) => (
                        <Card
                            key={group.id}
                            className={cn(
                                "border-gold/10 hover:border-gold/30 cursor-pointer transition-all active:scale-[0.98]",
                                activeSection === group.id && "border-gold bg-gold/5 shadow-md"
                            )}
                            onClick={() => setActiveSection(group.id)}
                        >
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                    activeSection === group.id ? "bg-primary text-white" : "bg-secondary text-primary"
                                )}>
                                    <group.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{group.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
                                </div>
                                <ChevronRight className={cn(
                                    "h-4 w-4 text-muted-foreground self-center transition-transform",
                                    activeSection === group.id && "translate-x-1 text-gold"
                                )} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {activeSection === "store" && (
                        <>
                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Store Information</CardTitle>
                                    <CardDescription>Primary identification details for Ryanella.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Name</label>
                                        <Input defaultValue="Ryanella" className="rounded-xl border-gold/10 bg-cream/30" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Store Domain</label>
                                        <div className="flex gap-2">
                                            <Input defaultValue="ryanella.com" className="rounded-xl border-gold/10 bg-cream/30" readOnly />
                                            <Button variant="outline" className="rounded-xl border-gold/10 shrink-0">Verify</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Global Presence</CardTitle>
                                    <CardDescription>Manage how customers perceive and pay for products.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-semibold text-primary">Base Currency</div>
                                            <div className="text-xs text-muted-foreground">Default currency for all products.</div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-gold/5">
                                            <Globe className="h-4 w-4 text-gold" />
                                            <span className="text-xs font-bold uppercase tracking-widest">NGN - Naira</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeSection === "security" && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                                <div>
                                    <h3 className="text-lg font-bold">Team Management</h3>
                                    <p className="text-sm text-muted-foreground">Manage administrative access and roles.</p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shadow-lg">
                                            <UserPlus className="h-4 w-4" />
                                            Invite Admin
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] rounded-2xl border-gold/10">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">Invite New Admin</DialogTitle>
                                            <DialogDescription>
                                                Grant administrative access to your team members.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                                <Input placeholder="e.g. Jane Doe" className="rounded-xl border-gold/10 bg-cream/30" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                                <Input type="email" placeholder="jane@ryanella.com" className="rounded-xl border-gold/10 bg-cream/30" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Assign Role</Label>
                                                <Select>
                                                    <SelectTrigger className="rounded-xl border-gold/10 bg-cream/30">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-gold/10">
                                                        <SelectItem value="manager">Manager (Full access)</SelectItem>
                                                        <SelectItem value="editor">Editor (Product/Content only)</SelectItem>
                                                        <SelectItem value="support">Support (Orders/Customers only)</SelectItem>
                                                        <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="ghost" className="rounded-xl">Cancel</Button>
                                            <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8">Send Invitation</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="border-gold/10 shadow-sm overflow-hidden rounded-2xl">
                                <Table>
                                    <TableHeader className="bg-cream/50">
                                        <TableRow className="hover:bg-transparent border-gold/5">
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest">Admin</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest">Role</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map((admin) => (
                                            <TableRow key={admin.id} className="group hover:bg-gold/5 border-gold/5">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm">{admin.name}</span>
                                                        <span className="text-[10px] text-muted-foreground">{admin.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-secondary/50 text-primary font-bold text-[10px] shadow-none">
                                                        {admin.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "font-bold text-[10px] shadow-none",
                                                        admin.status === "Active" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10" : "bg-slate-500/10 text-slate-500 hover:bg-slate-500/10"
                                                    )}>
                                                        {admin.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-gold rounded-lg">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>System Security</CardTitle>
                                    <CardDescription>Protect your administrative workspace.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-semibold">Two-Factor Authentication</div>
                                            <div className="text-xs text-muted-foreground">Add an extra layer of security to logins.</div>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-gold" />
                                    </div>
                                    <Separator className="bg-gold/5" />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-semibold">Session Timeout</div>
                                            <div className="text-xs text-muted-foreground">Automatically log out inactive admins.</div>
                                        </div>
                                        <Select defaultValue="30">
                                            <SelectTrigger className="w-32 rounded-xl border-gold/10 h-9 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-gold/10">
                                                <SelectItem value="15">15 mins</SelectItem>
                                                <SelectItem value="30">30 mins</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {activeSection === "financials" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Payment Architecture</CardTitle>
                                    <CardDescription>Configure how Ryanella processes elite transactions.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-cream/20 rounded-2xl border border-gold/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-[#09A5DB]/10 flex items-center justify-center">
                                                <CreditCard className="h-5 w-5 text-[#09A5DB]" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-primary">Paystack Integration</div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase">Main Payment Gateway</div>
                                            </div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-gold" />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Public Key</Label>
                                            <Input defaultValue="pk_live_************************" type="password" className="rounded-xl border-gold/10 bg-cream/30 h-10 font-mono text-xs" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secret Key</Label>
                                            <Input defaultValue="sk_live_************************" type="password" className="rounded-xl border-gold/10 bg-cream/30 h-10 font-mono text-xs" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Tax & Levy Protocols</CardTitle>
                                    <CardDescription>Define global tax rates for luxury goods.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">VAT (%)</Label>
                                            <Input type="number" defaultValue="7.5" className="rounded-xl border-gold/10 bg-cream/30 h-10 font-black text-xs" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Luxury Surfcharge</Label>
                                            <Input type="number" defaultValue="0" className="rounded-xl border-gold/10 bg-cream/30 h-10 font-black text-xs" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === "operations" && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Logistics & Fulfillment</CardTitle>
                                    <CardDescription>Manage delivery corridors and shipping rates.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { zone: "Lagos Metropolitan", rate: "₦5,000", time: "24-48 Hours" },
                                            { zone: "Nationwide (NG)", rate: "₦12,000", time: "3-5 Days" },
                                            { zone: "International (Priority)", rate: "$150", time: "7-10 Days" },
                                        ].map((zone, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gold/5 hover:border-gold/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                                        <Truck className="h-5 w-5 text-gold" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-primary">{zone.zone}</div>
                                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">{zone.time} Estimate</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-primary">{zone.rate}</div>
                                                    <Button variant="link" className="h-auto p-0 text-[9px] font-black uppercase text-gold">Modify</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="outline" className="w-full rounded-xl border-dashed border-gold/20 text-gold font-black uppercase text-[10px] tracking-widest h-12">
                                        Add Shipping Corridor
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-gold/10 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Administrative Protocols</CardTitle>
                                    <CardDescription>Operational behavior and automated responses.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-black text-primary">Auto-Fulfill Digital Items</div>
                                            <div className="text-[11px] text-muted-foreground font-medium">Instantly mark digital goods as delivered.</div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-gold" />
                                    </div>
                                    <Separator className="bg-gold/5" />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-black text-primary">Low Stock Notifications</div>
                                            <div className="text-[11px] text-muted-foreground font-medium">Alert admins when inventory drops below threshold.</div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-gold" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection !== "financials" && activeSection !== "operations" && (
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" className="rounded-xl text-muted-foreground">Cancel Changes</Button>
                            <Button className="rounded-xl bg-primary hover:bg-primary/90 px-8 transition-all hover:scale-[1.02]">Save Configuration</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
