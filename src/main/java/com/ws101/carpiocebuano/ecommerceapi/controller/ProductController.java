package com.ws101.carpiocebuano.ecommerceapi.controller;

import com.ws101.carpiocebuano.ecommerceapi.model.Product;
import com.ws101.carpiocebuano.ecommerceapi.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

/**
 * REST Controller for handling product-related API requests.
 *
 * @author Carpio, Lyndel J. & Cebuano, Irene A.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.created(URI.create("/api/products/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter/category")
    public ResponseEntity<List<Product>> filterByCategory(@RequestParam String category) {
        return ResponseEntity.ok(productService.filterByCategory(category));
    }

    @GetMapping("/filter/price")
    public ResponseEntity<List<Product>> filterByPrice(@RequestParam Double min,
                                                       @RequestParam Double max) {
        return ResponseEntity.ok(productService.filterByPriceRange(min, max));
    }

    @GetMapping("/filter/name")
    public ResponseEntity<List<Product>> filterByName(@RequestParam String name) {
        return ResponseEntity.ok(productService.filterByName(name));
    }
}