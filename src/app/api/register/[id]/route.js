import { NextResponse } from "next/server";
import { connectionStr } from "../../../lib/db";
import Register from "../../../lib/models/register";
import { ObjectId } from 'mongodb';
// import { verifyToken } from '@/lib/auth'; // Import the verifyToken function
// import { prisma } from '@/lib/prisma'; // Ensure prisma is imported
import cookie from 'cookie'; // Import the cookie library
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import Class from "../../../lib/models/class";

export async function PATCH(req) {
    await connectionStr(); // Connect to MongoDB

    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // Extract user ID from URL path

        const { firstName, middleName, lastName, isAdmin, email } = await req.json(); // Get data from the request body

        if (!email && typeof isAdmin !== 'boolean') {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await Register.findOne({ _id: new ObjectId(id) });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update the user in MongoDB
        const result = await Register.updateOne(
            { _id: new ObjectId(id) }, // Use ObjectId for MongoDB IDs
            {
                $set: { firstName, middleName, lastName, isAdmin, email }, // Update the name and email
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: 'No changes made' },
                { status: 400 }
            );
        }
        await user.save();

        return NextResponse.json({ message: 'User updated successfully' });

    } catch (error) {
        console.error('Error occurred during user update:', error);
        return NextResponse.json(
            { error: 'Failed to update user', details: error.message },
            { status: 400 }
        );
    }
}


export async function DELETE(req) {
    await connectionStr();

    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // ID extract गर्ने
        
        console.log("Request URL:", req.url);
        console.log("Extracted ID:", id);

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // 🔍 User खोज्ने
        const user = await Register.findById(id);
        console.log("User Found:", user);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 🛑 Student हो भने Class बाट पनि हटाउने
        if (!user.isAdmin) {
            const updatedClass = await Class.updateMany(
                { students: id },
                { $pull: { students: id } }
            );
            console.log("Updated Class:", updatedClass);
        }

        // ❌ User Delete गर्ने
        const deletedUser = await Register.findByIdAndDelete(id);
        console.log("Deleted User:", deletedUser);

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error in DELETE:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// ✅ Ensure TOKEN_SECRET is properly encoded
const tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) {
  throw new Error("TOKEN_SECRET is not defined in environment variables!");
}
const JWT_SECRET = new TextEncoder().encode(tokenSecret);

// ✅ Function to verify token
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

// ✅ Secure GET API (Only fetch user’s own data)
export async function GET(req, { params }) {
  try {
    // ✅ Extract token from httpOnly cookies
    const token = req.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    // ✅ Verify JWT token
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
    }

    await connectionStr();

    const { id } = await params;

    // ✅ Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    
    // console.log("THis is my id from database:",user.id)
    // console.log("And this is my id from the path name:", id)

    // ✅ Ensure the user can only fetch their own data
    if (user.id !== id) {
      return NextResponse.json({ error: "Forbidden: You can only access your own data" }, { status: 403 });
    }


    // ✅ Fetch user data, excluding password & __v field
    const userData = await Register.findById(id).select("-password -__v");

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User fetched successfully",
        data: userData,
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
    try {
        await connectionStr();
        const { id } = await params; // Fixed destructuring

        // Validate ID existence and format
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid or missing user ID" },
                { status: 400 }
            );
        }

        const data = await req.json();
        console.log(data);

        // Handle password update separately
        if (data.password) {
            return handlePasswordUpdate(id, data);
        }

        // Validate request body
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                { error: "Request body cannot be empty" },
                { status: 400 }
            );
        }

        // Regular profile update
        const updatedUser = await Register.findByIdAndUpdate(
            id,
            { $set: data }, // Fixed missing variable
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Profile updated", data: updatedUser, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update failed:", error);
        return NextResponse.json(
            { error: "Update failed", details: error.message },
            { status: 500 }
        );
    }
}

async function handlePasswordUpdate(id, { currentPassword, newPassword }) {
    // Validate password fields
    if (!currentPassword || !newPassword) {
        return NextResponse.json(
            { error: "Both passwords are required" },
            { status: 400 }
        );
    }

    const user = await Register.findById(id);
    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 401 }
        );
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return NextResponse.json(
        { message: "Password updated successfully", success: true },
        { status: 200 }
    );
}
