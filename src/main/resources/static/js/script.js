// ========================================
// TASK 1: PRODUCT DATA (From Database via Fetch API)
// ========================================

let products = [];
let cart = [];

class Product {
    constructor(id, name, price, image, description, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.category = category;
    }
}

// Fetch products from Spring Boot backend
async function fetchProductsFromBackend() {
    try {
        const response = await fetch('http://localhost:8080/api/products');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const backendProducts = await response.json();

        products = backendProducts.map(product => new Product(
            product.id,
            product.name,
            product.price,
            product.imageUrl ? product.imageUrl.replace('/images/', '') : 'default-product.jpg',
            product.description || 'No description available',
            product.category
        ));

        console.log('Products loaded from database:', products.length);
        refreshCurrentPage();

    } catch (error) {
        console.error('Error fetching products:', error);
        showMessage('Failed to load products from server. Make sure backend is running.', 'error');
    }
}

// ========================================
// SHOPPING CART FUNCTIONS
// ========================================

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showMessage(message, type) {
    let container = document.getElementById('message-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'message-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.padding = '12px 20px';
    msg.style.borderRadius = '8px';
    msg.style.marginTop = '10px';
    msg.style.cursor = 'pointer';
    msg.style.fontFamily = 'Arial, sans-serif';
    msg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    if (type === 'success') {
        msg.style.backgroundColor = '#28a745';
        msg.style.color = 'white';
    } else if (type === 'error') {
        msg.style.backgroundColor = '#dc3545';
        msg.style.color = 'white';
    } else {
        msg.style.backgroundColor = '#ff6600';
        msg.style.color = 'white';
    }

    container.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    msg.onclick = () => msg.remove();
}

function addToCart(productId, productName, productPrice, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
        showMessage(productName + ' quantity updated!', 'success');
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
        });
        showMessage(productName + ' added to cart!', 'success');
    }

    saveCart();
    updateCartCount();
}

function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        cart = cart.filter(item => item.id !== productId);
        showMessage(item.name + ' removed from cart', 'info');
        saveCart();
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) renderCart();
        if (window.location.pathname.includes('checkout')) updateCheckoutSummary();
    }
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            if (window.location.pathname.includes('cart.html')) renderCart();
            if (window.location.pathname.includes('checkout')) updateCheckoutSummary();
        }
    }
}

function calculateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
}

function updateCartCount() {
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    const cartLinks = document.querySelectorAll('nav a[href="cart.html"]');

    cartLinks.forEach(link => {
        if (cartCount > 0) {
            let badge = link.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.backgroundColor = '#ff6600';
                badge.style.color = 'white';
                badge.style.borderRadius = '50%';
                badge.style.padding = '2px 6px';
                badge.style.fontSize = '0.7rem';
                badge.style.marginLeft = '5px';
                link.appendChild(badge);
            }
            badge.textContent = cartCount;
        } else {
            const badge = link.querySelector('.cart-badge');
            if (badge) badge.remove();
        }
    });
}

// ========================================
// PRODUCTS PAGE (products.html)
// ========================================

function renderProducts() {
    const productContainer = document.querySelector('.products-container');
    if (!productContainer) return;

    if (products.length === 0) {
        productContainer.innerHTML = '<div class="loading">Loading products from database...</div>';
        return;
    }

    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('article');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
            <h2>${product.name}</h2>
            <p class="product-description">${product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}</p>
            <p class="product-price">₱${product.price.toFixed(2)}</p>
            <button class="view-details" data-id="${product.id}">View Details</button>
            <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });
}

