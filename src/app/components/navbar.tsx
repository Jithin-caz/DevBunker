"use client";
import { User, LogOut, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NewPostModal from "./postModal";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
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
            onClick={() => setIsNewPostModalOpen(true)}
            className=" flex px-2 py-1 rounded  bg-orange hover:text-orange hover:bg-primaryDark text-primaryDark duration-300 ease-in-out"
          >
            new post
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
              <button 
                className="w-full px-4 py-2 text-sm text-primaryLight hover:bg-background/10 flex items-center gap-2 transition-colors duration-200"
                onClick={() => {
                  // Add profile action here
                  setIsDropdownOpen(false);
                }}
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </button>
              
              <button 
                className="w-full px-4 py-2 text-sm text-primaryLight hover:bg-background/10 flex items-center gap-2 transition-colors duration-200"
                onClick={() => {
                  // Add sign out action here
                  setIsDropdownOpen(false);
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <NewPostModal 
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
