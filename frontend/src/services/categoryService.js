// src/services/productService.js
import axios from './axiosInstance';
import axiosWithNoAuth from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const getCategoryList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/products/categories`);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
export const getCategoryListWithNoAuth = async () => {
  try {
    const response = await axiosWithNoAuth.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};
export const createCategory = async (categoryName, categoryImageFile) => {
  const formData = new FormData();
  formData.append('categoryName', categoryName);
  formData.append('categoryImage', categoryImageFile);

  const res = await axios.post(`${API_URL}/api/admin/products/categories`, formData, {

  });
  return res.data;
};
// Lấy sản phẩm theo categoryId
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/products/category`, {
      params: { categoryId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm xóa sản phẩm theo productId
export const deleteCategory = async (categoryId) => {
  try {
    const res = await axios.delete(`${API_URL}/api/admin/products/categories/${categoryId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (categoryId, categoryName, categoryImageFile) => {
  try {
    const formData = new FormData();
    formData.append('categoryName', categoryName);
    if (categoryImageFile) {
      formData.append('categoryImage', categoryImageFile); // chỉ append nếu có ảnh mới
    }

    const res = await axios.put(`${API_URL}/api/admin/products/categories/${categoryId}`, formData, {
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
