Laboratory 9: Securing the API with Sessions & Input Validation

## Overview
REST API for OFF! insect repellent products with Session-Based Authentication and Bean Validation. Built with Spring Boot, Spring Security, and Spring Data JPA.

## Features
- ✅ User registration and login with session management
- ✅ Role-based access control (USER/ADMIN)
- ✅ Product management (CRUD operations)
- ✅ Comprehensive input validation with detailed error messages
- ✅ Global exception handling
- ✅ Secure password hashing using BCrypt
- ✅ Database persistence with MySQL and JPA

---

## Security Architecture

### Session-Based Authentication
The API uses HTTP Session-based authentication with cookies for stateful sessions instead of stateless JWT tokens.

**Authentication Flow:**
1. User registers via `POST /api/auth/register`
2. User logs in via `POST /login` (form-based with username/password)
3. Server creates HTTP Session and sets `JSESSIONID` cookie
4. Browser/client automatically includes cookie in subsequent requests
5. Spring Security validates session for protected endpoints
6. User logs out via `POST /logout`, session is invalidated

**Key Components:**
- **SecurityFilterChain**: Configures URL authorization rules and permit patterns
- **CustomUserDetailsService**: Loads users from database during authentication process
- **PasswordEncoder (BCrypt)**: Hashes passwords with 10 rounds before storage
- **@PreAuthorize**: Method-level role-based access control on endpoints
- **SecurityContext**: Thread-local storage for current user authentication info

### Authentication vs Authorization
- **Authentication**: Verifies user identity (login process). Answers "Who are you?"
- **Authorization**: Determines what authenticated users can do (role-based access). Answers "What can you do?"

**Example:**
- Authentication: User logs in with username "admin" and correct password
- Authorization: System checks if "admin" has ROLE_ADMIN to create products

---

## Input Validation

### Product Entity Constraints
| Field | Constraints | Error Message |
|-------|-------------|---------------|
| name | @NotBlank, @Size(min=3, max=100) | "Product name is required", "must be between 3 and 100 characters" |
| description | @Size(max=500) | "Description cannot exceed 500 characters" |
| price | @NotNull, @Positive | "Price is required", "Price must be positive" |
| category | @NotBlank | "Category is required" |
| stockQuantity | @NotNull, @Min(0) | "Stock quantity is required", "Stock must be non-negative" |
| imageUrl | @Pattern(regexp="^(http\|https)://.*$") | "Invalid URL format" |

### RegisterRequest DTO
| Field | Constraints | Error Message |
|-------|-------------|---------------|
| username | @NotBlank, @Size(min=3, max=50) | "Username is required", "must be between 3 and 50 characters" |
| password | @NotBlank, @Size(min=8) | "Password is required", "must be at least 8 characters" |
| role | @Pattern(regexp="^(USER\|ADMIN)$") | "Role must be either USER or ADMIN" |

### Validation Response Format
Invalid requests return **400 Bad Request** with detailed field errors:

```json
{
  "timestamp": "2026-05-07T00:27:20.123456",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid request data. Please check the fields.",
  "details": {
    "price": "Price must be positive",
    "stockQuantity": "Stock must be non-negative"
  }
}
```

---

## API Reference

### Public Endpoints (No Authentication Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/filter/category?category={name}` | Filter products by category |
| GET | `/api/products/filter/price?min={min}&max={max}` | Filter products by price range |
| GET | `/api/products/filter/name?name={name}` | Filter products by name |
| POST | `/api/auth/register` | Register new user (username, password, role) |
| GET | `/api/auth/csrf` | Get CSRF token (for form login) |

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login with username/password (form data, sets JSESSIONID cookie) |
| POST | `/logout` | Logout and invalidate session |
| GET | `/api/auth/check` | Check if user is authenticated |

### Public Product Access
The API allows unauthenticated access to product browsing endpoints using HTTP GET methods. Only modification operations require authentication and the ADMIN role.

### Protected Endpoints (Authentication Required)

**ADMIN-Only Endpoints (Requires ROLE_ADMIN):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create new product |
| PUT | `/api/products/{id}` | Update existing product |
| DELETE | `/api/products/{id}` | Delete product |

