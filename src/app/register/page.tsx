"use client";
import Link from "next/link";
import { NextResponse } from "next/server";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
    const [firstname, setFirstname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');

    const handleRegistration = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent the form from submitting and reloading the page

        // Validate password match
        if (password !== repassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstname,
                    middleName: middlename,
                    lastName: lastName,
                    gender: gender,
                    dob: dob,
                    email: email,
                    mobile: phone,
                    password: password,
                    confirmPassword: repassword,
                }),
            });
            const userData = await response.json();
            if (response.ok) {
                alert("User Created Successfully!!");
                // Optionally, redirect to the login page
                window.location.href = '/login';
            } else {
                alert("Failed to create user: " + (userData.message || "Unknown error"));
            }
            return NextResponse.json({data:userData});
        } catch (error: any) {
            console.error("Error during registration:", error);
            toast.error(error.message)
            alert("An error occurred while registering. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-full bg-blue-200">
            <div id="register" className="w-[800px] bg-blue-100 px-10 pb-10 text-black rounded-lg shadow-lg">
                <div className="flex justify-center items-center p-5 font-semibold">Register</div>
                <form onSubmit={handleRegistration} className="registration-container grid grid-cols-2 gap-4">
                    <div id="firstname" className="flex flex-col">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="border-2 border-gray-300 p-2"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    <div id="middlename" className="flex flex-col">
                        <label htmlFor="middlename">Middle Name</label>
                        <input
                            type="text"
                            placeholder="Middle Name"
                            className="border-2 border-gray-300 p-2"
                            value={middlename}
                            onChange={(e) => setMiddlename(e.target.value)}
                        />
                    </div>
                    <div id="lastname" className="flex flex-col">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="border-2 border-gray-300 p-2"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div id="gender" className="flex flex-col">
                        <label htmlFor="gender">Gender</label>
                        <select
                            name="gender"
                            id="gender"
                            className="border-2 border-gray-300 p-2 text-black"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div id="dob" className="flex flex-col">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            placeholder="Select your DOB"
                            className="border-2 border-gray-300 p-1"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                    </div>
                    <div id="email" className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="border-2 border-gray-300 p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div id="phone" className="flex flex-col">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="number"
                            placeholder="Phone"
                            className="border-2 border-gray-300 p-2"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div id="password" className="flex flex-col">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="border-2 border-gray-300 p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div id="reenter" className="flex flex-col">
                        <label htmlFor="reenter">Re-enter Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter"
                            className="border-2 border-gray-300 p-2"
                            value={repassword}
                            onChange={(e) => setRePassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-white mt-5 col-span-2">
                        Submit
                    </button>
                </form>
                <div className="flex justify-center items-center mt-5">
                    <Link href="/login" className="text-blue-600 underline">
                        Already have an account? Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}