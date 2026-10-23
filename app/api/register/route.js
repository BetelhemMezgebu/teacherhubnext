import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || password.length < 8) {
      return NextResponse.json(
        { error: "Enter your name, a valid email, and a password of at least 8 characters." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 12);

    await users.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 },
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Unable to create your account. Please try again." },
      { status: 500 },
    );
  }
}
