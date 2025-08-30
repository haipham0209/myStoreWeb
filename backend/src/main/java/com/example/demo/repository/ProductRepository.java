package com.example.demo.repository;

import com.example.demo.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	Page<Product> findByCategory_CategoryIdOrderByCreatedAtDesc(Long categoryId, Pageable pageable);

    // Lấy tất cả product theo categoryId (ko phân trang)
    List<Product> findByCategory_CategoryId(Long categoryId);
    
    List<Product> findByDiscountedPriceGreaterThan(BigDecimal price);

    // Tìm top 10 sản phẩm theo tên hoặc barcode (gợi ý tìm kiếm)
    List<Product> findTop10ByProductNameContainingIgnoreCaseOrBarcodeContaining(String productName, String barcode);
//    List<Product> findTop5ByProductNameContainingIgnoreCaseOrBarcodeContaining(String productName, String barcode);

    // Tìm sản phẩm theo tên (search)
//    List<Product> findByProductNameContainingIgnoreCase(String name);
    List<Product> findTop25ByProductNameContainingIgnoreCase(String name);
    
    boolean existsByBarcode(String barcode);

    boolean existsByProductNameAndCategory_CategoryId(String productName, Integer categoryId);


}

