// ========================================
// TASK 1: PRODUCT DATA (From Database via Fetch API)
// ========================================

let products = [];  // Empty array, will be filled from backend
let cart = [];

// Product class
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

        // Convert backend products to match Product class format
        products = backendProducts.map(product => new Product(
            product.id,
            product.name,
            product.price,
            product.imageUrl && product.imageUrl !== '' ? product.imageUrl.replace('/images/', '') : 'default-product.jpg',
            product.description || 'No description available',
            product.category
        ));

        console.log('Products loaded from database:', products.length);

        // After loading products, refresh the current page
        refreshCurrentPage();

    } catch (error) {
        console.error('Error fetching products:', error);
        showMessage('Failed to load products from server. Make sure backend is running.', 'error');
    }
}

// ========================================
// TASK 3: SHOPPING CART
// ========================================

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification message
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
        msg.style.backgroundColor = '#d9534f';
        msg.style.color = 'white';
    } else {
        msg.style.backgroundColor = '#ff6600';
        msg.style.color = 'white';
    }

    container.appendChild(msg);

    setTimeout(() => msg.remove(), 3000);
    msg.onclick = () => msg.remove();
}

// Add to cart
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

// Remove from cart
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        cart = cart.filter(item => item.id !== productId);
        showMessage(item.name + ' removed from cart', 'info');
        saveCart();
        updateCartCount();

        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
        if (window.location.pathname.includes('checkout')) {
            updateCheckoutSummary();
        }
    }
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();

            if (window.location.pathname.includes('cart.html')) {
                renderCart();
            }
            if (window.location.pathname.includes('checkout')) {
                updateCheckoutSummary();
            }
        }
    }
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}

// Update cart count badge
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
// TASK 2: PRODUCTS PAGE (products.html)
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

        const productImg = document.createElement('img');
        productImg.src = '/images/' + product.image;
        productImg.alt = product.name;
        productImg.onerror = () => { productImg.src = '/images/default-product.jpg'; };

        const productTitle = document.createElement('h2');
        productTitle.textContent = product.name;

        const productDesc = document.createElement('p');
        productDesc.className = 'product-description';
        productDesc.textContent = product.description.length > 80
            ? product.description.substring(0, 80) + '...'
            : product.description;

        const productPrice = document.createElement('p');
        productPrice.className = 'product-price';
        productPrice.textContent = '₱' + product.price.toFixed(2);

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Details';
        viewBtn.className = 'view-details';
        viewBtn.setAttribute('data-id', product.id);

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add to Cart';
        addBtn.className = 'add-to-cart-btn';
        addBtn.setAttribute('data-id', product.id);
        addBtn.setAttribute('data-name', product.name);
        addBtn.setAttribute('data-price', product.price);

        productCard.appendChild(productImg);
        productCard.appendChild(productTitle);
        productCard.appendChild(productDesc);
        productCard.appendChild(productPrice);
        productCard.appendChild(viewBtn);
        productCard.appendChild(addBtn);

        productContainer.appendChild(productCard);
    });

    attachProductEventListeners();
    attachFilterEventListeners();
}

// Event listeners for product buttons
function attachProductEventListeners() {
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const productName = event.target.getAttribute('data-name');
            const productPrice = parseFloat(event.target.getAttribute('data-price'));

            addToCart(productId, productName, productPrice);

            const productCard = event.target.closest('.product-card');
            if (productCard) {
                productCard.classList.add('fade-in');
                setTimeout(() => {
                    productCard.classList.remove('fade-in');
                }, 500);
            }
        }

        if (event.target.classList.contains('view-details')) {
            const productId = event.target.getAttribute('data-id');
            sessionStorage.setItem('selectedProductId', productId);
            window.location.href = 'detail.html';
        }
    });
}

// Filter functionality
function attachFilterEventListeners() {
    const filterForm = document.querySelector('.sidebar form');
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

        renderFilteredProducts(filteredProducts);
    });
}

