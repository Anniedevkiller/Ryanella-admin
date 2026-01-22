"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Upload,
    X,
    Loader2
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        description: "",
        priceNGN: "",
        priceUSD: "",
        stock: "0",
        isActive: true,
        images: [] as string[],
        sizes: [] as string[],
        colors: [] as string[]
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/admin/products");
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin/products", formData);
            fetchProducts();
            setIsDialogOpen(false);
            setFormData({
                name: "",
                categoryId: "",
                description: "",
                priceNGN: "",
                priceUSD: "",
                stock: "0",
                isActive: true,
                images: [],
                sizes: [],
                colors: []
            });
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`/api/admin/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await axios.patch(`/api/admin/products/${id}`, { isActive: !currentStatus });
            setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Products Catalog</h2>
                    <p className="text-muted-foreground text-sm">Manage your luxury apparel and fine accessories.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 shadow-lg">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] rounded-2xl border-gold/10 max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">New Collection Item</DialogTitle>
                            <DialogDescription>
                                Add a new piece to the Ryanella luxury marketplace.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Silk Wrap Dress"
                                        className="rounded-xl border-gold/10 bg-cream/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                    >
                                        <SelectTrigger className="rounded-xl border-gold/10 bg-cream/30">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gold/10 text-xs font-bold">
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                            {categories.length === 0 && (
                                                <SelectItem value="none" disabled>No categories found</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the product elegance..."
                                    className="rounded-xl border-gold/10 bg-cream/30 min-h-[80px] text-xs font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (NGN)</Label>
                                    <Input
                                        type="number"
                                        required
                                        value={formData.priceNGN}
                                        onChange={(e) => setFormData({ ...formData, priceNGN: e.target.value })}
                                        placeholder="0.00"
                                        className="rounded-xl border-gold/10 bg-cream/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Quantity</Label>
                                    <Input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="0"
                                        className="rounded-xl border-gold/10 bg-cream/30"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Sizes</Label>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {["XS", "S", "M", "L", "XL"].map((size) => (
                                            <Badge
                                                key={size}
                                                variant={formData.sizes.includes(size) ? "default" : "outline"}
                                                className="cursor-pointer font-bold text-[10px]"
                                                onClick={() => {
                                                    const newSizes = formData.sizes.includes(size)
                                                        ? formData.sizes.filter(s => s !== size)
                                                        : [...formData.sizes, size];
                                                    setFormData({ ...formData, sizes: newSizes });
                                                }}
                                            >
                                                {size}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Status</Label>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Switch
                                            checked={formData.isActive}
                                            onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                                            className="data-[state=checked]:bg-gold"
                                        />
                                        <span className="text-xs font-bold text-muted-foreground uppercase">{formData.isActive ? "Published" : "Draft"}</span>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="ghost" className="rounded-xl text-xs font-bold" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-xl px-12 font-bold text-xs uppercase tracking-widest">Create Product</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gold/5 shadow-sm">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search collection..."
                        className="pl-10 h-10 border-gold/10 bg-cream/30 focus-visible:ring-gold/50 rounded-xl text-xs font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl border-gold/10 hover:bg-gold/5 text-xs font-bold uppercase tracking-wider h-10 px-6" onClick={fetchProducts}>
                        <Loader2 className={cn("h-3 w-3 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gold/5 shadow-sm overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-cream/50">
                            <TableRow className="hover:bg-transparent border-gold/5">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Item</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Pricing</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Inventory</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Manage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length > 0 ? products.map((product) => (
                                <TableRow key={product.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-lg border border-gold/10 overflow-hidden bg-cream shadow-sm">
                                                <img
                                                    src={product.images?.[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80"}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{product.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-black">ID: {product.id.substring(0, 6)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] font-bold border-gold/10 text-primary uppercase px-2 py-0">
                                            {product.category?.name || "Uncategorized"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-black text-xs text-primary">
                                        ₦{product.priceNGN?.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs font-black",
                                                product.stock === 0 ? "text-destructive" : product.stock < 10 ? "text-amber-600" : "text-foreground"
                                            )}>
                                                {product.stock}
                                            </span>
                                            {product.stock === 0 && <Badge variant="destructive" className="h-4 text-[9px] uppercase px-1 font-black px-1.5 shadow-none">Empty</Badge>}
                                            {product.stock > 0 && product.stock < 10 && <Badge variant="secondary" className="h-4 text-[9px] uppercase px-1 bg-amber-50 text-amber-700 border-none font-black px-1.5 shadow-none">Low</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleToggleStatus(product.id, product.isActive)}>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-md border shadow-none text-[10px] font-black uppercase px-2 py-0.5 transition-all cursor-pointer hover:opacity-80",
                                                    product.isActive ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-100 bg-slate-50 text-slate-500"
                                                )}
                                            >
                                                {product.isActive ? "Live" : "Draft"}
                                            </Badge>
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-gold rounded-lg transition-colors">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-gold/10 shadow-2xl overflow-hidden p-1 backdrop-blur-lg bg-white/90">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-black text-muted-foreground p-3">Item Control</DropdownMenuLabel>
                                                <DropdownMenuItem className="p-3 cursor-pointer flex gap-3 text-xs font-bold rounded-xl focus:bg-gold/5 focus:text-gold">
                                                    <Eye className="h-4 w-4" /> Public View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="p-3 cursor-pointer flex gap-3 text-xs font-bold rounded-xl focus:bg-gold/5 focus:text-gold">
                                                    <Edit className="h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gold/5" />
                                                <DropdownMenuItem
                                                    className="p-3 cursor-pointer flex gap-3 text-xs font-bold rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete Forever
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
                                                <Filter className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No products found in the database</p>
                                            <Button variant="outline" className="rounded-xl border-gold/20 text-gold" onClick={() => setIsDialogOpen(true)}>
                                                Create Your First Collection
                                            </Button>
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

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
