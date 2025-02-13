import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

// GET a single post
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;
  await dbConnect();
  try {
    const post = await Post.findById(id).populate("author", "username");
    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching post", error: error },
      { status: 500 }
    );
  }
}

// UPDATE a post
export async function PUT(
  request: Request,
  context: { params: { id: string } }
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

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.author.toString() !== user.uid) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const { title, content, category } = await request.json();
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category; // update category if provided
    post.updatedAt = new Date();
    await post.save();
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}

// DELETE a post
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const resolvedParams = await Promise.resolve(context.params);
  const { id } = resolvedParams;
  await dbConnect();
  try {
    // Authenticate using Firebase token verification
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
    let user;
    try {
      user = await verifyFirebaseToken(token);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    if (post.author.toString() !== user.uid)
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    await post.deleteOne();
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
}