**User Endpoints (ROLE_USER or ROLE_ADMIN):**
- Orders and cart management (can be implemented)

### Image View and Product Media
The frontend supports product information with image URLs, and the README includes guidance for capturing screen demos.

- The `imageUrl` field on products must be a valid `http://` or `https://` URL.
- Static UI assets are served from `src/main/resources/static/images/`.
- The login/register page at `/signup.html` includes the session-based form login flow.

### Error Responses

**401 Unauthorized** - User not authenticated:
```json
{
  "status": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden** - User lacks required role:
```json
{
  "status": 403,
  "error": "Access Denied",
  "message": "You do not have permission to access this resource"
}
```

**400 Bad Request** - Validation failed:
```json
{
  "status": 400,
  "error": "Validation Failed",
  "details": {
    "fieldName": "error message"
  }
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,        -- BCrypt hashed
  role VARCHAR(50) NOT NULL,             -- ROLE_USER or ROLE_ADMIN
  enabled BOOLEAN DEFAULT TRUE,
  account_non_expired BOOLEAN DEFAULT TRUE,
  account_non_locked BOOLEAN DEFAULT TRUE,
  credentials_non_expired BOOLEAN DEFAULT TRUE
);
```

### Products Table
```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  price DOUBLE NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock_quantity INT NOT NULL,
  image_url VARCHAR(255)
);
```

---

## Getting Started

### Prerequisites
- Java 25+
- MySQL 5.5+ (running on localhost:3306)
- Gradle 8.0+

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/carpiocebuano/EcommerceApi.git
   cd EcommerceApi
   ```

2. **Configure Database**
   - Ensure MySQL is running
   - Create database: `CREATE DATABASE ecommerce_db;`
   - Update `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
     spring.datasource.username=root
     spring.datasource.password=your_password
     ```

3. **Run the Application**
   ```bash
   ./gradlew bootRun
   ```
   Server starts at `http://localhost:8080`

4. **Access the Application**
   - Frontend: `http://localhost:8080/signup.html`
   - API: `http://localhost:8080/api/products`

---

## Testing

### Postman Testing Flow

#### 1. Register Users
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "Password123",
  "role": "USER"
}
```
Expected: `201 Created`

#### 2. Login
```
POST http://localhost:8080/login
Content-Type: application/x-www-form-urlencoded

username=testuser&password=Password123
```
Expected: `302 Redirect` + `JSESSIONID` cookie set

#### 3. Check Authentication
```
GET http://localhost:8080/api/auth/check
```
Expected: `200 OK` with `{"message": "Authenticated"}`

#### 4. Test Protected Endpoint (USER)
```
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Product",
  "price": 99.99,
  "category": "Test",
  "stockQuantity": 10
}
```
Expected: `403 Forbidden` (USER cannot create products)

#### 5. Test Validation
```
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Invalid",
  "price": -10,
  "category": "Test",
  "stockQuantity": -5
}
```
Expected: `400 Bad Request` with validation error details

#### 6. Logout
```
POST http://localhost:8080/logout
```
Expected: `302 Redirect` + session invalidated

### Browser Testing
- Navigate to `http://localhost:8080/signup.html`
- Register a new user
- Login with credentials
- Check browser console for auth/validation errors
- Verify protected pages redirect to login if not authenticated

---

## Screenshots

![Register Success](tLab9/01-register-success.png)
![Password Encrypted in Database](tLab9/02-password-encrypted-db.png)
![Login Success and Session Creation](tLab9/03-login-success-session-create.png)
![Access with Login Success](tLab9/04-access-with-login-success.png)
![Login Page UI](tLab9/05-login-page-ui.png)
![Register Page UI](tLab9/06-register-page-ui.png)
![Authentication Check Login](tLab9/07-auth-check-login.png)
![Access Denied for User](tLab9/08-access-denied-for-user.png)
![Access for Admin](tLab9/09-for-adminn.png)
![Authentication Check Logout](tLab9/10-auth-checck-logout.png)
![Register Success](tLab9/11-register-success.png)
![Negative Price Validation](tLab9/12-negative-price.png)
![Empty Name Validation](tLab9/13-empty-name.png)
![With Cookies](tLab9/14-with-cookies.png)

