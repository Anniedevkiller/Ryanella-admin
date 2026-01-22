"use client";

import { Plus, Folder, MoreHorizontal, Edit, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
    { name: "Apparel", count: 42, subcategories: 8, status: "Active", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80" },
    { name: "Accessories", count: 28, subcategories: 4, status: "Active", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&q=80" },
    { name: "Jewelry", count: 15, subcategories: 3, status: "Active", image: "https://images.unsplash.com/photo-1535633302703-b390140bc441?w=200&q=80" },
    { name: "Bags", count: 12, subcategories: 2, status: "Active", image: "https://images.unsplash.com/photo-1584917033904-493bb3c39dca?w=200&q=80" },
    { name: "Footwear", count: 0, subcategories: 0, status: "Inactive", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80" },
];

export default function CategoriesPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Categories</h2>
                    <p className="text-muted-foreground text-sm">Organize your products into logical collections.</p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 shadow-lg">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <Card key={cat.name} className="group border-gold/10 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-2xl">
                        <div className="relative h-40 w-full overflow-hidden">
                            <img
                                src={cat.image}
                                className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                                alt={cat.name}
                            />
                            <div className="absolute top-3 right-3">
                                <Badge variant="outline" className={cn(
                                    "border-2 font-bold px-2 py-1 uppercase text-[10px]",
                                    cat.status === "Active" ? "bg-emerald-500/90 text-white border-emerald-400" : "bg-slate-500/90 text-white border-slate-400"
                                )}>
                                    {cat.status}
                                </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <h3 className="text-white text-xl font-bold tracking-tight">{cat.name}</h3>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Products</p>
                                    <p className="text-lg font-black">{cat.count}</p>
                                </div>
                                <div className="h-8 w-px bg-gold/10" />
                                <div className="space-y-1 text-right">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Sub-cats</p>
                                    <p className="text-lg font-black">{cat.subcategories}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 rounded-xl border-gold/10 hover:bg-gold/5 gap-2 text-xs">
                                    <Edit className="h-3 w-3" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-xl border-gold/10 hover:bg-gold/5 gap-2 text-xs">
                                    <ArrowUpRight className="h-3 w-3" /> Explore Items
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl text-rose-500 hover:bg-rose-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