function attachFilterEventListeners() {
    const filterForm = document.querySelector('#filter-form');
    if (!filterForm) return;

    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const priceFilter = document.querySelector('input[name="price"]:checked');
        const categoryFilter = document.querySelector('input[name="category"]:checked');

        let filteredProducts = [...products];

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
        }

        if (priceFilter) {
            filteredProducts = filteredProducts.filter(p => {
                if (priceFilter.value === 'under-10') return p.price < 10;
                if (priceFilter.value === '10-15') return p.price >= 10 && p.price <= 15;
                if (priceFilter.value === 'above-15') return p.price > 15;
                return true;
            });
        }

        const productContainer = document.querySelector('.products-container');
        if (!productContainer) return;

        productContainer.innerHTML = '';

        if (filteredProducts.length === 0) {
            productContainer.innerHTML = '<div class="no-products">No products match your filters.</div>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('article');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
                <h2>${product.name}</h2>
                <p class="product-description">${product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}</p>
                <p class="product-price">₱${product.price.toFixed(2)}</p>
                <button class="view-details" data-id="${product.id}">View Details</button>
                <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            `;
            productContainer.appendChild(productCard);
        });
    });

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
            renderProducts();
        });
    }
}

// ========================================
// PRODUCT DETAIL PAGE (detail.html)
// ========================================

function renderProductDetail() {
    const productId = sessionStorage.getItem('selectedProductId');
    const product = products.find(p => p.id == productId);
    const container = document.getElementById('product-detail-container');

    if (!container) return;

    if (!product) {
        container.innerHTML = '<div class="error">Product not found. <a href="/products.html">Back to Products</a></div>';
        return;
    }

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-image">
                <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <p class="price">₱${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <p class="category"><strong>Category:</strong> ${product.category}</p>
                <form id="add-to-cart-form">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" required>
                    <button type="submit">Add to Cart</button>
                </form>
                <button class="back-btn" onclick="window.location.href='/products.html'">← Back to Products</button>
            </div>
        </div>
        <div class="specifications">
            <h2>Technical Specifications</h2>
            <table>
                <tr><th>Specification</th><th>Details</th></tr>
                <tr><td><strong>Active Ingredient</strong></td><td>DEET 25%</td></tr>
                <tr><td><strong>Protection Duration</strong></td><td>Up to 8 hours</td></tr>
                <tr><td><strong>Application</strong></td><td>Spray evenly on exposed skin</td></tr>
                <tr><td><strong>Water Resistance</strong></td><td>Water-resistant up to 4 hours</td></tr>
                <tr><td><strong>Scent</strong></td><td>Fresh, mild fragrance</td></tr>
                <tr><td><strong>Size</strong></td><td>100ml / 150ml / 200ml</td></tr>
            </table>
        </div>
        <div class="review">
            <h2>Customer Reviews</h2>
            <div id="reviews-container">
                <div class="review-item">
                    <p><strong>Lyndel C.</strong> ★★★★★</p>
                    <p>"This product works great! Highly recommended."</p>
                    <small>Feb 13, 2026</small>
                </div>
            </div>
            <div class="review-form">
                <h3>Write a Review</h3>
                <div class="form-group">
                    <label>Rating:</label>
                    <div class="star-rating" id="star-rating">
                        <span class="star" data-value="1">☆</span>
                        <span class="star" data-value="2">☆</span>
                        <span class="star" data-value="3">☆</span>
                        <span class="star" data-value="4">☆</span>
                        <span class="star" data-value="5">☆</span>
                    </div>
                    <input type="hidden" id="rating-value" value="0">
                </div>
                <div class="form-group">
                    <label for="review-text">Your Review:</label>
                    <textarea id="review-text" rows="4" placeholder="Write your review here..."></textarea>
                </div>
                <button id="submit-review">Submit Review</button>
            </div>
        </div>
    `;

    const addForm = document.getElementById('add-to-cart-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            addToCart(product.id, product.name, product.price, quantity);
            showMessage(product.name + ' added to cart!', 'success');
            document.getElementById('quantity').value = 1;
        });
    }

    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating-value');

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const value = parseInt(this.getAttribute('data-value'));
            stars.forEach((s, idx) => {
                s.innerHTML = idx < value ? '★' : '☆';
                s.style.color = idx < value ? '#ffcc00' : '#ddd';
            });
        });

        star.addEventListener('mouseout', function() {
            const currentRating = parseInt(ratingInput.value) || 0;
            stars.forEach((s, idx) => {
                s.innerHTML = idx < currentRating ? '★' : '☆';
                s.style.color = idx < currentRating ? '#ffcc00' : '#ddd';
            });
        });

        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            ratingInput.value = value;
            stars.forEach((s, idx) => {
                s.innerHTML = idx < value ? '★' : '☆';
                s.style.color = idx < value ? '#ffcc00' : '#ddd';
            });
        });
    });

    const submitBtn = document.getElementById('submit-review');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const rating = document.getElementById('rating-value').value;
            const reviewText = document.getElementById('review-text').value;

            if (!rating || rating == 0) {
                showMessage('Please select a rating', 'error');
                return;
            }
            if (!reviewText.trim()) {
                showMessage('Please write a review', 'error');
                return;
            }

            const starDisplay = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
            const reviewsContainer = document.getElementById('reviews-container');
            const newReview = document.createElement('div');
            newReview.className = 'review-item';
            newReview.innerHTML = `
                <p><strong>Guest User</strong> ${starDisplay}</p>
                <p>"${reviewText.trim()}"</p>
                <small>${new Date().toLocaleDateString()}</small>
            `;
            reviewsContainer.appendChild(newReview);
            document.getElementById('review-text').value = '';
            ratingInput.value = 0;
            stars.forEach(s => { s.innerHTML = '☆'; s.style.color = '#ddd'; });
            showMessage('Thank you for your review!', 'success');
        });
    }
}

