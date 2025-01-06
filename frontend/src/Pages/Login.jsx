import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils'; // Ensure these utility functions are correctly imported

const Login = () => {
    const navigate = useNavigate();
    const [logInInfo, setLogInInfo] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = logInInfo;
        if (!email || !password) {
            return handleError("Enter all fields");
        }

        try {
            const url = "http://localhost:8080/login"; // Ensure this URL is correct
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(logInInfo),
            });

            const data = await response.json();
            const { success, message, jwtToken, name, error } = data;

            if (success) {
                handleSuccess(message);
                localStorage.setItem("jwtToken", jwtToken);
                localStorage.setItem("name", name);
                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            } else if (error) {
                const details = error?.details[0]?.message || "An error occurred";
                handleError(details);
            } else if (!success) {
                handleError(message);
            }

            console.log(data);
        } catch (err) {
            handleError("Login failed. Please try again later.");
            console.error("Error during login:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogInInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-600">
            <div className="bg-blue-600 text-black px-10 py-10 rounded-lg shadow-2xl w-96 space-y-4 h-96">
                <h1 className="text-3xl font-bold text-center text-white">Log In</h1>
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col pb-2">
                        <label className='text-white'>Email</label>
                        <input
                            className='rounded bg-green-200 h-8 mt-2 px-3'
                            type="email"
                            placeholder='example@gmail.com'
                            name='email'
                            value={logInInfo.email}
                            onChange={handleChange}
                        />
                        <label className='text-white mt-4'>Password</label>
                        <input
                            className='rounded bg-green-200 h-8 mt-2 px-3'
                            type="password"
                            placeholder='Password@123'
                            name='password'
                            value={logInInfo.password}
                            onChange={handleChange}
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
