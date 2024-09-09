// Import React and other necessary libraries
import React, { useState } from 'react';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'; // Icons
import './App.css'; // Import custom CSS for animations and styles

function SideNav({ addingsidenavData, onContentClick }) {
  // State management for sidebar open/close, editing, deleting, etc.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCategoryDropdown = (categoryIndex) => {
    setOpenCategory(openCategory === categoryIndex ? null : categoryIndex);
    setOpenSubcategory(null); // Close subcategories when switching categories
  };

  const toggleSubcategoryDropdown = (categoryIndex, subcategoryIndex) => {
    const key = `${categoryIndex}-${subcategoryIndex}`;
    setOpenSubcategory(openSubcategory === key ? null : key);
  };

  const handleEdit = (itemType, index, value) => {
    setEditingItem({ itemType, index });
    setNewName(value);
  };

  const handleSave = () => {
    if (editingItem) {
      const { itemType, index } = editingItem;
      console.log(`Saved ${itemType} at index ${index} with new name ${newName}`);

      // Logic to save the new name (e.g., update state or API call)
      // Update the `addingsidenavData` accordingly

      setEditingItem(null);
      setNewName('');
    }
  };

  const handleDelete = (itemType, index) => {
    setItemToDelete({ itemType, index });
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const { itemType, index } = itemToDelete;
      console.log(`Deleted ${itemType} at index ${index}`);

      // Logic to delete the item (e.g., update state or API call)
      // Update the `addingsidenavData` accordingly

      setShowConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };

  return (
    <>
      {addingsidenavData && addingsidenavData.length > 0 && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-50 p-2 rounded focus:outline-none ${
            isSidebarOpen ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
          }`}
        >
          {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      )}

      {addingsidenavData && addingsidenavData.length > 0 && (
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transition-transform transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
          } z-40`}
        >
          <h2 className="text-lg font-semibold mb-4 text-center">Navbar Labels</h2>
          <ul>
            {addingsidenavData.map((category, categoryIndex) => (
              <li key={categoryIndex} className="mb-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      toggleCategoryDropdown(categoryIndex);
                      onContentClick(category.submittedContent); // Pass category content
                    }}
                    className="w-full text-left flex justify-between items-center p-2 bg-gray-700 rounded hover:bg-gray-600 truncate"
                  >
                    <span className="truncate">
                      {editingItem && editingItem.itemType === 'category' && editingItem.index === categoryIndex ? (
                        <>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-gray-600 text-white p-1 rounded"
                          />
                          <FaCheck onClick={handleSave} className="ml-2 cursor-pointer" />
                        </>
                      ) : (
                        category.name
                      )}
                    </span>
                    <span>
                      {openCategory === categoryIndex ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                  <div className="flex space-x-2 ml-2">
                    {editingItem && editingItem.itemType === 'category' && editingItem.index === categoryIndex ? null : (
                      <>
                        <FaEdit
                          onClick={() => handleEdit('category', categoryIndex, category.name)}
                          className="cursor-pointer"
                        />
                        <FaTrash
                          onClick={() => handleDelete('category', categoryIndex)}
                          className="cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>
                {openCategory === categoryIndex && (
                  <ul className="mt-2 pl-4">
                    {category?.subcategories?.map((subcategory, subcategoryIndex) => (
                      <li key={subcategoryIndex} className="mb-2">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              toggleSubcategoryDropdown(categoryIndex, subcategoryIndex);
                              onContentClick(subcategory.submittedContent); // Pass subcategory content
                            }}
                            className="w-full text-left flex justify-between items-center p-2 bg-gray-600 rounded hover:bg-gray-500 truncate"
                          >
                            <span className="truncate">
                              {editingItem && editingItem.itemType === 'subcategory' && editingItem.index === subcategoryIndex ? (
                                <>
                                  <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-gray-500 text-white p-1 rounded"
                                  />
                                  <FaCheck onClick={handleSave} className="ml-2 cursor-pointer" />
                                </>
                              ) : (
                                subcategory.name
                              )}
                            </span>
                            <span>
                              {openSubcategory === `${categoryIndex}-${subcategoryIndex}` ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                          </button>
                          <div className="flex space-x-2 ml-2">
                            {editingItem && editingItem.itemType === 'subcategory' && editingItem.index === subcategoryIndex ? null : (
                              <>
                                <FaEdit
                                  onClick={() => handleEdit('subcategory', subcategoryIndex, subcategory.name)}
                                  className="cursor-pointer"
                                />
                                <FaTrash
                                  onClick={() => handleDelete('subcategory', subcategoryIndex)}
                                  className="cursor-pointer"
                                />
                              </>
                            )}
                          </div>
                        </div>
                        {openSubcategory === `${categoryIndex}-${subcategoryIndex}` && (
                          <ul className="mt-2 pl-4">
                            {subcategory.subSubcategories.map((subSubcategory, subSubcategoryIndex) => (
                              <li key={subSubcategoryIndex} className="mb-2 p-2 bg-gray-500 rounded hover:bg-gray-400 flex justify-between items-center truncate">
                                <span className="truncate">
                                  {editingItem && editingItem.itemType === 'subSubcategory' && editingItem.index === subSubcategoryIndex ? (
                                    <>
                                      <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-gray-400 text-white p-1 rounded"
                                      />
                                      <FaCheck onClick={handleSave} className="ml-2 cursor-pointer" />
                                    </>
                                  ) : (
                                    subSubcategory
                                  )}
                                </span>
                                <div className="flex space-x-2">
                                  {editingItem && editingItem.itemType === 'subSubcategory' && editingItem.index === subSubcategoryIndex ? null : (
                                    <>
                                      <FaEdit
                                        onClick={() => handleEdit('subSubcategory', subSubcategoryIndex, subSubcategory)}
                                        className="cursor-pointer"
                                      />
                                      <FaTrash
                                        onClick={() => handleDelete('subSubcategory', subSubcategoryIndex)}
                                        className="cursor-pointer"
                                      />
                                    </>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {showConfirmDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded">
                <p className="mb-4">Are you sure you want to delete this item?</p>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
                <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-black rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SideNav;
