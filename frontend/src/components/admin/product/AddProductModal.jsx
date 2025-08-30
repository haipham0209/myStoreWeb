import React, { useState } from "react";
import { ScanLine } from 'lucide-react';
import ScanBarcodeModal from './BarcodeScannerModal';


const AddProduct = ({

  onClose,
  onSave,
  categories,
  apiUrl
}) => {
  const [product, setProduct] = useState({
    productName: '',
    price: 0,
    costPrice: 0,
    discountedPrice: 0,
    stockQuantity: 0,
    imageFile: '', // hiện chưa có ảnh
    newImage: null,
    newImagePreview: null,
    categoryId: '',
    description: '',
    barcode: '',
  });
  const [error, setError] = useState('');

  const [showScanModal, setShowScanModal] = useState(false);

  const handelAdd = () => {
    if (!product.productName.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!product.categoryId.trim()) {
      setError('Category is required.');
      return;
    }
    if (!product.newImagePreview) {
      setError('Product image is required.');
      return;
    }
    if (!product.price) {
      setError('Price is required.');
      return;
    }
    if (!product.costPrice) {
      setError('Cost price is required.');
      return;
    }
    if (!product.barcode?.trim()) {
      setError('Barcode is required.');
      return;
    }

    // Kiểm tra chỉ gồm số
    if (!/^\d+$/.test(product.barcode)) {
      setError('Barcode is number only');
      return;
    }

    // Kiểm tra độ dài từ 8 đến 13
    if (product.barcode.length < 8 || product.barcode.length > 13) {
      setError('Barcode need to 8-13 characters');
      return;
    }


    // Các validate khác nếu cần

    setError('');  // xóa lỗi nếu pass hết
    if (onSave) {
      onSave(product);
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
            <h5 className="modal-title">Add Product</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          {error && (
            <div className="alert alert-danger py-2 m-0" role="alert">
              {error}
            </div>
          )}
          <div className="modal-body">

            <div className='d-flex flex-row justify-content-between gap-3'>
              <div className="mb-1">
                <label className="form-label">Product Name</label>
                <span className="text-danger"> *</span>
                <input
                  type="text"
                  className="form-control"
                  value={product.productName}
                  onChange={e => setProduct({ ...product, productName: e.target.value })}
                />
              </div>
              <div className="d-flex flex-row justify-content-between gap-3">
                {/* Vì mới thêm nên chưa có ảnh hiện tại */}
                <div className="mb-1">
                  <label className="form-label">Category</label>
                  <span className="text-danger"> *</span>
                  <select
                    className="form-select"
                    value={product.categoryId}
                    onChange={e => setProduct({ ...product, categoryId: e.target.value })}
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
            </div>

            <div className='border rounded p-1'>


              <div className='d-flex flex-row justify-content-between gap-3'>
                <div className="mb-3">
                  <label className="form-label">Upload Image</label>
                  <span className="text-danger"> *</span>
                  <input
                    type="file"
                    name="imageFile"
                    className="form-control"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setProduct({
                          ...product,
                          newImage: file,
                          newImagePreview: URL.createObjectURL(file),
                        });
                      }
                    }}
                  />
                </div>

                {product.newImagePreview && (
                  <div className="mt-2">
                    <label className="form-label d-block">Preview Image</label>
                    <img
                      src={product.newImagePreview}
                      alt="Preview"
                      className="img-fluid rounded border"
                      style={{ maxHeight: 150, objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded p-1 mt-1">
              <div className="d-flex flex-row justify-content-between gap-3">
                <div className="mb-1">
                  <label className="form-label">Price</label>
                  <span className="text-danger"> *</span>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={product.price}
                    onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">Cost Price</label>
                  <span className="text-danger"> *</span>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={product.costPrice}
                    onChange={e => setProduct({ ...product, costPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="d-flex flex-row justify-content-between gap-3">
                <div className="mb-1">
                  <label className="form-label">Discounted Price</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={product.discountedPrice}
                    onChange={e =>
                      setProduct({
                        ...product,
                        discountedPrice: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={product.stockQuantity}
                    onChange={e => setProduct({ ...product, stockQuantity: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="mb-1">
              <label className="form-label">Barcode</label>
              <span className="text-danger"> *</span>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="text"
                  className="form-control"
                  value={product.barcode}
                  onChange={e => setProduct({ ...product, barcode: e.target.value })}
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
                    onScanSuccess={(barcode) => {
                      setProduct({ ...product, barcode });
                      setShowScanModal(false);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="mb-1">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                style={{ height: '80px' }}
                value={product.description}
                onChange={e => setProduct({ ...product, description: e.target.value })}
              />
            </div>
            {error && (
              <div className="alert alert-danger py-2 m-0" role="alert">
                {error}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handelAdd}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
