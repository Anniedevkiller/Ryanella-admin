"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Eye, Printer, Download, MoreHorizontal, Loader2 } from "lucide-react";
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
import axios from "axios";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const statusParam = filterStatus !== "ALL" ? `?status=${filterStatus}` : "";
            const response = await axios.get(`/api/admin/orders${statusParam}`);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, status: string, type: "order" | "payment") => {
        try {
            const data = type === "order" ? { orderId, orderStatus: status } : { orderId, paymentStatus: status };
            await axios.patch("/api/admin/orders", data);
            setOrders(orders.map(o => o.id === orderId ? {
                ...o,
                orderStatus: type === "order" ? status : o.orderStatus,
                paymentStatus: type === "payment" ? status : o.paymentStatus
            } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({
                    ...selectedOrder,
                    orderStatus: type === "order" ? status : selectedOrder.orderStatus,
                    paymentStatus: type === "payment" ? status : selectedOrder.paymentStatus
                });
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Active Orders</h2>
                    <p className="text-muted-foreground text-sm">Track and fulfill high-end customer purchases.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-gold/10 hover:bg-gold/5 gap-2 text-xs font-bold uppercase tracking-widest">
                        <Download className="h-3 w-3" />
                        Export Log
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gold/5 shadow-sm">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="ID or Customer email..."
                        className="pl-10 h-10 border-gold/10 bg-cream/30 focus-visible:ring-gold/50 rounded-xl text-xs font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <div className="flex bg-secondary/50 p-1 rounded-xl">
                        {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((status) => (
                            <Button
                                key={status}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-lg h-8 px-4 text-[10px] font-black uppercase tracking-tighter transition-all",
                                    filterStatus === status ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white/50"
                                )}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status === "ALL" ? "All Orders" : status}
                            </Button>
                        ))}
                    </div>
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
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Ref ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Client</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Total</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Payment</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Placed On</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? orders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-gold/5 border-gold/5 transition-colors">
                                    <TableCell className="font-black text-xs text-gold uppercase">{order.id.substring(0, 8)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{order.user?.name || "Guest"}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">{order.user?.email || "No email"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-xs text-primary">₦{order.totalAmount?.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-md text-[9px] font-black uppercase px-2 py-0.5 shadow-none border-2",
                                                order.paymentStatus === "PAID" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                                                order.paymentStatus === "PENDING" && "bg-amber-50 text-amber-700 border-amber-100",
                                                order.paymentStatus === "FAILED" && "bg-rose-50 text-rose-700 border-rose-100"
                                            )}
                                        >
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "rounded-md text-[9px] font-black uppercase px-2 py-0.5 shadow-none border-none",
                                                order.orderStatus === "DELIVERED" && "bg-emerald-100 text-emerald-700",
                                                order.orderStatus === "SHIPPED" && "bg-blue-100 text-blue-700",
                                                order.orderStatus === "PROCESSING" && "bg-purple-100 text-purple-700",
                                                order.orderStatus === "PENDING" && "bg-slate-100 text-slate-700",
                                                order.orderStatus === "CANCELLED" && "bg-rose-100 text-rose-700"
                                            )}
                                        >
                                            {order.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-[10px] font-bold">
                                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:text-gold rounded-lg h-8 w-8 transition-colors" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[700px] rounded-3xl border-gold/10 max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 shadow-2xl">
                                                    <DialogHeader className="pb-6 border-b border-gold/5 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <DialogTitle className="text-2xl font-black tracking-tighter uppercase">ORDER {selectedOrder?.id.substring(0, 12)}</DialogTitle>
                                                                    <Badge className="bg-primary text-primary-foreground text-[9px] font-black uppercase rounded-sm">{selectedOrder?.orderStatus}</Badge>
                                                                </div>
                                                                <DialogDescription className="text-xs font-bold text-muted-foreground uppercase opacity-70 mt-1">
                                                                    Synchronized via Ryanella DB at {selectedOrder ? new Date(selectedOrder.createdAt).toLocaleTimeString() : ""}
                                                                </DialogDescription>
                                                            </div>
                                                        </div>
                                                    </DialogHeader>
                                                    <div className="py-8 space-y-10">
                                                        {/* Summary Grid */}
                                                        <div className="grid grid-cols-2 gap-10">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-gold opacity-50">Customer Protocol</h4>
                                                                <div>
                                                                    <p className="font-black text-primary text-lg tracking-tight">{selectedOrder?.user?.name || "Guest Patron"}</p>
                                                                    <p className="text-muted-foreground text-xs font-bold">{selectedOrder?.user?.email}</p>
                                                                    <p className="text-muted-foreground text-xs font-bold mt-1">Ref: {selectedOrder?.paystackRef || "DIRECT_PAY"}</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-gold opacity-50">Logistic Terminal</h4>
                                                                <div className="p-4 bg-cream/30 rounded-2xl border border-gold/10">
                                                                    <p className="text-primary text-xs font-bold leading-relaxed">{selectedOrder?.shippingAddress}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Manifest */}
                                                        <div className="space-y-5">
                                                            <h4 className="text-[10px] uppercase font-black tracking-widest text-gold opacity-50">Inventory Manifest</h4>
                                                            <div className="space-y-3">
                                                                {selectedOrder?.items?.map((item: any) => (
                                                                    <div key={item.id} className="flex items-center gap-5 p-4 bg-white/50 rounded-2xl border border-gold/5 group hover:border-gold/20 transition-all shadow-sm">
                                                                        <div className="h-20 w-20 shrink-0 bg-cream rounded-xl border border-gold/5 overflow-hidden shadow-inner">
                                                                            <img src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&q=80"} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" alt="Product" />
                                                                        </div>
                                                                        <div className="flex-1 space-y-1">
                                                                            <p className="font-black text-primary tracking-tight">{item.product?.name}</p>
                                                                            <div className="flex gap-2">
                                                                                {item.size && <Badge variant="outline" className="text-[8px] font-black border-gold/10 text-gold bg-cream/50 px-1.5 py-0">SIZE: {item.size}</Badge>}
                                                                                {item.color && <Badge variant="outline" className="text-[8px] font-black border-gold/10 text-gold bg-cream/50 px-1.5 py-0">COLOR: {item.color}</Badge>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right flex flex-col items-end gap-1">
                                                                            <p className="font-black text-primary">₦{item.price.toLocaleString()}</p>
                                                                            <p className="text-[10px] font-black text-muted-foreground bg-primary/5 px-2 py-0.5 rounded-full">QTY: {item.quantity}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Ledger */}
                                                        <div className="bg-primary p-8 rounded-3xl text-primary-foreground shadow-2xl relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                                            <div className="space-y-3 relative z-10">
                                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                                                    <span>Subtotal</span>
                                                                    <span>₦{selectedOrder?.totalAmount.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                                                    <span>Logistic Processing</span>
                                                                    <span>₦0.00</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-3xl font-black tracking-tighter pt-5 border-t border-white/10 mt-5">
                                                                    <span>TOTAL LEVY</span>
                                                                    <span className="text-gold">₦{selectedOrder?.totalAmount.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter className="gap-3 pt-4 border-t border-gold/5">
                                                        <Button variant="ghost" className="rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-gold/5 focus:ring-0">
                                                            <Printer className="h-3 w-3 mr-2" /> Download Bill
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button className="rounded-xl bg-gold hover:bg-gold/90 text-[10px] font-black tracking-widest uppercase px-8 shadow-lg shadow-gold/20">Update Lifecycle</Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="rounded-2xl border-gold/10 p-2 shadow-2xl backdrop-blur-lg bg-white/90 w-56">
                                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground p-3">Lifecycle Phase</DropdownMenuLabel>
                                                                {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                                                                    <DropdownMenuItem key={status} className="p-3 font-bold text-xs rounded-xl focus:bg-gold/10 focus:text-gold cursor-pointer" onClick={() => handleUpdateStatus(selectedOrder.id, status, "order")}>
                                                                        Mark as {status}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:text-gold rounded-lg h-8 w-8 transition-colors">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-gold/10 shadow-2xl overflow-hidden p-1 backdrop-blur-lg bg-white/90 flex flex-col gap-1 w-48">
                                                    <DropdownMenuItem className="p-3 font-bold text-xs rounded-xl focus:bg-gold/5 focus:text-gold cursor-pointer" onClick={() => handleUpdateStatus(order.id, "PAID", "payment")}>
                                                        Verify Payment (Override)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 font-bold text-xs rounded-xl focus:bg-gold/5 focus:text-gold cursor-pointer" onClick={() => handleUpdateStatus(order.id, "SHIPPED", "order")}>
                                                        Authorize Shipping
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gold/5" />
                                                    <DropdownMenuItem className="p-3 font-bold text-xs rounded-xl text-destructive focus:bg-destructive/10 cursor-pointer" onClick={() => handleUpdateStatus(order.id, "CANCELLED", "order")}>
                                                        Revoke Order
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-[400px] text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="h-20 w-20 bg-secondary/30 rounded-full flex items-center justify-center mb-2">
                                                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No order transactions found</p>
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
