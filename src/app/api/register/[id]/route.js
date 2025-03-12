import { NextResponse } from "next/server";
import { connectionStr } from "../../../lib/db";
import Register from "../../../lib/models/register";
import { ObjectId } from 'mongodb';
// import { verifyToken } from '@/lib/auth'; // Import the verifyToken function
// import { prisma } from '@/lib/prisma'; // Ensure prisma is imported
import cookie from 'cookie'; // Import the cookie library
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
        const id = url.pathname.split('/').pop(); // id URL बाट लिने

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const user = await Register.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    try {
        await connectionStr();

        const { id } = await params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid user ID format" },
                { status: 400 }
            );
        }

        const user = await Register.findById(id).select("-password -__v");

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "User fetched successfully",
                data: user,
                success: true
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
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
