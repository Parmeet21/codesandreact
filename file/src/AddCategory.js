import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for animations
import SideNav from './SideNav';
import Content from './Content';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCategory() {
    const [categories, setCategories] = useState([{ name: '', subcategories: [] }]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalType, setModalType] = useState(''); // 'categoryContent', 'subcategoryContent', 'subSubcategoryContent'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(null);
    const [selectedSubSubcategoryIndex, setSelectedSubSubcategoryIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState(0);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [addingSubcategory, setAddingSubcategory] = useState(false);
    const [addingsidenavData, setAddingsidenavData] = useState("");
    const [selectedContent, setSelectedContent] = useState(null);

    const handleContentClick = (content) => {
        setSelectedContent(content);
      };
    
      const handleCloseContent = () => {
        setSelectedContent(null);
      };
    
    useEffect(() => {
        // Check if the "Submit All" button should be enabled or disabled
        const isAllSubmitted = categories.every(cat =>
            cat.submittedContent !== undefined &&
            cat.subcategories.every(sub =>
                sub.submittedContent !== undefined &&
                sub.subSubcategories.every(subSub => subSub.trim() !== '')
            )
        );
        setIsSubmitDisabled(!isAllSubmitted || addingSubcategory);
    }, [categories, addingSubcategory]);

    const handleAddSubcategory = (index) => {
        setAddingSubcategory(true);
        const newCategories = [...categories];
        newCategories[index].subcategories.push({ name: '', subSubcategories: [] });
        setCategories(newCategories);
    };

    const handleAddSubSubcategory = (parentIndex, subIndex) => {
        const newCategories = [...categories];
        newCategories[parentIndex].subcategories[subIndex].subSubcategories.push('');
        setCategories(newCategories);
    };

    const handleDeleteCategory = (index) => {
        const newCategories = [...categories];
        newCategories.splice(index, 1);
        setCategories(newCategories);
        if (index === activeCategory && newCategories.length > 0) {
            setActiveCategory(0); // Show first category if the active one is deleted
        }
    };

    const handleDeleteSubcategory = (parentIndex, subIndex) => {
        const newCategories = [...categories];
        newCategories[parentIndex].subcategories.splice(subIndex, 1);
        setCategories(newCategories);
    };

    const handleDeleteSubSubcategory = (parentIndex, subIndex, subSubIndex) => {
        const newCategories = [...categories];
        newCategories[parentIndex].subcategories[subIndex].subSubcategories.splice(subSubIndex, 1);
        setCategories(newCategories);
    };

    const handleInputChange = (e, parentIndex, subIndex, type, newObject) => {
        const { name, value } = e.target;
        const newCategories = [...categories];
    
        if (type === 'category') {
            newCategories[parentIndex][name] = value;
        } else if (type === 'subcategory') {
            newCategories[parentIndex].subcategories[subIndex][name] = value;
        } else if (type === 'subSubcategory') {
        newCategories[parentIndex].subcategories[subIndex].subSubcategories[name]=  value;

    
        }
        setCategories(newCategories);
    };
    
    

    const handleShowModal = (type, categoryIndex, subIndex = null, subSubIndex = null) => {
        setModalType(type);
        setSelectedCategory(categoryIndex);
        setSelectedSubcategoryIndex(subIndex);
        setSelectedSubSubcategoryIndex(subSubIndex);

        if (type === 'categoryContent') {
            setModalContent(categories[categoryIndex].submittedContent || '');
        } else if (type === 'subcategoryContent') {
            setModalContent(categories[categoryIndex].subcategories[subIndex].submittedContent || '');
        } else if (type === 'subSubcategoryContent') {
            setModalContent(categories[categoryIndex].subcategories[subIndex].subSubcategories[subSubIndex] || '');
        }

        setModalOpen(true);
    };

    const handleModalSubmit = () => {
        if (modalContent.trim() === '') {
           
            toast.error('Content cannot be empty');
            return;
        }

        const updatedCategories = [...categories];
        const { categoryIndex, subIndex, subSubIndex } = { categoryIndex: selectedCategory, subIndex: selectedSubcategoryIndex, subSubIndex: selectedSubSubcategoryIndex };

        if (modalType === 'categoryContent') {
            updatedCategories[categoryIndex].submittedContent = modalContent;
        } else if (modalType === 'subcategoryContent') {
            updatedCategories[categoryIndex].subcategories[subIndex].submittedContent = modalContent;
        } else if (modalType === 'subSubcategoryContent') {
            const updatedSubSubcategories = [...updatedCategories[categoryIndex].subcategories[subIndex].subSubcategories];
            updatedSubSubcategories[subSubIndex] = modalContent;
            updatedCategories[categoryIndex].subcategories[subIndex].subSubcategories = updatedSubSubcategories;
        }

        setCategories(updatedCategories);
        setModalOpen(false);
        setModalContent('');
        setAddingSubcategory(false);
    };

    const handleCategorySubmit = (index) => {
        const categoryName = categories[index].name.trim();
        if (categoryName === '') {
            toast.error('Category name cannot be empty');
            return;
        }
        handleShowModal('categoryContent', index);
    };

    const handleSubcategorySubmit = (parentIndex, subIndex) => {
        const subcategoryName = categories[parentIndex].subcategories[subIndex].name.trim();
        if (subcategoryName === '') {
            toast.error('Subcategory name cannot be empty');
            return;
        }
        handleShowModal('subcategoryContent', parentIndex, subIndex);
    };

    const handleSubSubcategorySubmit = (parentIndex, subIndex, subSubIndex) => {
        const subSubcategoryContent = categories[parentIndex].subcategories[subIndex].subSubcategories[subSubIndex].trim();
        if (subSubcategoryContent === '') {
            toast.error('Sub-subcategory cannot be empty');
            return;
        }
        handleShowModal('subSubcategoryContent', parentIndex, subIndex, subSubIndex);
    };

    const handleSubmitAll = () => {
        if (categories.some(cat => cat.submittedContent === undefined || cat.subcategories.some(sub => sub.submittedContent === undefined || sub.subSubcategories.some(subSub => subSub.trim() === '')))) {
            toast.error('Please submit all categories and subcategories before submitting all data.');
            return;
        }
        
        // console.log(addingSubcategory,"kjk")
        console.log('All Categories:', categories); // Debugging log
       
        // Clear all data
        setCategories([{ name: '', subcategories: [] }]);
        setModalOpen(false);
        setModalContent('');
        setSelectedCategory(null);
        setSelectedSubcategoryIndex(null);
        setSelectedSubSubcategoryIndex(null);
        setActiveCategory(0);
        setIsSubmitDisabled(true);
         setAddingsidenavData(categories)
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
            <SideNav addingsidenavData={addingsidenavData}  onContentClick={handleContentClick} />
            {selectedContent && (
        <Content  content={selectedContent} onClose={handleCloseContent} />
      )}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Policy Form</h1>

                
                {categories.length > 0 && (
                    <div>
                        <div className="flex mb-4">
                            <div className="w-full sm:flex items-center">
                                <div className='sm:w-[90%]'>     <input
                                    type="text"
                                    name="name"
                                    value={categories[activeCategory].name}
                                    onChange={(e) => handleInputChange(e, activeCategory, null, 'category')}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    placeholder="Enter category"
                                /></div>
                                <div className=' sm:ml-3 '>
                                    <button
                                        type="button"
                                        onClick={() => handleCategorySubmit(activeCategory)}
                                        className="sm:mt-0 mt-2 bg-blue-500 p-2 block rounded transition-transform transform hover:scale-105"
                                    >
                                        Submit
                                    </button></div>
                                {categories.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(activeCategory)}
                                        className="ml-2 bg-red-500 p-2 rounded transition-transform transform hover:scale-105"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Subcategories */}
                        {categories[activeCategory].subcategories.map((sub, subIndex) => (
                            <div key={subIndex} className="flex flex-col mb-4">
                                <div className="sm:flex  sm:justify-end items-center mb-2">
                                    <div className='sm:w-[80%] mr-4'>   <input
                                        type="text"
                                        name="name"
                                        value={sub.name}
                                        onChange={(e) => handleInputChange(e, activeCategory, subIndex, 'subcategory')}
                                        className=" p-2 ml-5 w-full  rounded bg-gray-700 text-white"
                                        placeholder="Enter subcategory"
                                    />
                                    </div>
                                    <div v className=' sm:flex sm:justify-end sm:mt-0 mt-2 sm:ml-0 ml-3'>
                                        <button
                                            type="button"
                                            onClick={() => handleSubcategorySubmit(activeCategory, subIndex)}
                                            className="ml-2 bg-blue-500 p-2 rounded transition-transform transform hover:scale-105"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubcategory(activeCategory, subIndex)}
                                            className="ml-2 bg-red-500 p-2 rounded transition-transform transform hover:scale-105"
                                        >
                                            Delete
                                        </button></div>
                                </div>

                                {/* Sub-subcategories */}
                                {/* {sub.subSubcategories.map((subSub, subSubIndex) => (
                                    <div key={subSubIndex} className="sm:flex mt-3 sm:flex  ml-9 sm:ml-10 justify-end mb-2">
                                        <div className='sm:w-[80%] '>
                                            <input
                                                type="text"
                                                name={"name"}
                                                value={subSub.name}
                                                onChange={(e) => handleInputChange(e, activeCategory, subIndex, 'subSubcategory')}
                                                className="w-full p-2 rounded bg-gray-700 text-white"
                                                placeholder="Enter Super Subcategory"
                                            /></div>
                                        <div className='flex sm:m-0 mt-2'>
                                            <button
                                                type="button"
                                                onClick={() => handleSubSubcategorySubmit(activeCategory, subIndex, subSubIndex)}
                                                className="sm:ml-2 bg-blue-500 p-2 rounded transition-transform transform hover:scale-105"
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSubSubcategory(activeCategory, subIndex, subSubIndex)}
                                                className="ml-2 bg-red-500 p-2 rounded transition-transform transform hover:scale-105"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))} */}
                                {/* <div className='flex justify-center w-50'>
                                    <button
                                        type="button"
                                        onClick={() => handleAddSubSubcategory(activeCategory, subIndex)}
                                        className="mt-2 bg-green-500 p-2 rounded transition-transform transform hover:scale-105"
                                    >
                                        Add Super-Subcategory
                                    </button>
                                </div> */}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => handleAddSubcategory(activeCategory)}
                            className="bg-green-500 p-2 rounded transition-transform transform hover:scale-105"
                        >
                            Add Subcategory
                        </button>
                    </div>
                )}

             <div className='flex justify-center'>

                <button
                    type="button"
                    onClick={handleSubmitAll}
                    disabled={isSubmitDisabled}
                    className="mt-4 bg-green-500 p-2 rounded transition-transform transform hover:scale-105"
                >
                    Submit All
                </button></div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Content</h2>
                        <textarea
                            rows="4"
                            value={modalContent}
                            onChange={(e) => setModalContent(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            placeholder="Enter content here..."
                        />
                        
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={handleModalSubmit}
                                className="bg-blue-500 p-2 rounded transition-transform transform hover:scale-105"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="ml-2 bg-red-500 p-2 rounded transition-transform transform hover:scale-105"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
}

export default AddCategory;
