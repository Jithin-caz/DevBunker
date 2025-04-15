"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const createPost = async () => {
    if (!token) {
      console.log("User is not logged in.");
      return;
    }
    console.log("tk", token);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category }),
    });
    if (!res.ok) {
      console.error("Failed to create post");
    } else {
      const data = await res.json();
      console.log("Post created:", data);
    }
  };

  return (
    <div>
      <h3>Create a New Post</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={createPost}>Submit</button>
    </div>
  );
}
