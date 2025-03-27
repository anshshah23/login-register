import { NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

interface LoginRequestBody {
    email: string;
    password: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        const reqBody: LoginRequestBody = await req.json();
        const { email, password } = reqBody;

        console.log("Login Attempt:", reqBody);

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        // Compare password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const tokenData = { id: user._id, email: user.email }; 

        // Generate JWT Token
        const token = jwt.sign( tokenData, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });
        const response = NextResponse.json({ message: "Login successful", token, success: true });

        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (err: any) {
        console.error("Login Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
