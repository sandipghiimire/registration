import Subject from "../../lib/models/subject";
import { NextResponse } from "next/server";
import { connectionStr } from "../../lib/db";
import Class from "../../lib/models/class";

import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectionStr();

        // Parse form data
        const { name, code, creditHour, classId } = await req.json();

        if (!name || !code || !creditHour || !classId) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if class exists
        const classExists = await Class.findById(classId);
        if (!classExists) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // **Validate if code exists in Subject model**
        const subCode = await Subject.findOne({ code }); // ✅ Find by code instead of ObjectId
        if (subCode) {
            return NextResponse.json({ error: "Subject code already exists!" }, { status: 400 });
        }

        // Create new subject
        const newSubject = new Subject({
            name,
            code,
            creditHour,
            classes: [classId], // Store class ID
        });

        await newSubject.save();

        // ✅ Class मा Subject जोड्ने
        await Class.findByIdAndUpdate(classId, { $push: { subjects: newSubject._id } });

        return NextResponse.json(
            { message: "Subject added successfully", data: newSubject },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        await connectionStr();
        // Use the correct field `subjects` instead of `classes` in populate
        const subjects = await Subject.find().populate("classes"); // Populate class details
        return NextResponse.json({ subjects }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
