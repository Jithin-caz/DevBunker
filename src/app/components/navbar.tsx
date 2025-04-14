"use client";
import { User, LogOut, UserCircle,LogIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PopUpModal from "./postModal";
import handleGoogleSignIn from "../functions/handleGoogleSignIn";

const Navbar = () => {

  const [userData, setUserData] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    console.log(`${title}--${content}---${category}`)

    try {
      console.log(`token is ${userData.token}`)
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization':userData.token
        },
        body: JSON.stringify({
          title,
          category,
          content
        })
      });

      if (response.ok) {
        alert('posted')
        // Reset form
        form.reset();
        setIsOpen(false);
      } else {
        alert('not posted')
        // Handle error
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


const PostForm=()=>{
  return <form onSubmit={formSubmit} className="space-y-4">
  {/* Title */}
  <div>
    <label htmlFor="title" className="block text-sm font-medium text-primaryLight mb-1">
      Title
    </label>
    <input
       name="title"
       required
      type="text"
      id="title"
      className="w-full px-3 py-2 bg-background text-primaryLight border border-orange rounded-md focus:outline-none focus:ring-2 focus:ring-orange/50"
      placeholder="Enter post title"
    />
  </div>

  {/* Category Dropdown */}
  <div>
    <label htmlFor="category" className="block text-sm font-medium text-primaryLight mb-1">
      Category
    </label>
    <select
      name="category"
      required
      id="category"
      className="w-full px-3 py-2 bg-background text-primaryLight border border-orange rounded-md focus:outline-none focus:ring-2 focus:ring-orange/50"
    >
      <option value="" disabled>Select a category</option>
      <option value="web">Web</option>
      <option value="app">App</option>
      <option value="ai/ml">AI/ML</option>
      <option value="errors">Errors</option>
    </select>
  </div>

  {/* Content */}
  <div>
    <label htmlFor="content" className="block text-sm font-medium text-primaryLight mb-1">
      Content
    </label>
    <textarea
     name="content"
     required
      id="content"
      rows={6}
      className="w-full px-3 py-2 bg-background text-primaryLight border border-orange rounded-md focus:outline-none focus:ring-2 focus:ring-orange/50 resize-none"
      placeholder="Write your post content here..."
    />
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-3 pt-4">
    <button
      type="button"
      onClick={()=>setIsOpen(false)}
      className="px-4 py-2 text-sm text-primaryLight hover:text-orange transition-colors duration-200"
    >
      Cancel
    </button>
    <button
    disabled={isSubmitting}
      type="submit"
      className="px-4 py-2 text-sm bg-orange text-white rounded-md hover:bg-orange/90 transition-colors duration-200"
    >
      Post
    </button>
  </div>
</form>
}


  return (
    <>
     {/* <button className=" fixed bottom-5 right-5 w-14 shadow-2xl h-auto rounded-full bg-orange  z-50"><Plus className=" w-full h-auto text-primaryDark"/></button> */}
      <nav className="flex justify-around gap-10 items-center p-4 bg-primaryDark shadow-md sticky top-0 z-50 w-full">
        <div className="text-xl font-semibold">
          <span className="font-extrabold text-orange">DEV</span>{" "}
          <span className="font-bold text-offwhite">BUNKER</span>
        </div>
        <div className="flex justify-center gap-5 items-center">
          <button 
          disabled={!isLoggedIn}
            onClick={() => setIsOpen(true)}
            className={` flex px-2 py-1 rounded  bg-orange hover:text-orange hover:bg-primaryDark text-primaryDark duration-300 ease-in-out ${isLoggedIn ?' cursor-default':' cursor-not-allowed'}`}
          >
           {isLoggedIn?'create post':'Login to send post'}
          </button>
          <div className="relative" ref={dropdownRef}>
            <User 
              className="w-6 h-6 text-primaryLight cursor-pointer hover:text-orange transition-colors duration-200" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            
            {/* Dropdown Menu */}
            <div className={`absolute right-0 mt-2 w-48 bg-primaryDark rounded-md shadow-lg py-1 border border-orange
              transition-all duration-200 ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            >
              {isLoggedIn&&<button 
                className="w-full px-4 py-2 text-sm text-primaryLight hover:bg-background/10 flex items-center gap-2 transition-colors duration-200"
                onClick={() => {
                  // Add profile action here
                  setIsDropdownOpen(false);
                }}
              >
                <UserCircle className="w-4 h-4" />
               {
                // @ts-expect-error - userData type is not properly defined yet
              userData && userData.username ? userData.username : ""
               } 
              </button>}
              
              <button 
                className="w-full px-4 py-2 text-sm text-primaryLight hover:bg-background/10 flex items-center gap-2 transition-colors duration-200"
                onClick={async() => {
                  if(!isLoggedIn)
                  {
                   const data=await handleGoogleSignIn()
                    console.log('data is')
                    console.log(data)
                    
                   setUserData(data)
                   setIsLoggedIn(true)
                  }
                  setIsDropdownOpen(false);
                }}
              >{isLoggedIn?<> <LogOut className="w-4 h-4" />
                Sign out</>:<> <LogIn className="w-4 h-4" />
                Log In / Sign Up</>}
               
              </button>
            </div>
          </div>
        </div>
      </nav>


      {/*pop up modal for posts */}
      <PopUpModal isOpen={isOpen}
      onClose={()=>setIsOpen(false)}
      title="Create new Post">
         <PostForm/>
      </PopUpModal>

      {/*pop up modal for login/logout */}
    </>
  );
};

export default Navbar;


