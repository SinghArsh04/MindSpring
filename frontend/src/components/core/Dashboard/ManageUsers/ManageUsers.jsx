// src/components/core/Dashboard/ManageUsers/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// utils
import { formattedDate } from "../../../../utils/dateFormatter";
import { adminAPIs } from "../../../../services/apis";

// common
import ConfirmationModal from "../../../common/ConfirmationModal";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingUser, setConfirmingUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUsers = async () => {
      try {
        const response = await axios.get(adminAPIs.GET_ALL_USERS_API);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/dashboard/manage-users/${userId}`);
  };

  const confirmRemove = (user) => {
    setConfirmingUser(user);
  };

  const cancelRemove = () => {
    setConfirmingUser(null);
  };

  const handleRemoveUser = async () => {
    if (!confirmingUser) return;
    try {
      await axios.delete(
        adminAPIs.DELETE_USER_API.replace(":id", confirmingUser._id)
      );
      setUsers((prev) => prev.filter((u) => u._id !== confirmingUser._id));
    } catch (err) {
      console.error("Failed to remove user:", err);
    } finally {
      setConfirmingUser(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-richblack-400">Loading users…</p>;
  }
  if (!users.length) {
    return <p className="text-center mt-10 text-richblack-400">No users found.</p>;
  }

  return (
    <>
      <h1 className="mb-14 text-4xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        Manage Users
      </h1>

      <div className="space-y-8">
        {users.map((user) => {
          const isAdmin = user.accountType.toLowerCase() === "admin";
          return (
            <div
              key={user._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12"
            >
              <div className="flex items-center gap-x-4 mb-4 sm:mb-0">
                <img
                  src={user.image || "/default-avatar.png"}
                  alt={`avatar-${user.firstName}`}
                  className="aspect-square w-[78px] rounded-full object-cover"
                />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-richblack-5 capitalize">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-richblack-300">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Account Type</p>
                  <p className="text-sm font-semibold text-richblack-5 capitalize">
                    {user.accountType}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Joined On</p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {formattedDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">Phone</p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {user.additionalDetails?.contactNumber || "--"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-600">DOB</p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {user.additionalDetails?.dateOfBirth
                      ? formattedDate(user.additionalDetails.dateOfBirth)
                      : "--"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-x-4">
                <button
                  onClick={() => handleViewDetails(user._id)}
                  disabled={isAdmin}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                >
                  View Details
                </button>
                <button
                  onClick={() => confirmRemove(user)}
                  disabled={isAdmin}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Remove User
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {confirmingUser && (
        <ConfirmationModal
          modalData={{
            text1: `Delete ${confirmingUser.firstName} ${confirmingUser.lastName}?`,
            text2:
              "This action cannot be undone. Are you sure you want to permanently remove this user?",
            btn1Text: "Cancel",
            btn1Handler: cancelRemove,
            btn2Text: "Delete",
            btn2Handler: handleRemoveUser,
          }}
        />
      )}
    </>
  );
}
