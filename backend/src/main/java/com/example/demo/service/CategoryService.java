package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import com.example.demo.entity.Category;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepo;

	public List<CategoryDto> getAllCategories() {
		return categoryRepo.findAll().stream()
				.map(cat -> new CategoryDto(cat.getCategoryId(), cat.getCategoryName(), cat.getCategoryImage()))
				.collect(Collectors.toList());
	}

	public CategoryDto getCategoryById(Long id) {
		Category cat = categoryRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
		return new CategoryDto(cat.getCategoryId(), cat.getCategoryName(), cat.getCategoryImage());
	}

//	public CategoryDto createCategory(CategoryDto dto) {
//		if (categoryRepo.existsByCategoryName(dto.getCategoryName())) {
//			throw new DuplicateResourceException("Category name already exists: " + dto.getCategoryName());
//		}else if (categoryRepo.existsByCategoryImage(dto.getCategoryImage())) {
//			throw new DuplicateResourceException("Category image already exists: " + dto.getCategoryImage());
//		}
//		Category cat = new Category();
//		cat.setCategoryName(dto.getCategoryName());
//		cat.setCategory_image(dto.getCategoryImage());
//		categoryRepo.save(cat);
//		return new CategoryDto(cat.getCategoryId(), cat.getCategoryName(), cat.getCategoryImage());
//	}

	public CategoryDto createCategory(String categoryName, MultipartFile categoryImage) {
		if (categoryRepo.existsByCategoryName(categoryName)) {
			throw new DuplicateResourceException("Category name already exists: " + categoryName);
		}

		String originalFilename = StringUtils.cleanPath(categoryImage.getOriginalFilename());
		String fileExtension = "";

		int dotIndex = originalFilename.lastIndexOf('.');
		if (dotIndex > 0) {
			fileExtension = originalFilename.substring(dotIndex);
		}

		// Tạo tên file mới duy nhất bằng UUID + phần mở rộng
		String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

		Path uploadPath = Paths.get("uploads/categories");
		try {
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			try (InputStream inputStream = categoryImage.getInputStream()) {
				Path filePath = uploadPath.resolve(uniqueFilename);
				Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not save image file: " + uniqueFilename, e);
		}

		Category cat = new Category();
		cat.setCategoryName(categoryName);
		cat.setCategoryImage(uniqueFilename); // Lưu tên file mới có UUID
		categoryRepo.save(cat);

		return new CategoryDto(cat.getCategoryId(), cat.getCategoryName(), cat.getCategoryImage());
	}

//	public void updateCategory(Long id, CategoryDto dto) {
//		Category cat = categoryRepo.findById(id)
//				.orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
//		if (categoryRepo.existsByCategoryName(dto.getCategoryName())
//				&& !cat.getCategoryName().equals(dto.getCategoryName())) {
//			throw new DuplicateResourceException("Category name already exists: " + dto.getCategoryName());
//		}
//
//		cat.setCategoryName(dto.getCategoryName());
//		categoryRepo.save(cat);
//	}

	public CategoryDto updateCategory(Long id, String newCategoryName, MultipartFile newCategoryImage) {
		Category cat = categoryRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

		// Kiểm tra tên mới có khác và không trùng
		if (newCategoryName != null && !newCategoryName.trim().isEmpty()
				&& !newCategoryName.equals(cat.getCategoryName())) {

			cat.setCategoryName(newCategoryName);
		}

		// Nếu có ảnh mới, xử lý lưu file ảnh mới
		if (newCategoryImage != null && !newCategoryImage.isEmpty()) {
			String originalFilename = StringUtils.cleanPath(newCategoryImage.getOriginalFilename());
			String fileExtension = "";

			int dotIndex = originalFilename.lastIndexOf('.');
			if (dotIndex > 0) {
				fileExtension = originalFilename.substring(dotIndex);
			}

			String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

			Path uploadPath = Paths.get("uploads/categories");
			try {
				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}
				try (InputStream inputStream = newCategoryImage.getInputStream()) {
					Path filePath = uploadPath.resolve(uniqueFilename);
					Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
				}
			} catch (IOException e) {
				throw new RuntimeException("Could not save image file: " + uniqueFilename, e);
			}

			cat.setCategoryImage(uniqueFilename);
		}

		categoryRepo.save(cat);

		return new CategoryDto(cat.getCategoryId(), cat.getCategoryName(), cat.getCategoryImage());
	}

	public void deleteCategory(Long id) {
		if (!categoryRepo.existsById(id)) {
			throw new ResourceNotFoundException("Category not found with ID: " + id);
		}
		categoryRepo.deleteById(id);
	}
}
