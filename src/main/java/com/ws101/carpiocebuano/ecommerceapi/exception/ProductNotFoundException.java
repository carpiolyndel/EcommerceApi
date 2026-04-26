package com.ws101.carpiocebuano.ecommerceapi.exception;

/**
 * Exception thrown when a product is not found in the database.
 * Results in HTTP 404 Not Found response.
 *
 * @author Carpio, Lyndel J. & Cebuano, Irene A.
 */
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String message) {
        super(message);
    }
}