## Code Quality

### Security Configuration (SecurityConfig.java)
- **PasswordEncoder**: BCryptPasswordEncoder with 10 rounds
- **SecurityFilterChain**: Defines URL authorization rules
  - Public endpoints: `/api/products/**`, `/api/auth/**`
  - Protected endpoints: All other paths require authentication
- **Form Login**: Configured at `/login` with redirect on success
- **Session Management**: JSESSIONID cookie for stateful sessions
- **CSRF**: Disabled for API simplicity (enable in production)

### Input Validation
- **Bean Validation Annotations**: Applied on entity and DTO fields
- **GlobalExceptionHandler**: Catches `MethodArgumentNotValidException`
- **Error Messages**: User-friendly, field-specific validation feedback
- **HTTP Status**: Returns `400 Bad Request` with error details

### Password Security
- **BCrypt Hashing**: Passwords hashed with adaptive salting (10 rounds)
- **No Plain-Text Storage**: Database stores only BCrypt hash
- **Automatic Verification**: Spring Security handles comparison during login
- **Hash Example**: `Password123` → `$2a$10$SNZrp5KADmfnE0FrdcLM3OtkrszQHyEFIoqzQUC/qkylhmAySKWPq`

### Exception Handling (GlobalExceptionHandler.java)
- `@RestControllerAdvice`: Global exception handler for all REST endpoints
- `MethodArgumentNotValidException`: Validation errors → `400 Bad Request`
- `AccessDeniedException`: Authorization failures → `403 Forbidden`
- `ProductNotFoundException`: Missing products → `404 Not Found`
- `DataIntegrityViolationException`: Database constraints → `400 Bad Request`
- Generic exceptions → `500 Internal Server Error`

---

## Project Structure

```
EcommerceApi/
├── src/main/java/com/ws101/carpiocebuano/ecommerceapi/
│   ├── config/
│   │   ├── CorsConfig.java          -- CORS configuration
│   │   └── SecurityConfig.java      -- Spring Security setup
│   ├── controller/
│   │   ├── AuthController.java      -- Register, login endpoints
│   │   └── ProductController.java   -- Product CRUD endpoints
│   ├── dto/
│   │   ├── RegisterRequest.java     -- User registration request
│   │   ├── LoginRequest.java        -- User login request
│   │   └── ErrorResponse.java       -- Error response format
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java -- Central exception handling
│   │   └── ProductNotFoundException.java
│   ├── model/
│   │   ├── User.java                -- User entity (implements UserDetails)
│   │   ├── Product.java             -- Product entity
│   │   ├── Order.java               -- Order entity
│   │   ├── OrderItem.java           -- Order line item
│   │   └── Category.java            -- Product category
│   ├── repository/
│   │   ├── UserRepository.java      -- User database queries
│   │   ├── ProductRepository.java   -- Product database queries
│   │   ├── OrderRepository.java
│   │   └── CategoryRepository.java
│   ├── service/
│   │   ├── CustomUserDetailsService.java -- Load users for auth
│   │   └── ProductService.java      -- Business logic for products
│   └── EcommerceApiApplication.java -- Spring Boot entry point
├── src/main/resources/
│   ├── application.properties       -- Database and app configuration
│   └── static/                      -- HTML, CSS, JS frontend
├── src/test/java/                   -- Unit and integration tests
├── build.gradle                     -- Gradle build configuration
└── README.md                        -- This file
```

---

## Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 4.0.5 | Web framework & auto-configuration |
| Spring Security | Latest | Authentication & authorization |
| Spring Data JPA | Latest | Database ORM & queries |
| MySQL | 5.5+ | Relational database |
| Lombok | Latest | Reduce boilerplate (getters, setters) |
| Jakarta Bean Validation | Latest | Input validation annotations |
| Gradle | 8.0+ | Build automation |
| Java | 25+ | Programming language |

---

## Authors
- **Carpio, Lyndel J.**
- **Cebuano, Irene A.**

---

## License
This project is part of the Web Systems 101 course.

---

## Support
For issues or questions, contact the development team or file an issue on GitHub.

---

## Version History
- **v1.0.0** (May 2026): Initial release with authentication, authorization, and validation
 