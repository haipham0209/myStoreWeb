package com.example.demo.controller.admin;

import com.example.demo.dto.CategoryGroupDto;
import com.example.demo.dto.ProductDto;
import com.example.demo.dto.SuccessResponseDto;
import com.example.demo.service.ProductService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

	@Autowired
	private ProductService productService;

	// 1. Lấy tất cả sản phẩm dạng 2 chiều (theo category)
	@GetMapping
	public List<CategoryGroupDto> getProductsGroupedByCategory(@RequestParam(defaultValue = "0") int page) {
		return productService.getProductsGroupedByCategory(page);
	}

	// 9. Lấy tất cả sản phẩm đang giảm giá
	// 9. Lấy tất cả sản phẩm đang giảm giá
	@GetMapping("/discounted")
	public List<ProductDto> getDiscountedProducts() {
		return productService.getDiscountedProducts();
	}

//

	// 2. Lấy chi tiết sản phẩm
	@GetMapping("/{productId}")
	public ProductDto getProductById(@PathVariable Long productId) {
		return productService.getProductById(productId);
	}

	// 3. add
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ProductDto createProduct(@ModelAttribute ProductDto dto,
			@RequestParam("imageFile") MultipartFile imageFile) {
		return productService.createProduct(dto, imageFile);
	}

	// 4. Cập nhật sản phẩm
	@PutMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<SuccessResponseDto> updateProduct(@PathVariable Long productId,
			@ModelAttribute @Valid ProductDto dto,
			@RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

		productService.updateProduct(productId, dto, imageFile);
		return ResponseEntity.ok(new SuccessResponseDto("Product updated successfully", 200));
	}

	// 5. Xoá sản phẩm
	@DeleteMapping("/{productId}")
	public ResponseEntity<SuccessResponseDto> deleteProduct(@PathVariable Long productId) {
		productService.deleteProduct(productId);
		return ResponseEntity.ok(new SuccessResponseDto("Product deleted successfully", 200));
	}

	// 6. Tìm kiếm gợi ý (barcode hoặc tên gần giống)
	@GetMapping("/search-suggest")
	public List<ProductDto> searchSuggest(@RequestParam("query") String query) {
		return productService.searchSuggest(query);
	}

	// 7. Lấy tất cả sản phẩm theo category cụ thể
//	@GetMapping("/category/{categoryId}")
//	public List<ProductDto> getProductsByCategory(@PathVariable Long categoryId) {
//		return productService.getProductsByCategoryId(categoryId);
//	}
	@GetMapping("/category")
	public List<ProductDto> getProductsByCategory(@RequestParam Long categoryId) {
		return productService.getProductsByCategoryId(categoryId);
	}

	// 8. Tìm kiếm theo tên sản phẩm (gần đúng hoặc chính xác)
	@GetMapping("/search")
	public List<ProductDto> searchByProductName(@RequestParam("name") String name) {
		return productService.searchByProductName(name);
	}

}
