import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// utils
import { formattedDate } from "../../../../utils/dateFormatter";
import { adminAPIs } from "../../../../services/apis";

export default function ViewUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          adminAPIs.GET_USER_BY_ID_API.replace(":id", userId)
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-10 text-richblack-400">Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-richblack-600 rounded-lg text-richblack-5"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    accountType,
    createdAt,
    active,
    approved,
    image,
    additionalDetails,
    courses,
    courseProgress,
  } = user;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-richblack-800 rounded-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-richblack-400 hover:text-richblack-200"
      >
        &larr; Back to Users
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={image || "/default-avatar.png"}
          alt={`${firstName} ${lastName}`}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-richblack-5">
            {firstName} {lastName}
          </h2>
          <p className="text-sm text-richblack-300">{email}</p>
          <p className="text-sm text-richblack-300">
            Joined on: {formattedDate(createdAt)}
          </p>
          <p className="text-sm text-richblack-300 capitalize">
            Role: {accountType}
          </p>
          <p className="text-sm text-richblack-300">
            Status: {active ? "Active" : "Inactive"}, {approved ? "Approved" : "Pending"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-richblack-700 p-4 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-richblack-5">Profile</h3>
          <p><span className="font-medium text-richblack-5">Phone:</span> <span className="text-richblack-300">{additionalDetails?.contactNumber || "--"}</span></p>
          <p><span className="font-medium text-richblack-5">Date of Birth:</span> <span className="text-richblack-300">{additionalDetails?.dateOfBirth ? formattedDate(additionalDetails.dateOfBirth) : "--"}</span></p>
          <p><span className="font-medium text-richblack-5">Bio:</span> <span className="text-richblack-300">{additionalDetails?.bio || "--"}</span></p>
        </div>

        <div className="bg-richblack-700 p-4 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-richblack-5">
            {accountType.toLowerCase() === "student" ? "Enrolled Courses" : "Created Courses"}
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
                    {course.category && <p><span className="font-medium text-richblack-5">Category:</span> {course.category.name}</p>}
                    {course.price != null && <p><span className="font-medium text-richblack-5">Price:</span> ${course.price}</p>}
                    <p><span className="font-medium text-richblack-5">Created on:</span> {formattedDate(course.createdAt)}</p>
                    {accountType.toLowerCase() === "student" && (
                      <p><span className="font-medium text-richblack-5">Progress:</span> { /* implement lookup from courseProgress */ } </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-richblack-300">No courses found.</p>
          )}
          <p className="mt-2 text-sm text-richblack-300">Total: {courses.length}</p>
        </div>
      </div>

      
    </div>
  );
}
