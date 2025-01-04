import React from 'react'
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-600">
            <div className="bg-blue-600 text-black px-10 py-6 rounded shadow-2xl w-96 space-y-4 h-96 ">
                <h1 className="text-3xl font-bold text-center text-white">SignUp</h1>
                <form>
                    <div className="flex flex-col pb-2">
                        <label className='text-white'>Name</label>
                        <input className='rounded bg-green-200 h-8 mt-2 px-3' type="text" placeholder='John Doe'/>
                        <label className='text-white'>Email</label>
                        <input className='rounded bg-green-200 h-8 mt-2 px-3' type="email" placeholder='example@gmail.com' />
                        <label className='text-white'>Password</label>
                        <input className='rounded bg-green-200 h-8 mt-2 px-3' type="password" placeholder='Password@123' />
                    </div>
                    <button className="bg-slate-700 text-white p-2 rounded hover:bg-black mt-4 w-full font-bold">
                        Sign Up
                    </button>
                    <p className='text-center'>
                        Already have an account? <Link to="/" className='text-white'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
  )
}

export default Signup