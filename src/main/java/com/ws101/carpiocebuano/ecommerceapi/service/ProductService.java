package com.ws101.carpiocebuano.ecommerceapi.service;

import com.ws101.carpiocebuano.ecommerceapi.model.Product;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service class for product-related operations.
 *
 * Provides business logic for managing products using in-memory storage.
 * Acts as an intermediary between controller and data.
 *
 * @see Product
 */
@Service
public class ProductService {

    private final List<Product> productList = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong();

    /**
     * Initializes product list with sample data.
     */
    public ProductService() {
        for (int i = 1; i <= 10; i++) {
            productList.add(new Product(
                    idCounter.incrementAndGet(),
                    "Product " + i,
                    "Description " + i,
                    10.0 * i,
                    "Category" + (i % 3),
                    5 + i,
                    "https://example.com/img" + i
            ));
        }
    }

    /**
     * Retrieves all products.
     *
     * @return list of products
     */
    public List<Product> getAllProducts() {
        return productList;
    }

    /**
     * Finds a product by ID.
     *
     * @param id product ID
     * @return optional product
     */
    public Optional<Product> getProductById(Long id) {
        return productList.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    /**
     * Creates a new product.
     *
     * @param product product to create
     * @return created product
     */
    public Product createProduct(Product product) {
        product.setId(idCounter.incrementAndGet());
        productList.add(product);
        return product;
    }

    /**
     * Updates an existing product.
     *
     * @param id product ID
     * @param product updated product data
     * @return updated product if found
     */
    public Optional<Product> updateProduct(Long id, Product product) {
        return getProductById(id).map(existing -> {
            existing.setName(product.getName());
            existing.setDescription(product.getDescription());
            existing.setPrice(product.getPrice());
            existing.setCategory(product.getCategory());
            existing.setStockQuantity(product.getStockQuantity());
            existing.setImageUrl(product.getImageUrl());
            return existing;
        });
    }

    /**
     * Deletes a product by ID.
     *
     * @param id product ID
     * @return true if deleted
     */
    public boolean deleteProduct(Long id) {
        return productList.removeIf(p -> p.getId().equals(id));
    }

    /**
     * Filters products by category.
     *
     * @param category category name
     * @return list of matching products
     */
    public List<Product> filterByCategory(String category) {
        List<Product> result = new ArrayList<>();
        for (Product p : productList) {
            if (p.getCategory().equalsIgnoreCase(category)) {
                result.add(p);
            }
        }
        return result;
    }

    /**
     * Filters products by price range.
     *
     * @param min minimum price
     * @param max maximum price
     * @return list of matching products
     */
    public List<Product> filterByPrice(double min, double max) {
        List<Product> result = new ArrayList<>();
        for (Product p : productList) {
            if (p.getPrice() >= min && p.getPrice() <= max) {
                result.add(p);
            }
        }
        return result;
    }
}