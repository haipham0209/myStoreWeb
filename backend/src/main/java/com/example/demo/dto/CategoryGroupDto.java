package com.example.demo.dto;

import java.util.List;

public class CategoryGroupDto {

    private Long categoryId;
    private String categoryName;
    private List<ProductDto> products;

    public CategoryGroupDto() {}

    public CategoryGroupDto(Long categoryId, String categoryName, List<ProductDto> products) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.products = products;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(List<ProductDto> products) {
        this.products = products;
    }
}
