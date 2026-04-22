package com.ws101.carpiocebuano.ecommerceapi.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a product in the e-commerce system.
 *
 * This model contains product details such as name,
 * description, price, category, and stock quantity.
 *
 * Lombok is used to reduce boilerplate code such as
 * getters, setters, and constructors.
 *
 * @author Carpio, Lyndel J.
 * @author Cebuano, Irene A.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    /**
     * Unique identifier of the product.
     */
    private Long id;

    /**
     * Name of the product.
     */
    @NotBlank(message = "Product name is required")
    private String name;

    /**
     * Description of the product.
     */
    private String description;

    /**
     * Price of the product.
     */
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    private Double price;

    /**
     * Category of the product.
     */
    @NotBlank(message = "Category is required")
    private String category;

    /**
     * Available stock quantity.
     */
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stockQuantity;

    /**
     * Image URL of the product (optional).
     */
    private String imageUrl;
}