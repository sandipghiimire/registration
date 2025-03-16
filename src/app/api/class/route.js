import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import Class from "../../lib/models/class";
import Subject from "../../lib/models/subject";
import { connectionStr } from "../../lib/db"

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export async function POST(req) {
  try {
    await connectionStr();

    // Parse form data
    const form = await req.formData();
    const name = form.get("name")?.trim(); // Extra spaces हटाउने
    const subject = form.get("subject");
    const imageFile = form.get("image");

    if (!name || !imageFile) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    // **Case-insensitive search (Class को नाम पहिले नै छ कि छैन)**
    const findClass = await Class.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

    if (findClass) {
      return NextResponse.json({ error: "Class already exists" }, { status: 400 });
    }

    // Save image file
    const buffer = await imageFile.arrayBuffer();
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Folder create गर्ने
    }
    const filePath = path.join(uploadDir, imageFile.name);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const newClass = new Class({
      name,
      subject,
      image: `/uploads/${imageFile.name}`, // Save relative path
    });

    await newClass.save();

    return NextResponse.json({ message: "Class added successfully", data: newClass }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectionStr();

    // Populate subjects while fetching classes
    const classes = await Class.find().populate("subjects");

    return NextResponse.json({ success: true, data: classes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
