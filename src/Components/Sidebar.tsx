'use client';

import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutDashboard, Building2, WalletCards, Settings, User, NotebookText } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar({
    isOpen,
    toggleSidebar
}: {
    isOpen: boolean;
    toggleSidebar: () => void;
}) {
    const pathname = usePathname();
    const [data, setData] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        userData();
    }, []);

    const userData = async () => {
        try {
            const res = await fetch("/api/me");
            if (!res.ok) throw new Error('Failed to fetch');
            
            const dataUser = await res.json();
            setData(dataUser.data.firstName);
            setEmail(dataUser.data.email);
            setIsAdmin(dataUser.data.isAdmin); // Set admin status
        } catch (error) {
            console.error("Unable to fetch user data", error);
        }
    };

    // Navigation items configuration
    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Organization", href: "/organization", icon: Building2 },
        { name: "Broker", href: "/broker", icon: WalletCards },
        
        // Conditionally include Settings only for admins
        ...(isAdmin ? [{ name: "Class", href: "/classes", icon: NotebookText } ,{ name: "Settings", href: "/settings", icon: Settings }] : [])
    ];

    return (
        <div className={cn(
            "fixed top-0 left-0 h-full bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100",
            "transition-all duration-300 z-50 shadow-xl",
            isOpen ? "w-64" : "w-20"
        )}>
            <div className="h-full flex flex-col justify-between py-4">
                {/* Header Section */}
                <div>
                    {/* Logo & Toggle */}
                    <div className="flex items-center justify-between px-4 mb-6">
                        <div className={cn(
                            "overflow-hidden transition-all",
                            isOpen ? "w-32 opacity-100" : "w-0 opacity-0"
                        )}>
                            <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                YourLogo
                            </Link>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className={cn(
                                "p-2 hover:bg-slate-700 rounded-lg transition-colors",
                                "text-slate-300 hover:text-white"
                            )}
                            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 px-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl",
                                    "transition-all hover:bg-slate-700/50",
                                    pathname.startsWith(item.href) && "bg-blue-600/20 border-l-4 border-blue-400",
                                    isOpen ? "px-4" : "justify-center"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    pathname.startsWith(item.href) ? "text-blue-400" : "text-slate-400"
                                )} />
                                {isOpen && (
                                    <span className={cn(
                                        "text-sm font-medium",
                                        pathname.startsWith(item.href) ? "text-white" : "text-slate-300"
                                    )}>
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Profile Section */}
                <div className="border-t border-slate-700/50 mx-4 pt-4">
                    <Link href="/profile"> {/* Add a Link to the Profile page */}
                        <div className={cn(
                            "flex items-center gap-3 p-3 rounded-xl",
                            "transition-colors hover:bg-slate-700/50",
                            isOpen ? "px-4" : "justify-center"
                        )}>
                            <div className="bg-slate-700 p-2 rounded-full">
                                <User className="h-5 w-5 text-blue-400" />
                            </div>
                            {isOpen && (
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate">{data}</p>
                                    <p className="text-xs text-slate-400 truncate">{email}</p>
                                    {isAdmin && (
                                        <span className="text-xs text-green-400 mt-1 block">Admin</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}