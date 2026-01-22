"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem("ryanella_admin_token");
        const savedUser = localStorage.getItem("ryanella_admin_user");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            // Set default auth header for axios
            axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("ryanella_admin_token", token);
        localStorage.setItem("ryanella_admin_user", JSON.stringify(user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        router.push("/admin/dashboard");
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("ryanella_admin_token");
        localStorage.removeItem("ryanella_admin_user");
        delete axios.defaults.headers.common["Authorization"];
        router.push("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
