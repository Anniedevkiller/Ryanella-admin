"use client";

import { useEffect, useState } from "react";
import { Search, Package, AlertTriangle, Edit3, Download, Loader2, Save, CheckCircle2 } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function InventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newStock, setNewStock] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/admin/products?limit=100");
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickEdit = (product: any) => {
        setSelectedProduct(product);
        setNewStock(product.stock.toString());
        setIsEditDialogOpen(true);
        setShowSuccess(false);
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;
        setIsUpdating(true);
        try {
            await axios.patch(`/api/admin/products/${selectedProduct.id}`, {
                stock: parseInt(newStock)
            });
            setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: parseInt(newStock) } : p));
            setShowSuccess(true);
            setTimeout(() => {
                setIsEditDialogOpen(false);
                setShowSuccess(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to update stock:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Inventory Management</h2>
                    <p className="text-muted-foreground text-sm">Real-time stock tracking and alerts from Ryanella DB.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-gold/10 hover:bg-gold/5 gap-2 text-xs font-bold uppercase tracking-widest" onClick={fetchInventory} disabled={isLoading}>
                        <Loader2 className={cn("h-3 w-3", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button variant="outline" className="rounded-xl border-gold/10 hover:bg-gold/5 gap-2 text-xs font-bold uppercase tracking-widest">
                        <Download className="h-3 w-3" />
                        Stock Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total SKU</p>
                        <p className="text-3xl font-black">{products.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Out of Stock</p>
                        <p className="text-3xl font-black">{outOfStockCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-rose-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Low Stock Items</p>
                        <p className="text-3xl font-black">{lowStockCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gold/5 shadow-sm">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        placeholder="Search by ID or Product Name..."
                        className="w-full pl-10 h-10 border border-gold/10 bg-cream/30 focus:ring-1 focus:ring-gold/50 rounded-xl outline-none text-xs font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gold/5 shadow-sm overflow-hidden min-h-[300px]">
                {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center flex-col gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gold" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Vault...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-cream/50">
                            <TableRow className="hover:bg-transparent border-gold/5">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Product</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Stock Level</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Quick Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <TableRow key={product.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-lg border border-gold/5 overflow-hidden bg-cream">
                                                <img src={product.images?.[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80"} className="h-full w-full object-cover" alt="" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{product.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-black uppercase">ID: {product.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] font-bold border-gold/10 text-primary uppercase px-2 py-0">
                                            {product.category?.name || "Uncategorized"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5 w-32">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                <span className={cn(product.stock < 10 && "text-amber-600", product.stock === 0 && "text-rose-600")}>
                                                    {product.stock} Units
                                                </span>
                                                <span className="text-muted-foreground opacity-50">Limit: 10</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-700",
                                                        product.stock === 0 ? "bg-rose-500 w-0" :
                                                            product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"
                                                    )}
                                                    style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-md border-2 shadow-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5",
                                                product.stock > 10 && "border-emerald-100 bg-emerald-50 text-emerald-700",
                                                product.stock > 0 && product.stock <= 10 && "border-amber-100 bg-amber-50 text-amber-700",
                                                product.stock === 0 && "border-rose-100 bg-rose-50 text-rose-700"
                                            )}
                                        >
                                            {product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-gold rounded-xl transition-colors" onClick={() => handleQuickEdit(product)}>
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-60 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-10 w-10 text-muted-foreground/20" />
                                            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">
                                                No matching inventory items
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Quick Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-gold/10 backdrop-blur-xl bg-white/95">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tighter">Adjust Inventory</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-muted-foreground">
                            Update stock level for <span className="text-primary font-black">{selectedProduct?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Stock</Label>
                            <Input
                                type="number"
                                className="rounded-xl border-gold/10 bg-cream/30 h-12 font-black text-lg"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {showSuccess ? (
                            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest animate-in zoom-in-95 duration-300">
                                <CheckCircle2 className="h-4 w-4" /> Stock Updated
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" className="rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
                                <Button className="rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-8 h-12 shadow-xl hover:scale-[1.02] transition-transform" onClick={handleUpdateStock} disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Save className="h-3 w-3 mr-2" />}
                                    {isUpdating ? "Syncing..." : "Commit Changes"}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
