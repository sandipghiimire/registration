import { NextResponse } from "next/server";
import { connectionStr } from "../../lib/db";
import Register from "../../lib/models/register";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        // await mongoose.connect(connectionStr);
        await connectionStr();
        
        const reqBody = await req.json();
        const { isAdmin, firstName, middleName, lastName, email, password, dob, mobile, confirmPassword, gender } = reqBody;


        const emailExist = await Register.findOne({ email });
        if (emailExist) {
            return NextResponse.json({ message: "User already Exist!!" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const register = new Register({
            firstName,
            middleName,
            lastName,
            gender,
            dob,
            mobile,
            email,
            password: hashPassword,
            confirmPassword,
            isAdmin
        });
        await register.save();

        return NextResponse.json({ message: "User registered successfully", success: true }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectionStr();
        const register = await Register.find();
        // console.log("message", register);
        return NextResponse.json({ data: register, success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Database Connection Error!!" }, { status: 500 });
    }
}

