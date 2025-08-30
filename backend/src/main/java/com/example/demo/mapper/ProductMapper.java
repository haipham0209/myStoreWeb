package com.example.demo.mapper;

import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setProductId(product.getId());
        dto.setCategoryId(product.getCategory().getCategoryId());
        dto.setCategoryName(product.getCategory().getCategoryName());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        dto.setCostPrice(product.getCostPrice());
        dto.setDiscountedPrice(product.getDiscountedPrice());
        dto.setDescription(product.getDescription());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setBarcode(product.getBarcode());
        dto.setProductImage(product.getProductImage());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    public Product toEntity(ProductDto dto) {
        Product product = new Product();
        product.setId(dto.getProductId());
        product.setCategory(new Category(dto.getCategoryId())); // chỉ set ID
        product.setProductName(dto.getProductName());
        product.setPrice(dto.getPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setDiscountedPrice(dto.getDiscountedPrice());
        product.setDescription(dto.getDescription());
        product.setStockQuantity(dto.getStockQuantity());
        product.setBarcode(dto.getBarcode());
        product.setProductImage(dto.getProductImage());
        return product;
    }
}
