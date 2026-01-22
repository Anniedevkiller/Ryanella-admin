"use client";

import { Search, Package, AlertTriangle, ArrowUpDown, Edit3, Download } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const inventory = [
    { id: 1, sku: "RY-SLK-001", product: "Silk Wrap Dress", category: "Apparel", stock: 24, minStock: 10, status: "In Stock" },
    { id: 2, sku: "RY-SCRF-002", product: "Luxury Silk Scarf", category: "Accessories", stock: 0, minStock: 5, status: "Out of Stock" },
    { id: 3, sku: "RY-ERNG-003", product: "Gold Hoop Earrings", category: "Jewelry", stock: 8, minStock: 15, status: "Low Stock" },
    { id: 4, sku: "RY-BAG-004", product: "Leather Tote Bag", category: "Bags", stock: 5, minStock: 10, status: "Low Stock" },
];

export default function InventoryPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Inventory Management</h2>
                    <p className="text-muted-foreground text-sm">Real-time stock tracking and alerts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-gold/10 hover:bg-gold/5 gap-2">
                        <Download className="h-4 w-4" />
                        Stock Report
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 rounded-xl">Purchase Orders</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total SKU</p>
                        <p className="text-3xl font-bold">142</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Out of Stock</p>
                        <p className="text-3xl font-bold">12</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-rose-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Low Stock Items</p>
                        <p className="text-3xl font-bold">24</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gold/5 shadow-sm">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by SKU or Product Name..."
                        className="pl-10 h-10 border-gold/10 bg-cream/30 focus-visible:ring-gold/50 rounded-xl"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gold/5 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-cream/50">
                        <TableRow className="hover:bg-transparent border-gold/5">
                            <TableHead>SKU</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Quick Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                <TableCell className="font-mono text-xs font-bold text-muted-foreground">{item.sku}</TableCell>
                                <TableCell className="font-semibold text-sm">{item.product}</TableCell>
                                <TableCell className="text-xs">{item.category}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5 w-32">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span>{item.stock} Units</span>
                                            <span className="text-muted-foreground">Min: {item.minStock}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-500",
                                                    item.stock === 0 ? "bg-rose-500 w-0" :
                                                        item.stock <= item.minStock ? "bg-amber-500 w-1/3" : "bg-emerald-500 w-full"
                                                )}
                                                style={{ width: `${Math.min((item.stock / 50) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "rounded-lg border-2 shadow-none font-bold text-[10px] uppercase tracking-wider",
                                            item.status === "In Stock" && "border-emerald-100 bg-emerald-50 text-emerald-700",
                                            item.status === "Low Stock" && "border-amber-100 bg-amber-50 text-amber-700",
                                            item.status === "Out of Stock" && "border-rose-100 bg-rose-50 text-rose-700"
                                        )}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-gold rounded-lg">
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
