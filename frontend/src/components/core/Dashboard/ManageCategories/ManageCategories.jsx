// src/components/core/Dashboard/ManageCategories/ManageCategories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Rename import to avoid shadowing state variable
import { categories as categoryAPIs } from "../../../../services/apis";

export default function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoryAPIs.CATEGORIES_API);
        // API returns { data: [...], success, message }
        const categoryList = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setCategories(categoryList);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewDetails = (categoryId) => {
    navigate(`/dashboard/manage-categories/${categoryId}`);
  };

  const handleRemoveCategory = async (categoryId) => {
    console.log("Remove category:", categoryId);
    // TODO: call DELETE endpoint and update state
  };

  const handleAddCategory = () => {
    console.log("Add category clicked");
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-richblack-400">Loading categories…</p>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center mt-10 text-richblack-400">
        <p>No categories found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-14">
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo">
          Manage Categories
        </h1>
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
        >
          Add Category
        </button>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12"
          >
            <div className="space-y-2 mb-4 sm:mb-0">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                {category.name}
              </p>
              <p className="text-sm text-richblack-300">
                {category.description || "No description"}
              </p>
            </div>
            <div className="flex gap-x-4">
              <button
                onClick={() => handleViewDetails(category._id)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              >
                View Details
              </button>
              <button
                onClick={() => handleRemoveCategory(category._id)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Remove Category
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
