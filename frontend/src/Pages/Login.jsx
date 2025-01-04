import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Signup from './Signup';

const Login = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (response.status === 200) {
                alert("Login Successful");
            } else {
                alert(data.error);
            }
        }
        catch (err) {
            console.log("Error:", err);
            alert("Login Failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-600">
            <div className="bg-blue-600 text-black px-10 py-10 rounded-lg shadow-2xl w-96 space-y-4 h-96 ">
                <h1 className="text-3xl font-bold text-center text-white">Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col pb-2">
                        <label className='text-white'>Email</label>
                        <input className='rounded bg-green-200 h-8 mt-2 px-3' type="email" placeholder='example@gmail.com' />
                        <label className='text-white mt-4'>Password</label>
                        <input className='rounded bg-green-200 h-8 mt-2 px-3' type="password" placeholder='Password@123' />
                    </div>
                    <button className="bg-slate-700 text-white p-2 rounded hover:bg-black mt-4 w-full font-bold">
                        Log In
                    </button>
                    <p className='text-center p-4'>
                        Don't have an account? <Link to="/signup" className='text-white'>Click Here</Link>
                    </p>

                </form>
            </div>
        </div>
    )
}

export default Login