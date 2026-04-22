package com.ws101.carpiocebuano.ecommerceapi.exception;

/**
 * Custom exception for product not found.
 */
public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(String message) {
        super(message);
    }
}