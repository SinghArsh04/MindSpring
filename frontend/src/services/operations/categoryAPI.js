import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const CATEGORY_API = {
  CREATE_CATEGORY_API: `${BASE_URL}/admin/createCategory`,
  UPDATE_CATEGORY_API: `${BASE_URL}/admin/update`,
  GET_ALL_CATEGORIES_API: `${BASE_URL}/admin/showAllCategories`,
};

export const createCategory = async (data, token) => {
  const toastId = toast.loading("Creating category...");
  let result = null;

  try {
    const response = await apiConnector("POST", CATEGORY_API.CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE CATEGORY RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to create category");
    }

    result = response?.data?.category;
    toast.success("Category created successfully");
  } catch (error) {
    console.log("CREATE CATEGORY ERROR:", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

export const updateCategory = async (id, data, token) => {
  const toastId = toast.loading("Updating category...");
  let result = null;

  try {
    const response = await apiConnector("PUT", `${CATEGORY_API.UPDATE_CATEGORY_API}/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE CATEGORY RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update category");
    }

    result = response?.data?.category;
    toast.success("Category updated successfully");
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR:", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

export const getAllCategories = async () => {
  let result = [];

  try {
    const response = await apiConnector("GET", CATEGORY_API.GET_ALL_CATEGORIES_API);
    console.log("GET ALL CATEGORIES RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error("Failed to fetch categories");
    }

    result = response?.data?.categories;
  } catch (error) {
    console.log("GET ALL CATEGORIES ERROR:", error);
    toast.error(error.message);
  }

  return result;
};
