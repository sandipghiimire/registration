import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout Successfully!!",
      success: true,
    });

    response.cookies.delete("token");

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Unable to logout!!" }, { status: 400 });
  }
}
