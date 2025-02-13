import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({}).populate("author", "username");
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching posts", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    // Get and validate auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "No authorization header" },
        { status: 401 }
      );
    const token = authHeader.split(" ")[1];
    if (!token)
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    let user: any;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err: any) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title)
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );

    const newPost = new Post({
      title,
      content,
      author: user.userId,
    });
    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
