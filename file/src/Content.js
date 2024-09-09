import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Close icon

function Content({ content, onClose }) {
  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white p-4 transition-transform transform ${
      content ? 'translate-x-0' : 'translate-x-full'
    } z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded bg-gray-700 text-white"
      >
        <FaTimes className="w-6 h-6" />
      </button>
      <div>
        {/* Render the content here */}
        <h2 className="text-lg font-semibold mb-4">Content</h2>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default Content;