// ========================================
// LANDING PAGE
// ========================================

function renderLandingPage() {
    const featuredContainer = document.getElementById('featured-products-container');
    const discountedContainer = document.getElementById('discounted-products-container');

    if (!featuredContainer && !discountedContainer) return;

    if (products.length === 0) {
        if (featuredContainer) featuredContainer.innerHTML = '<div class="loading">Loading products...</div>';
        if (discountedContainer) discountedContainer.innerHTML = '';
        return;
    }

    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        const featuredProducts = products.slice(0, 3);
        featuredProducts.forEach(product => {
            featuredContainer.innerHTML += `
                <div class="product-card">
                    <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
                    <h3>${product.name}</h3>
                    <p>${(product.description || '').substring(0, 60)}...</p>
                    <span class="price">₱${product.price.toFixed(2)}</span>
                    <button class="view-details" data-id="${product.id}">View Details</button>
                </div>
            `;
        });
    }

    if (discountedContainer && products.length > 3) {
        discountedContainer.innerHTML = '';
        const discountedProducts = products.slice(3, 6);
        discountedProducts.forEach(product => {
            discountedContainer.innerHTML += `
                <div class="product-card">
                    <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
                    <h3>${product.name}</h3>
                    <p>${(product.description || '').substring(0, 60)}...</p>
                    <span class="price">₱${product.price.toFixed(2)}</span>
                    <span class="discount">SALE</span>
                    <button class="view-details" data-id="${product.id}">View Details</button>
                </div>
            `;
        });
    }
}

// ========================================
// CART PAGE
// ========================================