function renderFilteredProducts(filteredProducts) {
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

        const productImg = document.createElement('img');
        productImg.src = '/images/' + product.image;
        productImg.alt = product.name;
        productImg.onerror = () => { productImg.src = '/images/default-product.jpg'; };

        const productTitle = document.createElement('h2');
        productTitle.textContent = product.name;

        const productDesc = document.createElement('p');
        productDesc.className = 'product-description';
        productDesc.textContent = product.description.length > 80
            ? product.description.substring(0, 80) + '...'
            : product.description;

        const productPrice = document.createElement('p');
        productPrice.className = 'product-price';
        productPrice.textContent = '₱' + product.price.toFixed(2);

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Details';
        viewBtn.className = 'view-details';
        viewBtn.setAttribute('data-id', product.id);

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add to Cart';
        addBtn.className = 'add-to-cart-btn';
        addBtn.setAttribute('data-id', product.id);
        addBtn.setAttribute('data-name', product.name);
        addBtn.setAttribute('data-price', product.price);

        productCard.appendChild(productImg);
        productCard.appendChild(productTitle);
        productCard.appendChild(productDesc);
        productCard.appendChild(productPrice);
        productCard.appendChild(viewBtn);
        productCard.appendChild(addBtn);

        productContainer.appendChild(productCard);
    });
}

// ========================================
// TASK 3: CART PAGE (cart.html)
// ========================================

function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart-message">Your cart is currently empty</div>';
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);

        cartItem.innerHTML = `
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
        `;

        cartContainer.appendChild(cartItem);
    });

    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            updateCartQuantity(productId, newQuantity);
        });
    });

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });

    updateCartSummary();
}

function updateCartSummary() {
    const totals = calculateTotals();

    const subtotalEl = document.querySelector('.summary-row:first-child span:last-child');
    const totalEl = document.querySelector('.summary-total span:last-child');

    if (subtotalEl) subtotalEl.textContent = `₱${totals.subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totals.total.toFixed(2)}`;

    const summaryRows = document.querySelectorAll('.summary-row');
    if (summaryRows.length >= 2) {
        const shippingRow = summaryRows[0];
        const taxRow = summaryRows[1];
        if (shippingRow) shippingRow.querySelector('span:last-child').textContent = `₱${totals.shipping.toFixed(2)}`;
        if (taxRow) taxRow.querySelector('span:last-child').textContent = `₱${totals.tax.toFixed(2)}`;
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            if (cart.length > 0) {
                window.location.href = 'checkout&shipping.html';
            } else {
                showMessage('Your cart is empty!', 'error');
            }
        };
    }
}

// ========================================
// TASK 4: CHECKOUT PAGE
// ========================================

function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    updateCheckoutSummary();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name');
        const address = document.getElementById('address');
        const city = document.getElementById('municipality');
        const province = document.getElementById('province');
        const zip = document.getElementById('zip');
        const country = document.getElementById('country');
        const payment = document.querySelector('input[name="payment"]:checked');

        let isValid = true;

        const oldErrors = document.querySelectorAll('.error-message');
        oldErrors.forEach(err => err.remove());
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));

        function showError(input, message) {
            if (!input) return;
            input.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = message;
            input.parentNode.appendChild(errorSpan);
            isValid = false;
        }

        if (!name.value.trim()) showError(name, 'Full name is required');
        if (!address.value.trim()) showError(address, 'Street address is required');
        if (!city.value.trim()) showError(city, 'City is required');
        if (!province.value.trim()) showError(province, 'Province is required');
        if (!zip.value.trim()) showError(zip, 'Postal code is required');
        if (!country.value) showError(country, 'Please select a country');
        if (!payment) showError(document.querySelector('.payment-options'), 'Please select a payment method');
        if (cart.length === 0) {
            showMessage('Your cart is empty!', 'error');
            isValid = false;
        }

        if (isValid) {
            console.log('=== ORDER PLACED SUCCESSFULLY ===');
            console.log('Customer:', name.value);
            console.log('Total:', calculateTotals().total);

            showMessage('Order placed successfully! Thank you for shopping!', 'success');

            cart = [];
            saveCart();
            updateCartCount();

            setTimeout(() => {
                window.location.href = 'landing.html';
            }, 2000);
        }
    });
}

function updateCheckoutSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item-cart';
            itemDiv.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>₱${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(itemDiv);
        });
    }

    const totals = calculateTotals();
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');

    if (subtotalEl) subtotalEl.textContent = `₱${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `₱${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₱${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${totals.total.toFixed(2)}`;
}

// ========================================
// TASK 5: USER ACCOUNT
// ========================================

const currentUser = {
    name: "Lyndel Carpio",
    orderHistory: [
        { id: 1001, date: "Feb. 13, 2026", total: 520.00, items: ["Lotion", "Shampoo"], status: "Delivered" },
        { id: 1000, date: "Jan. 25, 2026", total: 320.00, items: ["OFF! Baby"], status: "Delivered" },
        { id: 999, date: "Dec. 12, 2025", total: 150.00, items: ["OFF! FamilyCare"], status: "Delivered" }
    ]
};

function initAccountPage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${currentUser.name}!`;
    }

    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        if (summary && !details.hasAttribute('data-listener')) {
            details.setAttribute('data-listener', 'true');
            summary.addEventListener('click', function() {
                if (!details.hasAttribute('data-expanded')) {
                    details.setAttribute('data-expanded', 'true');

                    const orderId = details.id.replace('order-', '');
                    const order = currentUser.orderHistory.find(o => o.id == orderId);

                    if (order && !details.querySelector('.dynamic-details')) {
                        const dynamicContent = document.createElement('div');
                        dynamicContent.className = 'dynamic-details';
                        dynamicContent.style.marginTop = '15px';
                        dynamicContent.style.padding = '15px';
                        dynamicContent.style.backgroundColor = '#f9f9f9';
                        dynamicContent.style.borderRadius = '8px';
                        dynamicContent.innerHTML = `
                            <p><strong>Order #${order.id}</strong></p>
                            <p>Date: ${order.date}</p>
                            <p>Total: ₱${order.total.toFixed(2)}</p>
                            <p>Items: ${order.items.join(', ')}</p>
                            <p>Status: ${order.status}</p>
                        `;
                        details.appendChild(dynamicContent);
                    }
                }
            });
        }
    });

    const orderHistoryList = document.getElementById('order-history-list');
    if (orderHistoryList && currentUser.orderHistory) {
        orderHistoryList.innerHTML = '';
        currentUser.orderHistory.forEach(order => {
            const li = document.createElement('li');
            li.textContent = `Order #${order.id} — ₱${order.total.toFixed(2)} — ${order.date}`;
            orderHistoryList.appendChild(li);
        });
    }
}

// ========================================
// TASK 6: PRODUCT DETAIL PAGE
// ========================================

function renderProductDetail() {
    const productId = sessionStorage.getItem('selectedProductId');
    const product = products.find(p => p.id == productId);

    if (!product) {
        const container = document.getElementById('product-detail-container');
        if (container) {
            container.innerHTML = '<div class="error">Product not found. <a href="products.html">Back to Products</a></div>';
        }
        return;
    }

    const titleEl = document.getElementById('product-title');
    const imgEl = document.getElementById('product-img');
    const priceEl = document.getElementById('product-price');
    const descEl = document.getElementById('product-description');

    if (titleEl) titleEl.textContent = product.name;
    if (imgEl) {
        imgEl.src = '/images/' + product.image;
        imgEl.alt = product.name;
        imgEl.onerror = () => { imgEl.src = '/images/default-product.jpg'; };
    }
    if (priceEl) priceEl.textContent = '₱' + product.price.toFixed(2);
    if (descEl) descEl.textContent = product.description;

    const addForm = document.getElementById('add-to-cart-form');
    if (addForm) {
        addForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const qtyInput = document.getElementById('quantity');
            const quantity = parseInt(qtyInput.value) || 1;

            addToCart(product.id, product.name, product.price, quantity);

            const container = document.getElementById('product-detail-container');
            if (container) {
                container.classList.add('fade-in');
                setTimeout(() => {
                    container.classList.remove('fade-in');
                }, 500);
            }

            qtyInput.value = 1;
        });
    }

    const ratingGroup = document.getElementById('rating-group');
    if (ratingGroup) {
        ratingGroup.innerHTML = `
            <label style="display:block;margin-bottom:10px;font-weight:bold;">Rating:</label>
            <div id="star-container" style="display:flex;gap:8px;margin-bottom:10px;"></div>
            <input type="hidden" id="rating" value="0">
            <p id="rating-text" style="margin-top:5px;font-size:12px;color:#666;">Click on stars to rate</p>
        `;

        const starContainer = document.getElementById('star-container');
        let currentRating = 0;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.innerHTML = '☆';
            star.style.cssText = 'font-size:30px;color:#ffcc00;cursor:pointer;';
            star.setAttribute('data-value', i);

            star.onmouseenter = () => updateStars(i);
            star.onmouseleave = () => updateStars(currentRating);
            star.onclick = () => {
                currentRating = i;
                updateStars(currentRating);
                document.getElementById('rating').value = currentRating;
                const ratingText = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][currentRating];
                document.getElementById('rating-text').textContent = ratingText;
            };

            starContainer.appendChild(star);
            stars.push(star);
        }

        function updateStars(rating) {
            stars.forEach((star, idx) => {
                star.innerHTML = idx < rating ? '★' : '☆';
            });
        }
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const reviewText = document.getElementById('review-text');
            const rating = document.getElementById('rating').value;

            if (!reviewText.value.trim()) return alert('Please write a review');
            if (rating == 0) return alert('Please select a rating');

            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

            const newReview = document.createElement('div');
            newReview.className = 'review-item';
            newReview.style.cssText = 'border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:15px;background:#f9f9f9;';
            newReview.innerHTML = `
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <strong>${currentUser.name}</strong>
                    <span style="color:#ffcc00;">${stars}</span>
                </div>
                <div style="color:#ff6600;margin-bottom:8px;">${labels[rating]} (${rating}/5)</div>
                <p style="margin:10px 0;">"${reviewText.value.trim()}"</p>
                <small>${new Date().toLocaleDateString()}</small>
            `;

            document.getElementById('reviews-container').appendChild(newReview);
            reviewText.value = '';
            document.getElementById('rating').value = '0';
            updateStars(0);
            document.getElementById('rating-text').textContent = 'Click on stars to rate';
            alert('Thank you for your review!');
        });
    }
}

