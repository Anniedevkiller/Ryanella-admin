"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    Users,
    ShoppingBag,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Loader2
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import axios from "axios";

const data = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
];

export default function DashboardPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("/api/admin/analytics");
                setAnalytics(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    const { summary, recentOrders } = analytics || {
        summary: { revenue: 0, orders: 0, customers: 0, products: 0 },
        recentOrders: []
    };

    const stats = [
        {
            title: "Total Revenue",
            value: `₦${summary.revenue.toLocaleString()}`,
            change: "+0%",
            trend: "up",
            icon: TrendingUp,
            description: "Real-time revenue"
        },
        {
            title: "Total Orders",
            value: summary.orders.toString(),
            change: "+0%",
            trend: "up",
            icon: ShoppingBag,
            description: "Total transactions"
        },
        {
            title: "Total Customers",
            value: summary.customers.toString(),
            change: "+0%",
            trend: "up",
            icon: Users,
            description: "Registered users"
        },
        {
            title: "Global Inventory",
            value: summary.products.toString(),
            change: "0",
            trend: "up",
            icon: AlertCircle,
            description: "Product SKUs"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
                <p className="text-muted-foreground mt-1">Live analytics from the Ryanella engine.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-gold/5 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                <stat.icon className="h-4 w-4 text-gold" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-rose-500" />
                                )}
                                <span className={stat.trend === "up" ? "text-emerald-500 text-xs font-medium" : "text-rose-500 text-xs font-medium"}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Sales Chart */}
                <Card className="lg:col-span-4 border-gold/5 shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Analytics</CardTitle>
                        <CardDescription>Live revenue distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₦${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            borderRadius: "12px",
                                            border: "1px solid #C5A05920",
                                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#C5A059"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products / Sidebar Content */}
                <Card className="lg:col-span-3 border-gold/5 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Inventory Quick-View</CardTitle>
                            <CardDescription>Performance indicators</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { name: "Silk Wrap Dress", category: "Apparel", sales: 0, revenue: "₦0", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80" },
                                { name: "Gold Chain Necklace", category: "Accessories", sales: 0, revenue: "₦0", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80" },
                                { name: "Leather Tote Bag", category: "Bags", sales: 0, revenue: "₦0", image: "https://images.unsplash.com/photo-1584917033904-493bb3c39dca?w=100&q=80" },
                            ].map((product, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="h-12 w-12 rounded-xl overflow-hidden border border-gold/10 relative">
                                        <img src={product.image} alt={product.name} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold group-hover:text-gold transition-colors">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{product.revenue}</p>
                                        <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6 rounded-xl border-gold/20 hover:bg-gold/5 hover:text-gold">
                            View All Products
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card className="border-gold/5 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Managed transactions</CardDescription>
                    </div>
                    <Button variant="outline" className="rounded-xl border-gold/20 hover:bg-gold/5 hover:text-gold">
                        View All Reports
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-gold/5">
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order: any) => (
                                <TableRow key={order.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                    <TableCell className="font-semibold text-xs">{order.id.substring(0, 8)}</TableCell>
                                    <TableCell className="text-sm">{order.user?.name || "Guest"}</TableCell>
                                    <TableCell className="font-bold text-primary">₦{order.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "rounded-lg font-bold text-[10px] uppercase px-2 py-0.5 shadow-none",
                                                order.orderStatus === "DELIVERED" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
                                                order.orderStatus === "PROCESSING" && "bg-blue-50 text-blue-700 border border-blue-100",
                                                order.orderStatus === "SHIPPED" && "bg-amber-50 text-amber-700 border border-amber-100",
                                                order.orderStatus === "PENDING" && "bg-slate-50 text-slate-700 border border-slate-100"
                                            )}
                                        >
                                            {order.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-[10px] font-medium">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-gold font-bold text-[10px] uppercase tracking-wider">
                                            Quick View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {recentOrders.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground text-sm italic">No recent orders found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