function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart-message">Your cart is currently empty</div>';
        updateCartSummary();
        return;
    }

    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        cartContainer.innerHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="/images/${product ? product.image : 'default-product.jpg'}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">₱${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <label>Qty:</label>
                    <input type="number" min="1" value="${item.quantity}" class="quantity-input">
                </div>
                <div class="item-total">₱${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" data-id="${item.id}">×</button>
            </div>
        `;
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-id'));
            updateCartQuantity(productId, parseInt(this.value));
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            removeFromCart(parseInt(this.getAttribute('data-id')));
        });
    });

    updateCartSummary();
}

function updateCartSummary() {
    const totals = calculateTotals();
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `₱${totals.subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totals.total.toFixed(2)}`;

    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    if (shippingEl) shippingEl.textContent = `₱${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₱${totals.tax.toFixed(2)}`;

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length > 0) window.location.href = '/checkout&shipping.html';
            else showMessage('Your cart is empty!', 'error');
        };
    }
}

// ========================================
// CHECKOUT PAGE (WITH ORDER HISTORY STORAGE)
// ========================================

function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    updateCheckoutSummary();

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            showMessage('Your cart is empty!', 'error');
            return;
        }

        const nameInput = document.getElementById('name');
        const customerName = nameInput ? nameInput.value.trim() : 'Guest User';

        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: calculateTotals().total,
            items: cart.map(item => `${item.name} x${item.quantity}`),
            status: "Delivered",
            customer: customerName
        };

        let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orderHistory.unshift(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        showMessage('Order placed successfully! Thank you for shopping!', 'success');

        cart = [];
        saveCart();
        updateCartCount();

        setTimeout(() => {
            window.location.href = '/account.html';
        }, 2000);
    });
}

function updateCheckoutSummary() {
    const totals = calculateTotals();
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');

    if (subtotalEl) subtotalEl.textContent = `₱${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `₱${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₱${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totals.total.toFixed(2)}`;

    const orderItemsContainer = document.getElementById('order-items');
    if (orderItemsContainer) {
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        } else {
            orderItemsContainer.innerHTML = '';
            cart.forEach(item => {
                orderItemsContainer.innerHTML += `
                    <div class="order-item-cart">
                        <span>${item.name} x${item.quantity}</span>
                        <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });
        }
    }
}

// ========================================
// ACCOUNT PAGE (WITH LOCALSTORAGE ORDER HISTORY)
// ========================================

const defaultOrderHistory = [
    { id: 1001, date: "Feb 13, 2026", total: 520.00, items: ["Lotion", "Shampoo"], status: "Delivered", customer: "Lyndel Carpio" },
    { id: 1000, date: "Jan 25, 2026", total: 320.00, items: ["OFF! Baby"], status: "Delivered", customer: "Lyndel Carpio" },
    { id: 999, date: "Dec 12, 2025", total: 150.00, items: ["OFF! FamilyCare"], status: "Delivered", customer: "Lyndel Carpio" }
];

function initAccountPage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) welcomeMessage.textContent = `Welcome, Lyndel Carpio!`;

    let orderHistory = JSON.parse(localStorage.getItem('orderHistory'));

    if (!orderHistory || orderHistory.length === 0) {
        orderHistory = defaultOrderHistory;
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    }

    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer) {
        ordersContainer.innerHTML = '';

        if (orderHistory.length === 0) {
            ordersContainer.innerHTML = '<div class="empty-message">No orders found.</div>';
        } else {
            orderHistory.forEach(order => {
                const details = document.createElement('details');
                details.id = `order-${order.id}`;
                details.innerHTML = `
                    <summary>Order #${order.id} — ₱${order.total.toFixed(2)} — ${order.date}</summary>
                    <div class="dynamic-details">
                        <p><strong>Order #${order.id}</strong></p>
                        <p>Date: ${order.date}</p>
                        <p>Total: ₱${order.total.toFixed(2)}</p>
                        <p>Items: ${order.items.join(', ')}</p>
                        <p>Status: ${order.status}</p>
                        <p>Customer: ${order.customer || 'Guest'}</p>
                    </div>
                `;
                ordersContainer.appendChild(details);
            });
        }
    }

    const orderHistoryList = document.getElementById('order-history-list');
    if (orderHistoryList) {
        orderHistoryList.innerHTML = '';
        orderHistory.forEach(order => {
            const li = document.createElement('li');
            li.textContent = `Order #${order.id} — ₱${order.total.toFixed(2)} — ${order.date}`;
            orderHistoryList.appendChild(li);
        });
    }
}

// ========================================
// SIGNUP PAGE
// ========================================

function initSignupPage() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');

        if (!fullname.value.trim()) {
            showMessage('Please enter your full name', 'error');
            return;
        }

        if (!email.value.trim()) {
            showMessage('Please enter your email', 'error');
            return;
        }

        if (!password.value.trim()) {
            showMessage('Please enter a password', 'error');
            return;
        }

        if (password.value.length < 8) {
            showMessage('Password must be at least 8 characters', 'error');
            return;
        }

        if (password.value !== confirmPassword.value) {
            showMessage('Passwords do not match!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email.value);

        if (existingUser) {
            showMessage('Email already exists!', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            name: fullname.value,
            email: email.value,
            password: password.value
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        showMessage('Account created successfully!', 'success');

        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    });
}

// ========================================
// GLOBAL EVENT LISTENERS
// ========================================

function attachGlobalEventListeners() {
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            addToCart(id, name, price);
        }

        if (e.target.classList.contains('view-details')) {
            const id = e.target.getAttribute('data-id');
            sessionStorage.setItem('selectedProductId', id);
            window.location.href = '/detail.html';
        }
    });
}

// ========================================
// REFRESH CURRENT PAGE
// ========================================

function refreshCurrentPage() {
    const path = window.location.pathname;

    if (path.includes('products.html')) {
        renderProducts();
        attachFilterEventListeners();
    } else if (path === '/' || path.includes('landing.html') || path.includes('index.html')) {
        renderLandingPage();
    } else if (path.includes('detail.html')) {
        renderProductDetail();
    } else if (path.includes('cart.html')) {
        renderCart();
    } else if (path.includes('checkout')) {
        initCheckoutForm();
    } else if (path.includes('account.html')) {
        initAccountPage();
    } else if (path.includes('signup.html')) {
        initSignupPage();
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    loadCart();
    updateCartCount();
    attachGlobalEventListeners();
    await fetchProductsFromBackend();
});