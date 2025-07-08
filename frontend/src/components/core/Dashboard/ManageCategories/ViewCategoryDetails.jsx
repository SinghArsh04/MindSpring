// src/components/core/Dashboard/ManageCategories/ViewCategoryDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// utils
import { formattedDate } from "../../../../utils/dateFormatter";
import { categories as categoryAPIs } from "../../../../services/apis";

export default function ViewCategoryDetails() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          categoryAPIs.GET_CATEGORY_BY_ID.replace(":id", categoryId)
        );
        // assume API returns { data: {category}, success, message }
        setCategory(res.data.data);
      } catch (err) {
        console.error("Error fetching category details:", err);
        setError("Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-richblack-400">Loading category…</p>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-white">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-richblack-600 rounded-lg text-richblack-5"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { name, description, courses = [] } = category;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-richblack-800 rounded-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-richblack-400 hover:text-richblack-200"
      >
        &larr; Back to Categories
      </button>

      <h2 className="text-2xl font-semibold text-richblack-5 mb-4 capitalize">
        {name}
      </h2>
      <p className="text-richblack-300 mb-6">
        {description || "No description available."}
      </p>

      <div className="bg-richblack-700 p-4 rounded-lg">
        <h3 className="mb-4 text-lg font-semibold text-richblack-5">
          Associated Courses
        </h3>
        {courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-4 bg-richblack-800 border border-richblack-700 rounded-lg"
              >
                <h4 className="text-lg font-semibold text-richblack-5">
                  {course.title || course.courseName}
                </h4>
                {course.shortDescription && (
                  <p className="text-sm text-richblack-300 mt-1">
                    {course.shortDescription}
                  </p>
                )}
                <div className="mt-2 text-sm space-y-1 text-richblack-300">
                  {course.category && (
                    <p>
                      <span className="font-medium text-richblack-5">
                        Category:
                      </span>{" "}
                      {course.category.name}
                    </p>
                  )}
                  {course.price != null && (
                    <p>
                      <span className="font-medium text-richblack-5">
                        Price:
                      </span>{" "}${course.price}
                    </p>
                  )}
                  <p>
                    <span className="font-medium text-richblack-5">
                      Created on:
                    </span>{" "}
                    {formattedDate(course.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-richblack-300">No courses found.</p>
        )}
        <p className="mt-2 text-sm text-richblack-300">
          Total Courses: {courses.length}
        </p>
      </div>
    </div>
  );
}
