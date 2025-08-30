import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory, getCategoryList } from '../../../services/categoryService';
import EditProductModal from './EditProducttModal';
import AddProduct from './AddProductModal';
import { createProduct, updateProduct, deleteProduct } from '../../../services/productService';

const CategoryProducts = () => {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchKey, setSearchKey] = useState('');
  const productRefs = useRef({}); // ref để scroll tới product đầu tiên match

  useEffect(() => {
    const fetchAll = async () => {
      await fetchCategories();
      await fetchCategoryName();
      await fetchProducts();
    };
    fetchAll();
  }, [id]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsByCategory(id);
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const data = await getCategoryList();
    setCategories(data || []);
  };

  const fetchCategoryName = async () => {
    try {
      const categories = await getCategoryList();
      const category = categories.find(cat => cat.categoryId.toString() === id);
      setCategoryName(category ? category.categoryName : '');
    } catch {
      setCategoryName('');
    }
  };

  const toggleMenu = (productId) => setOpenMenuId(openMenuId === productId ? null : productId);
  const handleEdit = (productId) => {
    const product = products.find(p => p.productId === productId);
    if (product) {
      setSelectedProduct({ ...product, newImage: null });
      setOpenMenuId(null);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      alert("Delete success");
      setOpenMenuId(null);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleCloseModal = () => setSelectedProduct(null);
  const handleAdd = () => setShowAddModal(true);

  const handleAddProduct = async (product) => {
    try {
      setErrorMessage('');
      await createProduct(product);
      
      setShowAddModal(false);
      handleCloseModal(null);
      await fetchProducts();
      alert("Add product success");
      
    } catch (error) {
      alert("faile");
      let msg = error.response?.data?.message || error.message || 'Add product failed';
      setErrorMessage(msg);
      console.error(msg);
    }
  };

  const handleSave = async (newProduct) => {
    try {
      await updateProduct(newProduct.productId, newProduct);
      setShowAddModal(false);
      handleCloseModal(null);
      alert("Update product success");
      await fetchProducts();
    } catch (error) {
      console.error("Update product failed:", error);
      alert("Update product failed");
    }
  };

  // =============== SEARCH FRONTEND =================
  const handleSearch = (e) => {
    const key = e.target.value;
    setSearchKey(key);

    if (!key.trim()) return;

    const firstMatch = products.find(p =>
      p.productName.toLowerCase().includes(key.toLowerCase())
    );

    if (firstMatch && productRefs.current[firstMatch.productId]) {
      productRefs.current[firstMatch.productId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container py-3">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="search"
          className="form-control w-50"
          placeholder="Search products..."
          value={searchKey}
          onChange={handleSearch}
        />
        <button type="button" className="btn btn-primary" onClick={handleAdd}>
          Add Product
        </button>
      </div>

      <h3>category: {categoryName || `ID ${id}`}</h3>

      {products.length === 0 ? (
        <p>Không có sản phẩm</p>
      ) : (
        <div className="row g-3">
          {products.map(p => {
            const isMatch = searchKey && p.productName.toLowerCase().includes(searchKey.toLowerCase());
            return (
              <div
                key={p.productId}
                className="col-4 col-md-2 position-relative d-flex flex-column"
                ref={el => (productRefs.current[p.productId] = el)}
              >
                <div
                  className={`card h-100 shadow-sm position-relative d-flex flex-column ${isMatch ? 'border border-danger border-3' : ''}`}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-light position-absolute"
                    style={{ top: 5, right: 5, zIndex: 20 }}
                    onClick={() => toggleMenu(p.productId)}
                  >
                    &#8230;
                  </button>

                  <img
                    src={`${API_URL}/uploads/products/${p.productImage}`}
                    alt={p.productName}
                    className="card-img-top"
                    style={{ height: 120, objectFit: "cover" }}
                    onError={e => { e.currentTarget.src = "/images/products/category/default.jpeg"; }}
                  />

                  <div className="card-body text-center flex-grow-1 p-1 d-flex flex-column">
                    <h6 className="card-title">{p.productName}</h6>
                    <p className="card-text text-muted my-1">Price: {p.price} đ</p>
                    <p className="card-text text-muted my-1">Cost price: {p.costPrice} đ</p>
                    {p.discountedPrice != null && (
                      <p className="badge" style={{ backgroundColor: 'rgba(220,53,69,0.5)', color: '#721c24' }}>
                        After discount: {p.discountedPrice} đ
                      </p>
                    )}
                    <div className="mt-auto">
                      <p className="card-text text-muted my-1 fw-bold">Stock: {p.stockQuantity}</p>
                    </div>
                  </div>

                  {openMenuId === p.productId && (
                    <div
                      className="card position-absolute"
                      style={{ top: 35, right: 5, zIndex: 30, width: "120px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                    >
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item list-group-item-action" onClick={() => handleEdit(p.productId)} style={{ cursor: "pointer" }}>Edit</li>
                        <li className="list-group-item list-group-item-action text-danger" onClick={() => handleDelete(p.productId)} style={{ cursor: "pointer" }}>Delete</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProduct && (
        <EditProductModal
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}   // ✅ truyền xuống
          categories={categories}
          apiUrl={API_URL}
        />
      )}

      {showAddModal && (
        <AddProduct
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
          categories={categories}
          apiUrl={API_URL}
        />
      )}
    </div>
  );
};

export default CategoryProducts;
