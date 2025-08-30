import React, { useEffect, useState, useRef } from 'react';
import { getCategoryList, createCategory, deleteCategory, updateCategory } from '../../../services/categoryService';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchKey, setSearchKey] = useState('');
  const categoryRefs = useRef({}); // để scroll tới item đầu tiên

  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [error, setError] = useState('');

  const [openMenuId, setOpenMenuId] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryList();
        setCategories(data || []);
      } catch (err) {
        console.error('Cannot get categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;

  const toggleMenu = (categoryId) => setOpenMenuId(openMenuId === categoryId ? null : categoryId);
  const handleEdit = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    if (category) {
      setSelectedCategory(category);
      setShowCategoryModal(true);
    }
    setOpenMenuId(null);
  };
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure to delete this category?')) return;
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.categoryId !== categoryId));
      alert("Delete category success");
    } catch (err) {
      alert('Can not delete category: ' + (err.response?.data?.message || err.message));
    }
    setOpenMenuId(null);
  };

  // ================== SEARCH FRONTEND ==================
  const handleSearch = (e) => {
    const key = e.target.value;
    setSearchKey(key);

    // Scroll tới item đầu tiên có key search
    if (key.trim() === '') return;

    const firstMatch = categories.find(cat =>
      cat.categoryName.toLowerCase().includes(key.toLowerCase())
    );

    if (firstMatch && categoryRefs.current[firstMatch.categoryId]) {
      categoryRefs.current[firstMatch.categoryId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // ================== MODAL ADD CATEGORY ==================
  const onAddCategory = () => {
    setError('');
    setNewCategoryName('');
    setNewCategoryImage(null);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setNewCategoryImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await createCategory(newCategoryName, newCategoryImage);
      const updatedCategories = await getCategoryList();
      setCategories(updatedCategories);
      setShowModal(false);
      alert("Create category success");
    } catch (err) {
      setError('Can not create category');
      console.error(err);
    }
  };

  // ================== MODAL EDIT CATEGORY ==================
  const handleCloseModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
  };
  const handleSaveCategory = async () => {
    try {
      await updateCategory(
        selectedCategory.categoryId,
        selectedCategory.categoryName,
        selectedCategory.newImage || null
      );
      const updatedCategories = await getCategoryList();
      setCategories(updatedCategories);
      alert("Update category success");
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Error while updating category!");
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="search"
          className="form-control w-50"
          placeholder="Search categories..."
          value={searchKey}
          onChange={handleSearch}
        />
        <button type="button" className="btn btn-primary" onClick={onAddCategory}>
          Add Category
        </button>
      </div>

      <div className="row g-3">
        {categories.map(({ categoryId, categoryName, categoryImage }) => {
          const isMatch = searchKey && categoryName.toLowerCase().includes(searchKey.toLowerCase());
          return (
            <div
              key={categoryId}
              className="col-6 col-md-4 col-lg-3 position-relative"
              ref={el => (categoryRefs.current[categoryId] = el)}
            >
              <div
                className={`card h-100 shadow-sm ${isMatch ? 'border border-danger border-3' : ''}`}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Link
                  to={`/admin/products/categories/${categoryId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={`${API_URL}/uploads/categories/${categoryImage}`}
                    alt={categoryName}
                    className="card-img-top rounded"
                    style={{ height: '140px', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/images/products/category/default.jpeg'; }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{categoryName}</h5>
                  </div>
                </Link>

                <button
                  type="button"
                  className="btn btn-sm btn-light position-absolute"
                  style={{ top: 8, right: 8, zIndex: 20 }}
                  onClick={(e) => { e.preventDefault(); toggleMenu(categoryId); }}
                >
                  &#8230;
                </button>

                {openMenuId === categoryId && (
                  <div
                    className="card position-absolute"
                    style={{
                      top: '35px',
                      right: '8px',
                      zIndex: 30,
                      width: '120px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <ul className="list-group list-group-flush">
                      <li
                        className="list-group-item list-group-item-action"
                        onClick={() => handleEdit(categoryId)}
                        style={{ cursor: 'pointer' }}
                      >
                        Edit
                      </li>
                      <li
                        className="list-group-item list-group-item-action text-danger"
                        onClick={() => handleDelete(categoryId)}
                        style={{ cursor: 'pointer' }}
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Category */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Category</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={onImageChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Category */}
      {showCategoryModal && selectedCategory && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Category</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Category name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.categoryName}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, categoryName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <img
                    src={`${API_URL}/uploads/categories/${selectedCategory.categoryImage}`}
                    alt={selectedCategory.categoryName}
                    className="img-fluid rounded mt-2"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Input new image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, newImage: e.target.files[0] })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveCategory}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
