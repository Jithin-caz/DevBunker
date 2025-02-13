import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import jwt from "jsonwebtoken";

// GET comments for a post
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;
  await dbConnect();
  try {
    const comments = await Comment.find({ post: id }).populate(
      "author",
      "username"
    );
    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching comments", error: error.message },
      { status: 500 }
    );
  }
}

// POST a new comment on a post
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;
  await dbConnect();
  try {
    // Authenticate
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

    const { content, parentComment } = await request.json();
    if (!content)
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );

    const newComment = new Comment({
      post: id,
      content,
      parentComment: parentComment || null,
      author: user.userId,
    });
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
