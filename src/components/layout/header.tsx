"use client";

import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/context/auth-context";

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b border-gold/10 bg-white/80 px-4 backdrop-blur-md lg:px-8">
            <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search anything..."
                        className="pl-10 h-10 border-none bg-secondary/50 rounded-xl focus-visible:ring-gold/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-gold rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold animate-pulse" />
                </Button>

                <div className="h-8 w-[1px] bg-gold/10 mx-1 lg:mx-2" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-1 hover:bg-secondary/50 rounded-full transition-all">
                            <Avatar className="h-8 w-8 border border-gold/20 shadow-sm">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
                                    {user?.name?.split(" ").map(n => n[0]).join("") || "AD"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                                <span className="text-sm font-semibold text-foreground">{user?.name || "Ryanella Admin"}</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{user?.role?.replace("_", " ") || "Super Admin"}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-gold/10 shadow-xl overflow-hidden">
                        <DropdownMenuLabel className="font-normal p-4 bg-cream/50">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || "Ryanella Admin"}</p>
                                <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email || "admin@ryanella.com"}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gold/5" />
                        <DropdownMenuItem className="p-3 cursor-pointer focus:bg-gold/10 focus:text-gold transition-colors">
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gold/5" />
                        <DropdownMenuItem
                            onClick={logout}
                            className="p-3 cursor-pointer text-destructive focus:bg-destructive/10 transition-colors"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
