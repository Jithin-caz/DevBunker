"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "./context/AuthContext";

interface Post {
  _id?: string; 
  id: string; 
  title: string;
  content?: string;
  category: string;
  author: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Map of post id to its fetched comments.
  const [comments, setComments] = useState<{ [id: string]: Comment[] }>({});
  const [openSection, setOpenSection] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        // Map _id to id for each post
        const transformedPosts = data.map((p: Post) => ({
          id: p._id,
          title: p.title,
          content: p.content,
          category: p.category,
          author: p.author,
          votes: p.votes,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments((prev) => ({ ...prev, [postId]: data }));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleSection = (index: number) => {
    // If opening the section, fetch comments for that post
    if (openSection !== index) {
      const postId = posts[index].id;
      fetchComments(postId);
      setOpenSection(index);
    } else {
      setOpenSection(null);
    }
  };

  const handleReplyFormSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: reply,
          //@ts-expect-error "user is not defined"
          author: user._id, // Passing firebase uid
        })
      });

      if (response.ok) {
        setReply('');   // Clear the input
        // Refresh the comments list for this post
        fetchComments(postId);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid md:grid-cols-7 bg-red w-full min-h-dvh">
        <div className="relative w-full col-span-7 md:col-span-2">
          <div className="h-full bg-fixed border-b-4 border-r-0 md:border-r-4 shadow-xl md:border-b-0 border-offwhite
            bg-[url('https://i.pinimg.com/736x/bd/04/4c/bd044c5a81cfcd36ef59e3a06aa4c6d0.jpg')] 
            md:bg-[url('https://i.pinimg.com/736x/bd/04/4c/bd044c5a81cfcd36ef59e3a06aa4c6d0.jpg')]
            bg-center bg-black min-h-20">
          </div>
          <div className="w-full h-full bg-black absolute top-0 opacity-40 backdrop-blur-2xl"></div>
        </div>
         
        <div className="col-span-7 md:col-span-5">
          <div className="max-w-4xl mx-auto mt-6 space-y-7 p-2">
            {posts.map((post, index) => (
              <div key={post.id} className="flex relative">
                {/* Round Icon - Centered vertically */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                    <span className="text-background font-bold">
                      {post.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Collapsible Section */}
                <div className="flex-1 bg-background border-b border-orange p-4 py-8 rounded shadow-lg ml-14">
                  {/* Heading */}
                  <div className="flex justify-between gap-1 items-center cursor-pointer"
                       onClick={() => toggleSection(index)}>
                    <h2 className="text-lg text-primaryLight font-medium w-fit">{post.title}</h2>
                    {openSection === index ? (
                      <ChevronUp className="w-5 h-5 text-primaryLight transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primaryLight transition-transform duration-300" />
                    )}
                  </div>

                  {/* Collapsible Content */}
                  <div className={`grid transition-all duration-300 ease-in-out ${openSection === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="mt-2">
                        <p className="text-primaryLight">{post.content}</p>
                        <div className="mt-3 border-t pt-4">
                          <h3 className="text-sm font-semibold text-gray-700">Replies:</h3>
                          <ul className="mt-1 space-y-1">
                            {comments[post.id] && comments[post.id].length > 0 ? (
                              comments[post.id].map((reply) => (
                                <li key={reply._id} className="text-sm text-offwhite">
                                  • {reply.content}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-offwhite">No replies yet</li>
                            )}
                          </ul>
                          <form onSubmit={(e) => handleReplyFormSubmit(e, post.id)} className="w-full mt-5">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-4 py-2 bg-background text-primaryLight border border-orange rounded-md focus:outline-none focus:ring-2 focus:ring-orange/50"
                                disabled={isSubmitting}
                              />
                              <button
                                type="submit"
                                disabled={isSubmitting || !reply.trim()}
                                className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? 'Sending...' : 'Reply'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
