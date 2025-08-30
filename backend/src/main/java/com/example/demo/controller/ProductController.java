package com.example.demo.controller;

import com.example.demo.dto.CategoryGroupDto;
import com.example.demo.dto.ProductDto;
import com.example.demo.dto.SuccessResponseDto;
import com.example.demo.service.ProductService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
	//Filter
	//Top
	//New
	//discount

	@Autowired
	private ProductService productService;

	// 1. Lấy tất cả sản phẩm dạng 2 chiều (theo category)
	@GetMapping
	public List<CategoryGroupDto> getProductsGroupedByCategory(@RequestParam(defaultValue = "0") int page) {
	    return productService.getProductsGroupedByCategory(page);
	}
	
	// 2. Lấy chi tiết sản phẩm
	@GetMapping("/{productId}")
	public ProductDto getProductById(@PathVariable Long productId) {
		return productService.getProductById(productId);
	}

	// 7. Lấy tất cả sản phẩm theo category cụ thể
	@GetMapping("/category/{categoryId}")
	public List<ProductDto> getProductsByCategory(@PathVariable Long categoryId) {
		return productService.getProductsByCategoryId(categoryId);
	}

	// 8. Tìm kiếm theo tên sản phẩm (gần đúng hoặc chính xác)
	@GetMapping("/search")
	public List<ProductDto> searchByProductName(@RequestParam("name") String name) {
		return productService.searchByProductName(name);
	}
}
