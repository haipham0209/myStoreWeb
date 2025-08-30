package com.example.demo.service;

import com.example.demo.dto.CategoryGroupDto;
import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductMapper productMapper;

	private static final int CATEGORY_PAGE_SIZE = 5;
	private static final int PRODUCT_PAGE_SIZE = 10;

	//page with category
	public List<CategoryGroupDto> getProductsGroupedByCategory(int page) {
		Pageable categoryPageable = PageRequest.of(page, CATEGORY_PAGE_SIZE);
		Page<Category> categoryPage = categoryRepository.findAll(categoryPageable);

		List<CategoryGroupDto> result = new ArrayList<>();

		for (Category category : categoryPage.getContent()) {
			Pageable productPageable = PageRequest.of(0, PRODUCT_PAGE_SIZE, Sort.by("createdAt").descending());
			Page<Product> productsPage = productRepository
					.findByCategory_CategoryIdOrderByCreatedAtDesc(category.getCategoryId(), productPageable);

			List<ProductDto> productDtos = productsPage.stream().map(productMapper::toDto).collect(Collectors.toList());

			CategoryGroupDto dto = new CategoryGroupDto();
			dto.setCategoryId(category.getCategoryId());
			
			dto.setCategoryName(category.getCategoryName());
			dto.setProducts(productDtos);

			result.add(dto);
		}
		return result;
	}
	
	public List<ProductDto> getDiscountedProducts() {
	    List<Product> products = productRepository.findByDiscountedPriceGreaterThan(BigDecimal.ZERO);
	    return products.stream()
	            .map(productMapper::toDto)
	            .collect(Collectors.toList());
	}

	// 

	public ProductDto getProductById(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
		return productMapper.toDto(product);
	}

	public ProductDto createProduct(ProductDto dto, MultipartFile productImage) {
	    if (productRepository.existsByBarcode(dto.getBarcode())) {
	        throw new DuplicateResourceException("Barcode is existed: " + dto.getBarcode());
	    }

	    String uniqueFilename = null;

	    if (productImage != null && !productImage.isEmpty()) {
	        String originalFilename = StringUtils.cleanPath(productImage.getOriginalFilename());
	        String fileExtension = "";

	        int dotIndex = originalFilename.lastIndexOf('.');
	        if (dotIndex > 0) {
	            fileExtension = originalFilename.substring(dotIndex);
	        }

	        uniqueFilename = UUID.randomUUID().toString() + fileExtension;

	        Path uploadPath = Paths.get("uploads/products");
	        try {
	            if (!Files.exists(uploadPath)) {
	                Files.createDirectories(uploadPath);
	            }
	            try (InputStream inputStream = productImage.getInputStream()) {
	                Path filePath = uploadPath.resolve(uniqueFilename);
	                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
	            }
	        } catch (IOException e) {
	            throw new RuntimeException("Could not save image file: " + uniqueFilename, e);
	        }
	    }

	    Product product = productMapper.toEntity(dto);

	    // Gán tên file ảnh đã upload vào entity product
	    if (uniqueFilename != null) {
	        product.setProductImage(uniqueFilename);
	    }

	    productRepository.save(product);
	    return productMapper.toDto(product);
	}


	public void updateProduct(Long id, ProductDto dto, MultipartFile productImage) {
	    Product product = productRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found with product id : " + id));

	    // Kiểm tra barcode trùng
	    if (!product.getBarcode().equals(dto.getBarcode())
	            && productRepository.existsByBarcode(dto.getBarcode())) {
	        throw new DuplicateResourceException("Barcode is existed: " + dto.getBarcode());
	    }

	    String uniqueFilename = null;

	    // Nếu có ảnh mới → xử lý lưu file
	    if (productImage != null && !productImage.isEmpty()) {
	        String originalFilename = StringUtils.cleanPath(productImage.getOriginalFilename());
	        String fileExtension = "";

	        int dotIndex = originalFilename.lastIndexOf('.');
	        if (dotIndex > 0) {
	            fileExtension = originalFilename.substring(dotIndex);
	        }

	        uniqueFilename = UUID.randomUUID().toString() + fileExtension;

	        Path uploadPath = Paths.get("uploads/products");
	        try {
	            if (!Files.exists(uploadPath)) {
	                Files.createDirectories(uploadPath);
	            }
	            try (InputStream inputStream = productImage.getInputStream()) {
	                Path filePath = uploadPath.resolve(uniqueFilename);
	                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
	            }
	        } catch (IOException e) {
	            throw new RuntimeException("Could not save image file: " + uniqueFilename, e);
	        }

	        // Cập nhật ảnh mới
	        product.setProductImage(uniqueFilename);
	    }

	    // Cập nhật các trường khác
	    product.setProductName(dto.getProductName());
	    product.setCategory(new Category(dto.getCategoryId()));
	    product.setPrice(dto.getPrice());
	    product.setCostPrice(dto.getCostPrice());
	    product.setDiscountedPrice(dto.getDiscountedPrice());
	    product.setDescription(dto.getDescription());
	    product.setStockQuantity(dto.getStockQuantity());
	    product.setBarcode(dto.getBarcode());
	    product.setUpdatedAt(LocalDateTime.now());


	    // Nếu không có ảnh mới thì giữ nguyên ảnh cũ → không set gì cả

	    productRepository.save(product);
	}


	public void deleteProduct(Long id) {
		if (!productRepository.existsById(id)) {
			throw new ResourceNotFoundException("Product not found with ID: " + id);
		}
		productRepository.deleteById(id);
	}

	public List<ProductDto> searchSuggest(String query) {
		List<Product> products = productRepository.findTop10ByProductNameContainingIgnoreCaseOrBarcodeContaining(query,	query);
		return products.stream().map(productMapper::toDto).collect(Collectors.toList());
	}

	public List<ProductDto> getProductsByCategoryId(Long categoryId) {
		List<Product> products = productRepository.findByCategory_CategoryId(categoryId);
		return products.stream().map(productMapper::toDto).collect(Collectors.toList());
	}

	public List<ProductDto> searchByProductName(String name) {
		List<Product> products = productRepository.findTop25ByProductNameContainingIgnoreCase(name);
		return products.stream().map(productMapper::toDto).collect(Collectors.toList());
	}
}
