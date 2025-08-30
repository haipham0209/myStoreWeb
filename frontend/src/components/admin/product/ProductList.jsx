import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryList } from "../../../services/categoryService";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsGroupedByCategory,
} from "../../../services/productService";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProducttModal";

// import AddProductModal from "./AddProductModal";
// import EditProductModal from "./A";

const ProductListWithPaging = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Modal control
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // For edit product modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (product) => {
    setSelectedProduct({ ...product, newImage: null }); // newImage dùng cho preview
  };
  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      // alert("Delete success");
      // setOpenMenuId(null);
      setSelectedProduct(null);
      fetchData(page); // refresh danh sách
    } catch (error) {
      console.error("Delete product failed:", error);
      alert("Delete failed");
    }
  };

  const submitAddProduct = async (product) => {
    try {
      const create = await createProduct(product);
      setShowAddProductModal(false);
      fetchData(page); // refresh danh sách
      alert("Add product success");
    } catch (err) {
      console.error("Add product failed:", err);
      alert("Add product failed");
    }
  };


  const handleUpdateProduct = async (product) => {
    try {
      // Giả sử API của bạn cần id và data
      await updateProduct(product.productId, product);
      alert('Product updated successfully');

      // Cập nhật lại state để bảng hiển thị
      fetchData(page);

      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  // Fetch categories + grouped products by page
  const fetchData = async (pageNumber = 0) => {
    setLoading(true);
    try {
      // Giả sử API trả về danh sách theo page, với max 10 categories/page
      const data = await getProductsGroupedByCategory(pageNumber);

      // Nếu data trả về ít hơn 1 page max thì set hasMore false
      // Bạn có thể điều chỉnh tuỳ API trả về
      setHasMore(data.length > 0);

      setCategories(data);
      setPage(pageNumber);
    } catch (err) {
      console.error("Cannot get products grouped by category", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getCategoryList();
        setAllCategories(data || []);
      } catch (err) {
        console.error("Cannot fetch all categories", err);
      }
      fetchData(page);
    };
    fetchAll();
  }, []);


  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
  };

  // Hàm cho nút next trang
  const handleNextPage = () => {
    if (hasMore) {
      fetchData(page + 1);
    }
  };

  // Hàm cho nút prev trang
  const handlePrevPage = () => {
    if (page > 0) {
      fetchData(page - 1);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container py-3">
      <h2>Product List</h2>

      <div className="mb-3 d-flex gap-3">
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
        {/* <button className="btn btn-secondary" onClick={handleAddCategory}>
          Add Category
        </button> */}
      </div>

      {categories.length === 0 && <p>No data</p>}

      {categories.map((category) => (
        <div key={category.categoryId} style={{ marginBottom: "2rem" }}>
          {/* Link tới trang chi tiết category */}
          <h3 className="mb-2">
            <Link
              to={`/admin/products/categories/${category.categoryId}`}
              className="text-decoration-underline text-black border-bottom border-1 fs-4 fw-bold"

            >
              {category.categoryName}
            </Link>
          </h3>


          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product name</th>
                <th>price</th>
                <th>Quantity</th>
                <th>Cretaed at</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              {category.products && category.products.length > 0 ? (
                category.products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td
                      style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
                      onClick={() => handleEditProduct(product)}
                    >
                      {product.productName}
                    </td>
                    <td>{product.price.toLocaleString()} đ</td>
                    <td>{product.stockQuantity || "-"}</td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>{new Date(product.updatedAt).toLocaleString()}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">no product</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {/* Phân trang */}
      <div className="d-flex justify-content-center align-items-center gap-3 my-4">
        <button
          className="btn btn-primary btn-sm rounded px-3"
          onClick={handlePrevPage}
          disabled={page === 0}
        >
          Prev
        </button>

        <span className="px-3 py-1 border rounded bg-light text-primary fw-semibold">
          {page + 1}
        </span>

        <button
          className="btn btn-primary btn-sm rounded px-3"
          onClick={handleNextPage}
          disabled={!hasMore}
        >
          Next
        </button>
      </div>


      {showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSave={submitAddProduct}
          categories={allCategories}
          apiUrl={API_URL}
        />
      )}


      {selectedProduct && (
        <EditProductModal
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleUpdateProduct}
          onDelete={handleDelete}
          categories={allCategories}
          apiUrl={API_URL}
        />
      )}
    </div>
  );

};

export default ProductListWithPaging;
