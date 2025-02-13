import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

export async function POST(request: Request) {
  await dbConnect();
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    // Verify the token using Firebase Admin
    const decodedToken = await verifyFirebaseToken(token);

    // Check if user exists in MongoDB using Firebase UID
    let user = await User.findOne({ firebaseId: decodedToken.uid });
    if (!user) {
      // If the user doesn't exist, create a new record
      user = new User({
        firebaseId: decodedToken.uid,
        email: decodedToken.email,
        username: decodedToken.name || "Unnamed", // Fallback if name is missing
      });
      await user.save();
    }

    // Return the user data (optionally, you could generate a custom token or session here)
    return NextResponse.json(user, { status: user ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Authentication failed", error: error },
      { status: 401 }
    );
  }
}
