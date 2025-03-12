'use client';

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Profile() {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        dob: "",
        isAdmin: false,
        _id: "",
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/me");
            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            console.log(data)
            setUserData({
                firstName: data.data.firstName,
                lastName: data.data.lastName,
                mobile: data.data.mobile,
                email: data.data.email,
                dob: data.data.dob,
                isAdmin: data.data.isAdmin,
                _id: data.data._id,
            });
        } catch (error) {
            console.error("Unable to fetch user data", error);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "GET",
            });

            const data = await res.json();

            if (data.success) {
                router.push("/login");
            } else {
                alert("Unable to logout");
            }
        } catch (error) {
            console.error("Logout failed", error);
            alert("Logout failed");
        }
    };

    return (
        <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 bg-slate-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Profile Overview</h1>
                    <p className="text-gray-600 text-lg">Personal information and account details</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            <div className="mx-10 lg:w-[800px] sm:w-[500px]">
                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                                    Personal Details
                                </h2>
                                {["firstName", "lastName", "dob", "mobile"].map((field) => (
                                    <div key={field} className="space-y-1">
                                        <label className="block text-base font-medium text-gray-700">
                                            {field === "dob" ? "Date of Birth" : field.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <div className="text-lg text-gray-900 p-2 border-b border-gray-200">
                                            {field === "dob" ? new Date(userData[field]).toLocaleDateString() : userData[field]}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6 text-left">
                                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">
                                    Account Information
                                </h2>
                                {["email", "isAdmin"].map((field) => (
                                    <div key={field} className="space-y-1">
                                        <label className="block text-base font-medium text-gray-700">
                                            {field === "isAdmin" ? "Account Type" : field.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <div className="text-lg text-gray-900 p-2 border-b border-gray-200">
                                            {field === "isAdmin" ? (userData[field] ? "Administrator" : "Standard User") : userData[field]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 flex mt-8">
                <Link href={`/profile/${userData._id}`} passHref>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                        <Edit className="h-5 w-5" />
                        Edit Profile
                    </button>
                </Link>
            </div>
        </div>
    );
}
