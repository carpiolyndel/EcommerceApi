package com.ws101.carpiocebuano.ecommerceapi.service;

import com.ws101.carpiocebuano.ecommerceapi.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service class for loading user-specific data during authentication.
 *
 * This service is used by Spring Security's DaoAuthenticationProvider
 * to retrieve user details from tahe database.
 *
 * @author Carpio, Lyndel J.
 * @author Cebuano, Irene A.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Constructor for dependency injection.
     *
     * @param userRepository repository for user database operations
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Locates a user based on the username.
     * Called by Spring Security during the authentication process.
     *
     * @param username the username identifying the user
     * @return UserDetails object containing user information
     * @throws UsernameNotFoundException if user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}