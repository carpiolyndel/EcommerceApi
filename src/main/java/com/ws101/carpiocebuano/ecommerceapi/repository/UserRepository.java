package com.ws101.carpiocebuano.ecommerceapi.repository;

import com.ws101.carpiocebuano.ecommerceapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides database operations for user management.
 *
 * Extends JpaRepository to inherit basic CRUD operations.
 *
 * @author Carpio, Lyndel J.
 * @author Cebuano, Irene A.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their username.
     * Used during authentication to load user details.
     *
     * @param username the username to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a user exists with the given username.
     * Used during registration to prevent duplicate usernames.
     *
     * @param username the username to check
     * @return true if username already exists
     */
    boolean existsByUsername(String username);
}