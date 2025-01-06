import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { handleError, handleSuccess } from '../utils';

const Signup = () => {

  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = signUpInfo;
    if (!name || !email || !password) {
      return handleError("Enter all fields");
    }

    try {
      const url = "http://localhost:8080/auth/register";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      });
      const data = await response.json();
      const { success, message, error } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(data);
    } catch (error) {

    }


    //   if (response.ok) {
    //     alert(data.message);
    //   } else {
    //     alert(data.message || "Signup failed");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("An error occurred during signup");
    // }
  };

  const [signUpInfo, setSignUpInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignUpInfo = { ...signUpInfo };
    copySignUpInfo[name] = value;
    setSignUpInfo(copySignUpInfo);
  }
  console.log("Signup Info->", signUpInfo);
  // this is the signup page

  return (
    <div className="flex justify-center items-center h-screen bg-gray-600">
      <div className="bg-blue-600 text-black px-10 py-6 rounded shadow-2xl w-96 space-y-4 h-96 ">
        <h1 className="text-3xl font-bold text-center text-white">SignUp</h1>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col pb-2">
            <label className='text-white'>Name</label>
            <input onChange={handleChange} className='rounded bg-green-200 h-8 mt-2 px-3'
              type="text"
              name="name"
              placeholder='John Doe'
              value={signUpInfo.name}
            />
            <label className='text-white'>Email</label>
            <input onChange={handleChange} className='rounded bg-green-200 h-8 mt-2 px-3'
              type="email"
              name="email"
              placeholder='example@gmail.com'
              value={signUpInfo.email}
            />
            <label className='text-white'>Password</label>
            <input onChange={handleChange} className='rounded bg-green-200 h-8 mt-2 px-3'
              type="password"
              name="password"
              placeholder='Password@123'
              value={signUpInfo.password}
            />
          </div>
          <button className="bg-slate-700 text-white p-2 rounded hover:bg-black mt-4 w-full font-bold">
            Sign Up
          </button>
          <p className='text-center'>
            Already have an account? <Link to="/login" className='text-white'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup