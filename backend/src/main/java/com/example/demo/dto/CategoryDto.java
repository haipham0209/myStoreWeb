package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {
    private Long categoryId;
    private String categoryName;
    private String categoryImage;
	public Long getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
	 @NotBlank(message = "Category name is required")
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

    public CategoryDto() {}

    public CategoryDto(Long categoryId, String categoryName, String categoryImage) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryImage = categoryImage;
    }
    @NotBlank(message = "Category image is required")
	public String getCategoryImage() {
		return categoryImage;
	}
	public void setCategoryImage(String categoryImage) {
		this.categoryImage = categoryImage;
	}
}
