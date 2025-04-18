import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const post = searchParams.get("post");

    if (!post) {
      return NextResponse.json(
        { message: "Missing post in query params" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ post });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;

  await dbConnect();
  try {
    // Authenticate using Firebase token verification
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

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Compare the comment's author (stored as a Firebase UID) with the verified UID
    if (comment.author.toString() !== user.uid) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const { content } = await request.json();
    comment.content = content || comment.content;
    comment.updatedAt = new Date();
    await comment.save();

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  // Await dynamic parameters before destructuring
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;

  await dbConnect();
  try {
    // Authenticate using Firebase token verification
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

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Compare the comment's author with the verified Firebase UID
    if (comment.author.toString() !== user.uid) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await comment.deleteOne();
    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}
