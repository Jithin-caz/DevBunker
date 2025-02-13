import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({}).populate("author", "username");
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts", error: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    // Get and validate auth token from Firebase
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "No authorization header" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }
    let user;
    try {
      user = await verifyFirebaseToken(token);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { title, content, category } = await request.json();
    if (!title || !category)
      return NextResponse.json(
        { message: "Title and category are required" },
        { status: 400 }
      );

    const newPost = new Post({
      title,
      content,
      category,
      author: user.uid,
    });
    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}
