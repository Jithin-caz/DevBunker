import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import jwt from "jsonwebtoken";

export async function PUT(
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

    const comment = await Comment.findById(id);
    if (!comment)
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    if (comment.author.toString() !== user.userId)
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const { content } = await request.json();
    comment.content = content || comment.content;
    comment.updatedAt = new Date();
    await comment.save();
    return NextResponse.json(comment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function DELETE(
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

    const comment = await Comment.findById(id);
    if (!comment)
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    if (comment.author.toString() !== user.userId)
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    await comment.deleteOne();
    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
