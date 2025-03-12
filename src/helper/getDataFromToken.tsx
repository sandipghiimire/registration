import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("authToken")?.value || ""
        const decoded:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        // console.log(decoded);
        return decoded.id;
    } catch (error) {
        return NextResponse.json({
            message : "Unable to get token!"
        })
    }
}