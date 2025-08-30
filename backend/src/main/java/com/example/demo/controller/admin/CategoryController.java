package com.example.demo.controller.admin;

import com.example.demo.dto.CategoryDto;
import com.example.demo.dto.SuccessResponseDto;
import com.example.demo.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;

	@GetMapping
	public List<CategoryDto> getAllCategories() {
		return categoryService.getAllCategories();
	}

	@GetMapping("/{id}")
	public CategoryDto getCategoryById(@PathVariable Long id) {
		return categoryService.getCategoryById(id);
	}

//	@PostMapping
//	public CategoryDto createCategory(@Valid @RequestBody CategoryDto dto) {
//		return categoryService.createCategory(dto);
//	}

	@PostMapping
	public CategoryDto createCategory(@RequestParam("categoryName") String categoryName,
			@RequestParam("categoryImage") MultipartFile categoryImage) {
		return categoryService.createCategory(categoryName, categoryImage);
	}

	@PutMapping("/{id}")
	public ResponseEntity<SuccessResponseDto> updateCategory(@PathVariable Long id,
			@RequestParam(value = "categoryName", required = false) String categoryName,
			@RequestParam(value = "categoryImage", required = false) MultipartFile categoryImage) {
		categoryService.updateCategory(id, categoryName, categoryImage);
		return ResponseEntity.ok(new SuccessResponseDto("Category updated successfully", 200));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<SuccessResponseDto> deleteCategory(@PathVariable Long id) {
		categoryService.deleteCategory(id);
		return ResponseEntity.ok(new SuccessResponseDto("Category deleted successfully", 200));
	}

}
