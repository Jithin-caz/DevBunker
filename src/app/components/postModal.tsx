"use client";
import { X } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewPostModal = ({ isOpen, onClose }: NewPostModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState(""); // State for dropdown selection

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-primaryDark w-full max-w-2xl rounded-lg shadow-lg p-6 transform transition-all duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primaryLight">Create New Post</h2>
          <button 
            onClick={onClose}
            className="text-primaryLight hover:text-orange transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-primaryLight mb-1">
              Title
            </label>
            <input
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
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-background text-primaryLight border border-orange rounded-md focus:outline-none focus:ring-2 focus:ring-orange/50"
            >
              <option value="" disabled>Select a category</option>
              <option value="general">General</option>
              <option value="tech">Tech</option>
              <option value="news">News</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-primaryLight mb-1">
              Description
            </label>
            <textarea
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
              onClick={onClose}
              className="px-4 py-2 text-sm text-primaryLight hover:text-orange transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-orange text-white rounded-md hover:bg-orange/90 transition-colors duration-200"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostModal;