// ========================================
// TASK 6: LANDING PAGE
// ========================================

function renderLandingPage() {
    const featuredContainer = document.querySelector('.featured-products .product-list');
    const discountedContainer = document.querySelector('.discounted-products .product-list');

    if (products.length === 0) {
        if (featuredContainer) featuredContainer.innerHTML = '<div class="loading">Loading products from database...</div>';
        if (discountedContainer) discountedContainer.innerHTML = '';
        return;
    }

    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        const featuredProducts = products.slice(0, 3);
        featuredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
                <h3>${product.name}</h3>
                <p>${(product.description || '').substring(0, 60)}...</p>
                <span class="price">₱${product.price.toFixed(2)}</span>
                <button class="view-details" data-id="${product.id}">View Details</button>
            `;

            const viewBtn = card.querySelector('.view-details');
            viewBtn.addEventListener('click', function() {
                sessionStorage.setItem('selectedProductId', product.id);
                window.location.href = 'detail.html';
            });

            featuredContainer.appendChild(card);
        });
    }

    if (discountedContainer && products.length > 3) {
        discountedContainer.innerHTML = '';
        const discountedProducts = products.slice(3, 6);
        discountedProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="/images/${product.image}" alt="${product.name}" onerror="this.src='/images/default-product.jpg'">
                <h3>${product.name}</h3>
                <p>${(product.description || '').substring(0, 60)}...</p>
                <span class="price">₱${product.price.toFixed(2)}</span>
                <span class="discount">SALE</span>
                <button class="view-details" data-id="${product.id}">View Details</button>
            `;

            const viewBtn = card.querySelector('.view-details');
            viewBtn.addEventListener('click', function() {
                sessionStorage.setItem('selectedProductId', product.id);
                window.location.href = 'detail.html';
            });

            discountedContainer.appendChild(card);
        });
    }

    const shopNowBtn = document.querySelector('.hero button');
    if (shopNowBtn) {
        shopNowBtn.onclick = () => window.location.href = 'products.html';
    }
}

// Refresh current page after products are loaded
function refreshCurrentPage() {
    const path = window.location.pathname;

    if (path.includes('products.html')) {
        renderProducts();
    } else if (path.includes('landing.html') || path === '/' || path === '/index.html') {
        renderLandingPage();
    } else if (path.includes('detail.html')) {
        renderProductDetail();
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    loadCart();
    updateCartCount();

    // Fetch products from backend first
    await fetchProductsFromBackend();

    const path = window.location.pathname;

    if (path.includes('products.html')) {
        renderProducts();
    } else if (path.includes('cart.html')) {
        renderCart();
    } else if (path.includes('detail.html')) {
        renderProductDetail();
    } else if (path.includes('checkout')) {
        initCheckoutForm();
    } else if (path.includes('account.html')) {
        initAccountPage();
    } else if (path.includes('landing.html') || path === '/' || path === '/index.html') {
        renderLandingPage();
    }

    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            loadCart();
            updateCartCount();
            if (path.includes('cart.html')) renderCart();
            if (path.includes('checkout')) updateCheckoutSummary();
        }
    });
});