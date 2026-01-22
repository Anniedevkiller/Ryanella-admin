"use client";

import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Calendar } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie,
} from "recharts";

const salesData = [
    { month: "Jan", sales: 2400 },
    { month: "Feb", sales: 1398 },
    { month: "Mar", sales: 9800 },
    { month: "Apr", sales: 3908 },
    { month: "May", sales: 4800 },
    { month: "Jun", sales: 3800 },
    { month: "Jul", sales: 4300 },
];

const categoryData = [
    { name: "Apparel", value: 450, color: "#1A1A1A" },
    { name: "Accessories", value: 300, color: "#C5A059" },
    { name: "Jewelry", value: 300, color: "#F3F4F6" },
    { name: "Bags", value: 200, color: "#E5E7EB" },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Analytics Insights</h2>
                    <p className="text-muted-foreground text-sm">Deep dive into your store's performance metrics.</p>
                </div>
                <Button variant="outline" className="rounded-xl border-gold/10 gap-2">
                    <Calendar className="h-4 w-4" />
                    Select Range: Last 30 Days
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-gold/5 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-widest">Revenue</CardDescription>
                        <CardTitle className="text-2xl font-black">₦12.5M</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                            <TrendingUp className="h-3 w-3" /> +14.2%
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-gold/5 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-widest">Average Order</CardDescription>
                        <CardTitle className="text-2xl font-black">₦34,200</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                            <TrendingUp className="h-3 w-3" /> +2.5%
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-gold/5 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-widest">Conversion</CardDescription>
                        <CardTitle className="text-2xl font-black">3.8%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-rose-500 font-bold text-xs">
                            <TrendingDown className="h-3 w-3" /> -0.4%
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-gold/5 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold tracking-widest">Visitors</CardDescription>
                        <CardTitle className="text-2xl font-black">42.8k</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                            <TrendingUp className="h-3 w-3" /> +8.1%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-gold/10 shadow-lg">
                    <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                        <CardDescription>Monthly growth comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData}>
                                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#FDFBF7' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="sales" fill="#1A1A1A" radius={[6, 6, 0, 0]}>
                                        {salesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 2 ? '#C5A059' : '#1A1A1A'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gold/10 shadow-lg">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Distribution across main collections</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                            {categoryData.map((cat) => (
                                <div key={cat.name} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{cat.name}</span>
                                    <span className="text-xs font-bold ml-auto">{((cat.value / 1250) * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
