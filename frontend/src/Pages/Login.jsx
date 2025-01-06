import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.MONGO_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                alert("Login Successful");
                // Optionally redirect the user
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Error:", err);
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
                        <input
                            className='rounded bg-green-200 h-8 mt-2 px-3'
                            type="email"
                            placeholder='example@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className='text-white mt-4'>Password</label>
                        <input
                            className='rounded bg-green-200 h-8 mt-2 px-3'
                            type="password"
                            placeholder='Password@123'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
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
    );
};

export default Login;
