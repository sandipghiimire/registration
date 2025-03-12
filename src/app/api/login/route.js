import { NextResponse } from "next/server";
import { connectionStr } from "../../lib/db";
import Register from "../../lib/models/register";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectionStr();

        const reqBody = await req.json();
        const { email, password } = reqBody;

        const user = await Register.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid Credentials!" }, { status: 400 });
        }

        const hashPassword = await bcrypt.compare(password, user.password);

        if (!hashPassword) {
            return NextResponse.json({ message: "Invalid Credentials!" }, { status: 400 });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        console.log(token);

        console.log("Generate Token:", token)
        // Send token in response body (no cookies)
        return NextResponse.json({
            message: "Login Successfully!!",
            success: true,
            token: token, // Send token in response
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: "Unable to get the data" }, { status: 500 });
    }
}
