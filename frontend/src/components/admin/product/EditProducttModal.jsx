import React, { useState } from "react";
import { ScanLine } from 'lucide-react';
import ScanBarcodeModal from './BarcodeScannerModal';

const EditProductModal = ({
  selectedProduct,
  setSelectedProduct,
  onClose,
  onSave,
  onDelete,
  categories,
  apiUrl
}) => {
  const [error, setError] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);

  if (!selectedProduct) return null;

  const handleSave = () => {
    // Validate product name
    if (!selectedProduct.productName?.trim()) {
      setError('Product name is required.');
      return;
    }

    // Validate category
    if (!selectedProduct.categoryId) {
      setError('Category is required.');
      return;
    }

    // Validate image
    if (!selectedProduct.productImage && !selectedProduct.newImagePreview) {
      setError('Product image is required.');
      return;
    }

    // Validate price
    if (selectedProduct.price == null || selectedProduct.price < 0) {
      setError('Price is required.');
      return;
    }

    // Validate cost price
    if (selectedProduct.costPrice == null || selectedProduct.costPrice < 0) {
      setError('Cost price is required.');
      return;
    }

    // Set default discounted price nếu chưa nhập
    if (selectedProduct.discountedPrice == null) {
      setSelectedProduct({
        ...selectedProduct,
        discountedPrice: 0
      });
    }

    // Validate barcode
    if (!selectedProduct.barcode?.toString().trim()) {
      setError('Barcode is required.');
      return;
    }
    if (!/^\d+$/.test(selectedProduct.barcode.toString())) {
      setError('Barcode is number only');
      return;
    }
    if (selectedProduct.barcode.toString().length < 8 || selectedProduct.barcode.toString().length > 13) {
      setError('Barcode is from 8 to 13 number');
      return;
    }

    // Pass hết validate
    setError('');
    if (onSave) onSave(selectedProduct);
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete?.(selectedProduct.productId);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Product</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 m-0" role="alert">
              {error}
            </div>
          )}

          <div className="modal-body">
            {/* Product Name & Category */}
            <div className="d-flex flex-row justify-content-between gap-3">
              <div className="mb-1">
                <label className="form-label">Product Name<span className="text-danger"> *</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct.productName || ''}
                  onChange={e => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                />
              </div>
              <div className="mb-1">
                <label className="form-label">Category<span className="text-danger"> *</span></label>
                <select
                  className="form-select"
                  value={selectedProduct.categoryId || ''}
                  onChange={e => setSelectedProduct({ ...selectedProduct, categoryId: e.target.value })}
                >
                  <option value="">-- Select category --</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Image */}
            <div className="mb-3 text-center">
              <label className="form-label d-block">Image</label>
              <img
                src={`${apiUrl}/uploads/products/${selectedProduct.productImage}`}
                alt={selectedProduct.productName}
                className="img-fluid rounded border"
                style={{ maxHeight: 150, objectFit: 'contain' }}
                onError={e => e.currentTarget.src = "/images/products/category/default.jpeg"}
              />
            </div>

            {/* Upload New Image */}
            <div className="border rounded p-1 mt-3">
              <div className="d-flex flex-row justify-content-between gap-3">
                <div className="mb-3">
                  <label className="form-label">Upload New Image<span className="text-danger"> *</span></label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedProduct({
                          ...selectedProduct,
                          newImage: file,
                          newImagePreview: URL.createObjectURL(file),
                        });
                      }
                    }}
                  />
                </div>
                {selectedProduct.newImagePreview && (
                  <div className="mt-2">
                    <label className="form-label d-block">Preview New Image</label>
                    <img
                      src={selectedProduct.newImagePreview}
                      alt="New preview"
                      className="img-fluid rounded border"
                      style={{ maxHeight: 150, objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Prices & Stock */}
            <div className="border rounded p-1 mt-3">
              <div className="d-flex flex-row justify-content-between gap-3">
                <div className="mb-1">
                  <label className="form-label">Price<span className="text-danger"> *</span></label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={selectedProduct.price || 0}
                    onChange={e => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label">Cost Price<span className="text-danger"> *</span></label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={selectedProduct.costPrice || 0}
                    onChange={e => setSelectedProduct({ ...selectedProduct, costPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="d-flex flex-row justify-content-between gap-3 mt-2">
                <div className="mb-1">
                  <label className="form-label">Discounted Price</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={selectedProduct.discountedPrice || 0}
                    onChange={e =>
                      setSelectedProduct({ ...selectedProduct, discountedPrice: e.target.value === '' ? 0 : Number(e.target.value) })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={selectedProduct.stockQuantity || 0}
                    onChange={e => setSelectedProduct({ ...selectedProduct, stockQuantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Barcode */}
            <div className="mb-1 mt-3">
              <label className="form-label">Barcode<span className="text-danger"> *</span></label>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct.barcode || ''}
                  onChange={e => setSelectedProduct({ ...selectedProduct, barcode: e.target.value })}
                />
                <ScanLine
                  size={40}
                  strokeWidth={2}
                  color="currentColor"
                  style={{ cursor: 'pointer' }}
                  title="Scan barcode bằng camera"
                  onClick={() => setShowScanModal(true)}
                />
                {showScanModal && (
                  <ScanBarcodeModal
                    show={showScanModal}
                    onClose={() => setShowScanModal(false)}
                    onScanSuccess={barcode => {
                      setSelectedProduct({ ...selectedProduct, barcode });
                      setShowScanModal(false);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-1 mt-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                style={{ height: '80px' }}
                value={selectedProduct.description || ''}
                onChange={e => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
              />
            </div>
            {error && (
              <div className="alert alert-danger py-2 m-0" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger me-auto" onClick={handleDelete}>Delete</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
