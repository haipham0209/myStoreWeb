import React, { useEffect, useState, useRef } from "react";
import { getDiscountedProducts, updateProduct, deleteProduct } from "../../../services/productService";
import EditProductModal from "./EditProducttModal";
import { getCategoryList } from "../../../services/categoryService";
const AdminOnSalesList = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For edit product modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search
  const [searchKey, setSearchKey] = useState("");
  const productRefs = useRef({});

  // Sort

  const [sortConfig, setSortConfig] = useState({ key: "productName", direction: "asc" });
  const [allCategories, setAllCategories] = useState([]);

  const fetchData = async () => {
  setLoading(true);
  try {
    // lấy categories
    const categories = await getCategoryList();
    setAllCategories(categories || []);

    // lấy sản phẩm giảm giá
    const products = await getDiscountedProducts();
    setProducts(products || []);
    
  } catch (err) {
    console.error("Cannot get discounted products", err);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct({ ...product, newImage: null });
  };

  const handleUpdateProduct = async (product) => {
    try {
      await updateProduct(product.productId, product);
      alert("Product updated successfully");
      fetchData(); // refresh list
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };
    const handleDelete = async (productId) => {
      try {
        await deleteProduct(productId);
        // alert("Delete success");
        // setOpenMenuId(null);
        setSelectedProduct(null);
        fetchData(); // refresh danh sách
      } catch (error) {
        console.error("Delete product failed:", error);
        alert("Delete failed");
      }
    };


  // =============== SEARCH FRONTEND =================
  const handleSearch = (e) => {
    const key = e.target.value;
    setSearchKey(key);

    if (!key.trim()) return;

    const firstMatch = products.find((p) =>
      p.productName.toLowerCase().includes(key.toLowerCase())
    );

    if (firstMatch && productRefs.current[firstMatch.productId]) {
      productRefs.current[firstMatch.productId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // =============== SORT =================
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA == null || valueB == null) return 0;

    if (typeof valueA === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortConfig.direction === "asc"
        ? valueA > valueB ? 1 : -1
        : valueA < valueB ? 1 : -1;
    }
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container py-3">
      <h2>On sales products</h2>

      {/* Search box */}
      <div className="mb-3">
        <input
          type="search"
          className="form-control w-50"
          placeholder="Search products..."
          value={searchKey}
          onChange={handleSearch}
        />
      </div>

      {products.length === 0 && <p>no data</p>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("productId")}>
              Product ID {sortConfig.key === "productId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("productName")}>
              Product name {sortConfig.key === "productName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("price")}>
              Price {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("discountedPrice")}>
              After discounted {sortConfig.key === "discountedPrice" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("stockQuantity")}>
              Inventory {sortConfig.key === "stockQuantity" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
              Created at {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("updatedAt")}>
              Last updated {sortConfig.key === "updatedAt" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>

          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product, index) => {
            const isMatch =
              searchKey &&
              product.productName
                .toLowerCase()
                .includes(searchKey.toLowerCase());

            return (
              <tr
                key={product.productId}
                ref={(el) => (productRefs.current[product.productId] = el)}
                style={isMatch ? { border: "2px solid red" } : {}}
              >
                <td>{index + 1}</td>
                <td>{product.productId}</td>
                <td
                  style={{
                    cursor: "pointer",
                    color: "#0d6efd",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleEditProduct(product)}
                >
                  {product.productName}
                </td>
                <td>{product.price.toLocaleString()} đ</td>
                <td className="text-danger fw-bold">
                  {product.discountedPrice.toLocaleString()} đ
                </td>
                <td>{product.stockQuantity || "-"}</td>
                <td>{new Date(product.createdAt).toLocaleString()}</td>
                <td>{new Date(product.updatedAt).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedProduct && (
        <EditProductModal
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleUpdateProduct}
          onDelete={handleDelete}
          categories={allCategories} // không cần category
          apiUrl={API_URL}
        />
      )}
    </div>
  );
};

export default AdminOnSalesList;
