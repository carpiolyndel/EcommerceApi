package com.ws101.carpiocebuano.ecommerceapi.controller;

import com.ws101.carpiocebuano.ecommerceapi.model.Product;
import com.ws101.carpiocebuano.ecommerceapi.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling product-related API requests.
 *
 * Provides endpoints for CRUD operations and filtering products.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    /**
     * Constructor-based dependency injection.
     *
     * @param productService service layer for product operations
     */
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Retrieves all products.
     *
     * @return list of products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /**
     * Retrieves a product by ID.
     *
     * @param id product ID
     * @return product if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    /**
     * Creates a new product.
     *
     * @param product product data
     * @return created product
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    /**
     * Updates an existing product.
     *
     * @param id product ID
     * @param product updated data
     * @return updated product
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @Valid @RequestBody Product product) {
        return productService.updateProduct(id, product)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    /**
     * Deletes a product by ID.
     *
     * @param id product ID
     * @return no content if deleted
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.noContent().build();
        }
        throw new RuntimeException("Product not found");
    }

    /**
     * Filters products by category.
     *
     * @param category category name
     * @return filtered list
     */
    @GetMapping("/filter/category")
    public ResponseEntity<List<Product>> filterByCategory(@RequestParam String category) {
        return ResponseEntity.ok(productService.filterByCategory(category));
    }

    /**
     * Filters products by price range.
     *
     * @param min minimum price
     * @param max maximum price
     * @return filtered list
     */
    @GetMapping("/filter/price")
    public ResponseEntity<List<Product>> filterByPrice(@RequestParam double min,
                                                       @RequestParam double max) {
        return ResponseEntity.ok(productService.filterByPrice(min, max));
    }
}