package com.example.demo.repository;

import com.example.demo.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Dùng khi tạo mới để kiểm tra trùng tên
    boolean existsByCategoryName(String categoryName);
    boolean existsByCategoryImage(String categoryName);

    // Lấy 5 danh mục theo từng trang (dùng cho product phân trang)
    Page<Category> findAll(Pageable pageable);
    
}
