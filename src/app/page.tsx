"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


interface Posts {
  title: string;
  content: string;
  replies: string[];
}

const posts: Posts[] = [
  {
    title: "a lot of content goes here a lot of content goes here a lot of content goes here a lot of content goes here",
    content: "This is the content of post 1.",
    replies: ["Reply 1 to Posts 1", "Reply 2 to Posts 1"],
  },
  {
    title: "Posts 2",
    content: "This is the content of post 2.",
    replies: ["Reply 1 to Posts 2"],
  },
  {
    title: "Posts 3",
    content: "This is the content of post 3.",
    replies: ["Reply 1 to Posts 3", "Reply 2 to Posts 3", "Reply 3 to Posts 3"],
  },
  {
    title: "a lot of content goes here a lot of content goes here a lot of content goes here a lot of content goes here",
    content: "This is the content of post 1.",
    replies: ["Reply 1 to Posts 1", "Reply 2 to Posts 1"],
  },
  {
    title: "Posts 2",
    content: "This is the content of post 2.",
    replies: ["Reply 1 to Posts 2"],
  },
  {
    title: "Posts 3",
    content: "This is the content of post 3.",
    replies: ["Reply 1 to Posts 3", "Reply 2 to Posts 3", "Reply 3 to Posts 3"],
  },
  {
    title: "a lot of content goes here a lot of content goes here a lot of content goes here a lot of content goes here",
    content: "This is the content of post 1.",
    replies: ["Reply 1 to Posts 1", "Reply 2 to Posts 1"],
  },
  {
    title: "Posts 2",
    content: "This is the content of post 2.",
    replies: ["Reply 1 to Posts 2"],
  },
  {
    title: "Posts 3",
    content: "This is the content of post 3.",
    replies: ["Reply 1 to Posts 3", "Reply 2 to Posts 3", "Reply 3 to Posts 3"],
  },
];
export default function Home() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
     
    <div className="  grid md:grid-cols-7 bg-red w-full min-h-dvh">
      <div className=" relative w-full col-span-7 md:col-span-2">
      <div className=" h-full bg-fixed border-b-4 border-r-0 md:border-r-4 shadow-xl md:border-b-0 border-offwhite
      bg-[url('https://i.pinimg.com/736x/bd/04/4c/bd044c5a81cfcd36ef59e3a06aa4c6d0.jpg')] 
      md:bg-[url('https://i.pinimg.com/736x/bd/04/4c/bd044c5a81cfcd36ef59e3a06aa4c6d0.jpg')]
      //  bg-contain
    bg-center  bg-black  min-h-20">
      </div>
      <div className=" w-full h-full bg-black absolute top-0 opacity-40 backdrop-blur-2xl"></div>
      </div>
     
    <div className="col-span-7 md:col-span-5">
    <div className="max-w-4xl mx-auto mt-6 space-y-4 p-2">
        {posts.map((post, index) => (
          <div key={index} className="flex relative">
            {/* Round Icon - Centered vertically */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                <span className="text-background font-bold">
                  {post.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Collapsible Section with left padding for icon */}
            <div className="flex-1 bg-background border-b border-orange p-4 py-8 rounded shadow-md ml-14">
              {/* Heading */}
              <div
                className="flex justify-between gap-1 items-center cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                <h2 className="text-lg text-primaryLight font-medium w-fit">{post.title}</h2>
                {openSection === index ? (
                  <ChevronUp className="w-5 h-5 text-primaryLight transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primaryLight transition-transform duration-300" />
                )}
              </div>

              {/* Collapsible Content */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openSection === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-2">
                    <p className="text-primaryLight">{post.content}</p>
                    <div className="mt-3 border-t pt-2">
                      <h3 className="text-sm font-semibold text-gray-700">Replies:</h3>
                      <ul className="mt-1 space-y-1">
                        {post.replies.map((reply, replyIndex) => (
                          <li key={replyIndex} className="text-sm text-offwhite">
                            • {reply}
                          </li>
                        ))}
                      </ul>
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
