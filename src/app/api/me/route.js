import { NextResponse } from "next/server";
import {getDataFromToken} from "../../../helper/getDataFromToken"
import Register from "../../lib/models/register";
import { connectionStr } from "../../lib/db";

export async function GET(req) {
    await connectionStr();
  try {
    const userId = await getDataFromToken(req);
    const user = await Register.findOne({_id: userId}).select("-password");
    return NextResponse.json({
        message: "User Found",
        data: user
    })
  } catch (error) {
    return NextResponse.json({error: error.message},{status: 400})
  }
}
