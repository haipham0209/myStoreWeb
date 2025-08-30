import React, { useEffect, useState } from "react";
import { getCategoryList } from "../services/categoryService";
import { Link } from "react-router-dom";

const CategoryCarousel = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryList();
        setCategories(data || []);
      } catch (err) {
        console.error("Cannot get categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (categories.length === 0) return <p>No categories available</p>;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-[80px] flex items-center overflow-hidden">
      {/* Carousel inner */}
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${currentIndex * (100 / 3.5)}%)`,
          width: `${(categories.length * 100) / 3.5}%`,
        }}
      >
        {categories.map(({ categoryId, categoryName, categoryImage }) => (
          <div
            key={categoryId}
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / 3.5}%` }}
          >
            <Link
              to={`/products/categories/${categoryId}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center p-2"
            >
              <div className="w-[40px] h-[40px] flex items-center justify-center">
                <img
                  src={`${API_URL}/uploads/categories/${categoryImage}`}
                  alt={categoryName}
                  className="w-[40px] h-[40px] object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/products/category/default.jpeg";
                  }}
                />
              </div>


              <div className="mt-2 text-center">
                <p className="font-semibold text-sm">{categoryName}</p>
              </div>
            </Link>

          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-r"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-l"
      >
        ›
      </button>
    </div>
  );
};

export default CategoryCarousel;
