"use client";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Make sure to import toast

export default function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("All fields are required!");
            return;
        }

        try {
            const response = await fetch(`/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const userData = await response.json();

            if (!response.ok) {
                throw new Error(userData.message || "Invalid Credentials");
            }

            if (response.ok) {
                localStorage.setItem('token', userData.token);
                router.push('/dashboard'); // Client-side redirect
              } else {
                toast.error("Token missing in response!");
            }
        } catch (error: any) {
            console.error("Error during login:", error);
            toast.error(error.message || "An error occurred. Please try again.");
        }
    };


    return (
        <div className="flex justify-center items-center h-full bg-blue-200">
            <div className="w-[400px] bg-blue-100 px-10 pb-10 text-black rounded-lg shadow-lg">
                <div className="text-center p-5 font-semibold">Login Page</div>
                <form onSubmit={handleRegistration} className="grid gap-4">
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="border p-2 w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="border p-2 w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg">
                        Login
                    </button>
                </form>
                <div className="text-center mt-5">
                    <Link href="/register" className="text-blue-600 underline">
                        Don't have an account? Sign Up here
                    </Link>
                </div>
            </div>
        </div>
    );
}
