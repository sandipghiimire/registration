import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.headers.get("cookie")?.split("authToken=")[1];

  if (!token) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    return NextResponse.json({ user: decoded });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
  }
}
