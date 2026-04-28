<!-- ============================================ -->
<!-- LABORATORY 7 CONTENT                         -->
<!-- ============================================ -->
# 🛒 E-Commerce API

## 📌 Project Overview

This project is a RESTful API built using Spring Boot for our Laboratory 7.
It simulates a simple e-commerce backend where products can be created, viewed, updated, and deleted.

The goal of this project is to demonstrate:

* HTTP methods (GET, POST, PUT, DELETE)
* REST API design
* Proper status codes
* In-memory data storage (no database)

---

## 👨‍💻 Authors

* Carpio, Lyndel J.
* Cebuano, Irene

---

## ⚙️ Technologies Used

* Java 25
* Spring Boot 4.0.5
* Spring Web
* Lombok
* Gradle

---

## 🚀 How to Run the Application

1. Open the project in IntelliJ or VSCode
2. Make sure Java 25 is installed
3. Run the application:

```
./gradlew bootRun
```

4. Open browser or Postman:

```
http://localhost:8080/api/products
```

---

## 📡 API Endpoints

### 🔹 Get All Products

```
GET /api/products
```

Returns all products
Status: 200 OK

---

### 🔹 Get Product by ID

```
GET /api/products/{id}
```

Returns a specific product
Status: 200 OK / 404 Not Found

---

### 🔹 Create Product

```
POST /api/products
```

Sample Request Body:

```json
{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 50000,
  "category": "Electronics",
  "stockQuantity": 10,
  "imageUrl": "https://example.com/laptop.jpg"
}
```

Status: 201 Created

---

### 🔹 Update Product

```
PUT /api/products/{id}
```

Updates the entire product
Status: 200 OK / 404 Not Found

---

### 🔹 Delete Product

```
DELETE /api/products/{id}
```

Deletes the product
Status: 204 No Content

---

### 🔹 Filter by Category

```
GET /api/products/filter/category?category=Electronics
```

---

### 🔹 Filter by Price

```
GET /api/products/filter/price?min=100&max=1000
```

---

## 🧪 Testing

The API was tested using Postman.

Test cases performed:

* Created at least 3 products
* Retrieved all products
* Retrieved product by ID
* Updated product using PUT
* Deleted product
* Filtered products by category and price
* Tested invalid ID (returns 404)

---

## 📸 API Testing Screenshots

### 🔹 Get All Products
![Get All](testing/get-all.png)

### 🔹 Get Product by ID
![Get By ID](testing/get-by-id.png)

### 🔹 Create Product
![POST](testing/post.png)

### 🔹 Update Product
![PUT](testing/put.png)

### 🔹 Delete Product
![DELETE](testing/delete.png)

### 🔹 Filter by Category
![Category](testing/filter-price.png)

### 🔹 Filter by Price
![Price](testing/filter-price.png)

### 🔹 Error Handling (404)
![Error](testing/error-404.png)

---

## 📊 API Summary

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | /api/products      | Get all products   |
| GET    | /api/products/{id} | Get product by ID  |
| POST   | /api/products      | Create product     |
| PUT    | /api/products/{id} | Update product     |
| DELETE | /api/products/{id} | Delete product     |
| GET    | /filter/category   | Filter by category |
| GET    | /filter/price      | Filter by price    |

---

## ⚠️ Limitations

* Uses in-memory storage (data resets when the application restarts)
* No database integration
* No authentication

---

## 📝 Notes

This project uses in-memory storage, so all data will be lost when the application is restarted.

---

## ✅ Conclusion

This project successfully implements a RESTful API based on the requirements of Laboratory 7.
All CRUD operations and filtering features are working properly.







#
<!-- ============================================ -->
<!-- LABORATORY 8 CONTENT                         -->
<!-- ============================================ -->


# 🛒 E-Commerce API - Laboratory 8

## 📌 Project Overview

This project is a **full-stack e-commerce application** built with Spring Boot and a MySQL database. The backend provides a RESTful API with persistent data storage using Spring Data JPA and Hibernate. The frontend consumes these endpoints dynamically using the **Fetch API**, replacing the static mock data from Lab 7.

The goal of this project is to demonstrate:

* HTTP methods (GET, POST, PUT, DELETE, PATCH)
* REST API design with proper status codes
* **Database integration with JPA/Hibernate**
* **Frontend – Backend communication via Fetch API**
* **Asynchronous JavaScript with error handling**
* **Responsive design (mobile-first)**

---

## 👨‍💻 Authors

* Carpio, Lyndel J.
* Cebuano, Irene A.

---

## ⚙️ Technologies Used

| Backend | Frontend | Database |
|---------|----------|----------|
| Java 25 | HTML5 | MySQL |
| Spring Boot 4.0.5 | CSS3 | Hibernate (JPA) |
| Spring Web | JavaScript (ES6) | |
| Spring Data JPA | Fetch API | |
| Lombok | | |
| Gradle | | |

---

## 🗄️ Database Schema

The database `ecommerce_db` contains the following tables:

| Table | Description |
|-------|-------------|
| `products` | Product details (id, name, price, category, stock, imageUrl) |
| `categories` | Product categories (one-to-many with products) |
| `orders` | Customer orders (one-to-many with order_items) |
| `order_items` | Line items within an order (many-to-one with orders and products) |

### Entity Relationships

```
Category (1) ──┬── (*) Product
│
Order (1) ─────┴── (*) OrderItem ── (*) Product (1)
```

All relationships use JPA annotations (`@OneToMany`, `@ManyToOne`) with appropriate cascade and fetch strategies.

---

## 🚀 How to Run the Application

### Prerequisites
- Java 21 or higher (Java 25 also works)
- MySQL (XAMPP recommended)
- Git (optional)

### Step-by-step

1. **Clone the repository**
   ```bash
   git clone https://github.com/carpiolyndel/ecommerceapi.git
   cd ecommerceapi
   ```

2. **Start MySQL** (via XAMPP Control Panel)

3. **Create the database**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

4. **Configure database connection**  
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=JDBC:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

5. **Run the backend**
   ```bash
   ./gradlew bootRun
   ```

6. **Open the frontend** in your browser:
   ```
   http://localhost:8080
   ```

---

## 📡 API Endpoints (Backend)

All endpoints are prefixed with `/api/products`.

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/products` | Get all products | 200 OK |
| GET | `/api/products/{id}` | Get product by ID | 200 OK, 404 Not Found |
| POST | `/api/products` | Create new product | 201 Created, 400 Bad Request |
| PUT | `/api/products/{id}` | Full update | 200 OK, 404 Not Found |
| PATCH | `/api/products/{id}` | Partial update | 200 OK, 404 Not Found |
| DELETE | `/api/products/{id}` | Delete product | 204 No Content, 404 Not Found |
| GET | `/api/products/filter/category?category={name}` | Filter by category | 200 OK |
| GET | `/api/products/filter/price?min={min}&max={max}` | Filter by price range | 200 OK |
| GET | `/api/products/filter/name?name={keyword}` | Filter by name (contains) | 200 OK |

### Sample POST Request (JSON)
```json
{
  "name": "OFF! Overtime",
  "description": "Long-lasting protection",
  "price": 12.99,
  "category": "spray",
  "stockQuantity": 100,
  "imageUrl": "/images/download.jpg"
}
```

### Sample GET Response
```json
[
  {
    "id": 1,
    "name": "OFF! Overtime",
    "price": 12.99,
    "category": "spray",
    "stockQuantity": 100,
    "imageUrl": "/images/download.jpg"
  }
]
```

---

## 🎨 Frontend Features (Fetch API)

- **Dynamic product listing** on the landing page and products page (data fetched from the database).
- **Product detail page** with specifications and reviews.
- **Shopping cart** using `localStorage` (cart persists across browser sessions).
- **Checkout form** with client-side validation.
- **Order history** stored in `localStorage` and displayed on the account page.
- **Responsive design** – works on desktop, tablet, and mobile (media queries from Lab 3 preserved).
- **Error handling** – displays user-friendly messages when the backend is unreachable or returns an error.

---

## 🧪 Testing

### Backend (Postman / cURL)
All endpoints were tested manually. The server was restarted multiple times to confirm data persistence (unlike Lab 7). Sample cURL commands:

```bash
# Create a product
curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -d '{"name":"OFF! Overtime","price":12.99,"category":"spray","stockQuantity":100}'

# Get all products
curl http://localhost:8080/api/products

# Filter by category
curl "http://localhost:8080/api/products/filter/category?category=spray"
```

### Frontend (Browser)
- Opened `http://localhost:8080` – products load from the database.
- Added items to cart, updated quantities, removed items – all worked.
- Checked responsive behavior using DevTools device toolbar.
- Console showed no CORS or 404 errors.

---

## 📸 Screenshots (Proof of Testing)

| Test | Screenshot                             |
|------|----------------------------------------|
| Desktop view (products loaded from DB) | `testing2/task8_desktop_view.png`      |
| Mobile responsive view | `testing2/task8_mobile_view.png`       |
| Cart page with items | `testing2/task8_cart_page.png`         |
| Browser console – no errors | `testing2/task8_console_no_errors.png` |
| Database tables in phpMyAdmin | `testing2/task8_database_tables.png`   |
| Account Order with History | `testing2/task8_account_order.png`     |

*(All screenshots are stored in the `/testing2` folder of the repository.)*

## ✅ Conclusion

This project successfully completes **Laboratory 8**:

- ✅ Backend migrated from in‑memory storage to MySQL using Spring Data JPA.
- ✅ REST API supports full CRUD + filtering.
- ✅ Frontend consumes the API via Fetch API, replacing static arrays.
- ✅ Cart, checkout, and order history are implemented client‑side.
- ✅ The application is responsive and free of CORS/console errors.
- ✅ All required screenshots and documentation are provided.

---

## 🔗 GitHub Repository

[https://github.com/carpiolyndel/ecommerceapi](https://github.com/carpiolyndel/ecommerceapi)

---