package com.ws101.carpiocebuano.ecommerceapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a product in the e-commerce system.
 *
 * This entity maps to the "products" table in the database.
 * Contains product details such as name, description, price,
 * category, and stock quantity.
 *
 * Lombok is used to reduce boilerplate code such as
 * getters, setters, and constructors.
 *
 * @author Carpio, Lyndel J.
 * @author Cebuano, Irene A.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 100, message = "Product name must be between 3 and 100 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stockQuantity;

    @Pattern(regexp = "^(http|https)://.*$", message = "Invalid URL format")
    private String imageUrl;
}