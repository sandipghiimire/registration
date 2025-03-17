import { NextResponse } from "next/server";
import { connectionStr } from "../../lib/db";
import Register from "../../lib/models/register";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Class from "../../lib/models/class";


export async function POST(req) {
    try {
        await connectionStr();
        const reqBody = await req.json();
        const { 
            isAdmin = false,
            firstName, 
            middleName,
            lastName, 
            email, 
            password, 
            confirmPassword, 
            classId, 
            dob, 
            mobile, 
            gender 
        } = reqBody;

        // ✅ Required fields check
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'dob', 'gender'];
        const missingFields = requiredFields.filter(field => !reqBody[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // ✅ Password match check
        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: "Password and confirmation do not match" },
                { status: 400 }
            );
        }

        // ✅ Email duplicate check
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with this email" },
                { status: 409 }
            );
        }

        // ✅ Class validation for students (non-admin)
        let classArray = [];
        if (!isAdmin) {
            if (!classId) {
                return NextResponse.json(
                    { message: "Class selection is required for student accounts" },
                    { status: 400 }
                );
            }

            // ✅ Check if classId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(classId)) {
                return NextResponse.json(
                    { message: "Invalid classId format. Must be a valid ObjectId." },
                    { status: 400 }
                );
            }

            // ✅ Check if class exists in the database
            const validClass = await Class.findById(classId);
            if (!validClass) {
                return NextResponse.json(
                    { message: "Invalid class selected. Class not found in database." },
                    { status: 404 }
                );
            }

            // ✅ Store classId as an array
            classArray = [classId];
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new user
        const newUser = new Register({
            firstName,
            middleName,
            lastName,
            gender,
            dob,
            mobile,
            email,
            password: hashedPassword,
            isAdmin,
            classes: classArray, // ✅ Store classId as array
            createdAt: new Date().toISOString()
        });

        await newUser.save();

        // ✅ Update class with student reference
        if (!isAdmin && classId) {
            await Class.findByIdAndUpdate(
                classId,
                { $addToSet: { students: newUser._id } },
                { new: true }
            );
        }

        return NextResponse.json(
            { 
                message: "User registered successfully", 
                success: true,
                userId: newUser._id 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        await connectionStr();
        const register = await Register.find().populate("classes"); // ✅ Class details देखिन्छ
        // const register = await Register.find();
        // console.log("message", register);
        return NextResponse.json({ data: register, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Database Connection Error!!" }, { status: 500 });
    }
}

