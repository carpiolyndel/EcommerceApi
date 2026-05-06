package com.ws101.carpiocebuano.ecommerceapi;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiIntegrationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
        // Basic context load test
    }

    @Test
    void shouldAllowPublicProductList() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/products", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldReturnUnauthorizedForProtectedProductCreation() {
        String payload = "{" +
                "\"name\":\"Test Product\"," +
                "\"description\":\"Test product description\"," +
                "\"price\":100.0," +
                "\"category\":\"Test\"," +
                "\"stockQuantity\":10," +
                "\"imageUrl\":\"https://example.com/test.jpg\"}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity("/api/products", request, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void shouldRegisterNewUser() {
        String payload = "{" +
                "\"username\":\"testuser\"," +
                "\"password\":\"Password123\"," +
                "\"role\":\"USER\"}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).contains("\"message\":\"User registered successfully\"");
        assertThat(response.getBody()).contains("\"username\":\"testuser\"");
    }

    @Test
    void shouldReturnUnauthorizedOnAuthCheckWhenNotLoggedIn() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/auth/check", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).contains("\"message\":\"Unauthorized\"");
    }
}
