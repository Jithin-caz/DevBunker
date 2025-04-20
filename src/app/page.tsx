"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "./context/AuthContext";
//import { io, Socket } from "socket.io-client";
import Loading from "./loading"; // import your loading animation component

interface Post {
  _id: string; 
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
  const[showSeeMore,setShowSeeMore]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const { token, user } = useAuth();
  console.log("token is " + token);
  console.log("user is " + user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Map of post id to its fetched comments.
  const [comments, setComments] = useState<{ [id: string]: Comment[] }>({});
  const [openSection, setOpenSection] = useState<number | null>(null);
  // loading state for API calls (e.g. fetching posts/other data)
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);

  // let socket: Socket;
  // useEffect(() => {
  //   fetch("/api/socket");

  //   socket = io(); // defaults to same origin

  //   socket.on("new-post", (data) => {
  //     console.log("New post received:", data);
  //     setPosts((prevPosts) => [...prevPosts, data]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  
  useEffect(() => {
    let hasScrolledToBottom = false;
    const thresholdBottom = 50; // pixels from bottom to consider as "scrolled to bottom"
    const thresholdTop = 50;    // pixels from top to consider as "at top"
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      
      // Check if user reached near the bottom
      if (scrollTop + windowHeight >= scrollHeight - thresholdBottom) {
        hasScrolledToBottom = true;
      }
      // Once the user has scrolled to bottom and then goes full to the top, refresh.
      if (scrollTop <= thresholdTop && hasScrolledToBottom) {
        window.location.reload();
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const fetchPosts = async (page:number=1) => {
    setLoadingPosts(true);
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=10`);
      if (response.ok) {
        const datafetched = await response.json();
        const data=datafetched.posts
        console.log("Fetched posts:", data);
        const transformedPosts = data.map((p: Post) => ({
          _id: p._id,
          title: p.title,
          content: p.content,
          category: p.category,
          author: p.author,
          votes: p.votes,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        if(posts.length===0)
        {
          setPosts(transformedPosts);
          setShowSeeMore(true)
        }
       
      else
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post._id));
        const filteredPosts = transformedPosts.filter((post:Post) => !existingIds.has(post._id));
        return [...prevPosts, ...filteredPosts];
      });
      if(data.length==0)
      {
        setShowSeeMore(false)}
      }
     
      setCurrentPage(currentPage+1)
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
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
    fetchPosts(currentPage);
  }, []);

  const toggleSection = (index: number) => {
    if (openSection !== index) {
      const postId = posts[index]._id;
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
        setReply('');
        fetchComments(postId);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display a loading animation while posts are being fetched
  if (loadingPosts) {
    return <Loading />;
  }

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
              <div key={post._id} className="flex relative">
                {/* Round Icon */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className={`w-10 h-10 rounded-full border ${index%2==0?"border-yellow-600":"border-orange"}  flex items-center justify-center flex-shrink-0`}>
                    <span className="text-background font-bold">
                        {post.category.toLowerCase().startsWith("web") && "🌐"}
                        {post.category.toLowerCase().startsWith("ai") && "🤖"}
                        {post.category.toLowerCase().startsWith("app") && "📱"}
                        {post.category.toLowerCase().startsWith("error") && "❌"}
                    </span>
                  </div>
                </div>
                
                {/* Collapsible Section */}
                <div className={`flex-1 bg-background border-b ${index%2==0?"border-yellow-600":"border-orange"}  p-4 py-8 rounded shadow-lg ml-14`}>
                  {/* Heading */}
                  <div className="flex justify-between gap-1 items-center cursor-pointer"
                       onClick={() => toggleSection(index)}>
                    <h2 className="text-lg text-primaryLight font-medium w-fit"> {post.title}</h2>
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
                            {comments[post._id] && comments[post._id].length > 0 ? (
                              comments[post._id].map((reply) => (
                                <li key={reply._id} className="text-sm text-offwhite">
                                  • {reply.content}
                                </li>
                              ))
                            ) : (
                              <li key={`${post._id}-no-replies`} className="text-sm text-offwhite">
                                No replies yet
                              </li>
                            )}
                          </ul>

                          {user ? (
                            <form onSubmit={(e) => handleReplyFormSubmit(e, post._id)} className="w-full mt-5">
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
                          ) : (
                            <div className="text-white">login to comment on this post</div>
                          )}
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            ))}
           {showSeeMore&& <button onClick={()=>fetchPosts(currentPage)} className="text-center w-full text-orange font-semibold text-lg">see more</button>}
          </div>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        title="Fetch new posts"
        className="fixed bottom-8 right-8 bg-orange text-black font-bold text-lg rounded-5 w-12 h-12 flex items-center justify-center shadow-lg"
      >
        F
      </button>
    </div>
  );
}