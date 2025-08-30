// src/services/productService.js
import { data } from 'react-router-dom';
import axios from './axiosInstance';
// import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const getProductsGroupedByCategory = async (page = 0) => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/products`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. Lấy sản phẩm đang giảm giá (discountedPrice > 0)
export const getDiscountedProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/products/discounted`);
    console.log(response.data)
    return response.data; // list<ProductDto>
  } catch (error) {
    throw error;
  }
};


export const createProduct = async (product) => {
  try {
    const formData = new FormData();

    // Thêm các trường text vào formData
    formData.append("productName", product.productName);
    formData.append("price", product.price);
    formData.append("costPrice", product.costPrice);
    formData.append("discountedPrice", product.discountedPrice);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("categoryId", product.categoryId);
    formData.append("description", product.description);
    formData.append("barcode", product.barcode);

    // Thêm file ảnh nếu có
    if (product.newImage) {
      formData.append("imageFile", product.newImage);
    }

    const response = await axios.post(
      `${API_URL}/api/admin/products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // trả về productDto từ backend
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const formData = new FormData();

    // Thêm các trường text
    formData.append("productName", product.productName);
    formData.append("price", product.price);
    formData.append("costPrice", product.costPrice);
    formData.append("discountedPrice", product.discountedPrice);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("categoryId", product.categoryId);
    formData.append("description", product.description);
    formData.append("barcode", product.barcode);

    // Thêm file ảnh nếu có ảnh mới
    if (product.newImage) {
      formData.append("imageFile", product.newImage);
    }

    const response = await axios.put(
      `${API_URL}/api/admin/products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/admin/products/${id}`);
    return response.data; // trả về SuccessResponseDto từ backend
  } catch (error) {
    throw error;
  }
};


