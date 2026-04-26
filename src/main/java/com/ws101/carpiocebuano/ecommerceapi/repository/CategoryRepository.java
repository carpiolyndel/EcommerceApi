package com.ws101.carpiocebuano.ecommerceapi.repository;

import com.ws101.carpiocebuano.ecommerceapi.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Category entity.
 *
 * @author Carpio, Lyndel J. & Cebuano, Irene A.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Method naming query - find by name
    Optional<Category> findByName(String name);

    // Check if category exists by name
    boolean existsByName(String name);
}