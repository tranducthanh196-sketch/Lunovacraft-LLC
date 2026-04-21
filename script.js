// Product data
const products = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        price: 89.99,
        originalPrice: 129.99,
        discount: 30,
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        description: "Experience the perfect blend of comfort and style with our elegant summer dress.",
        category: "Summer Collection"
    },
    {
        id: 2,
        name: "Floral Summer Maxi",
        price: 119.99,
        originalPrice: 169.99,
        discount: 29,
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        description: "Beautiful floral maxi dress perfect for summer occasions.",
        category: "Summer Collection"
    },
    {
        id: 3,
        name: "Casual Beach Dress",
        price: 69.99,
        originalPrice: 99.99,
        discount: 30,
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        description: "Light and comfortable beach dress for your summer adventures.",
        category: "Beach Wear"
    },
    {
        id: 4,
        name: "Bohemian Summer Dress",
        price: 94.99,
        originalPrice: 139.99,
        discount: 32,
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        description: "Bohemian style dress with unique patterns and comfortable fit.",
        category: "Bohemian"
    },
    {
        id: 5,
        name: "Elegant Evening Dress",
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        description: "Sophisticated evening dress for special summer occasions.",
        category: "Evening Wear"
    },
    {
        id: 6,
        name: "Summer Midi Dress",
        price: 79.99,
        originalPrice: 109.99,
        discount: 27,
        images: ["main-image-1.jpeg", "main-image-2.jpeg", "main-image-3.jpeg", "main-image-4.jpeg"],
        description: "Versatile midi dress perfect for any summer event.",
        category: "Summer Collection"
    }
];

// Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('lunovaCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('lunovaCart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product, quantity = 1, color = 'white', size = 'M') {
        const existingItem = this.items.find(item => 
            item.id === product.id && item.color === color && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity,
                color,
                size,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.showNotification('Product added to cart!');
    }

    removeItem(productId, color, size) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.color === color && item.size === size)
        );
        this.saveCart();
        this.showNotification('Product removed from cart!');
    }

    updateQuantity(productId, color, size, quantity) {
        const item = this.items.find(item => 
            item.id === productId && item.color === color && item.size === size
        );
        
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Load products on home page
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    // Load products on products page
    if (document.getElementById('products-grid')) {
        loadAllProducts();
    }

    // Load related products
    if (document.getElementById('related-products')) {
        loadRelatedProducts();
    }

    // Load cart items
    if (document.getElementById('cart-items')) {
        loadCartItems();
    }

    // Product detail page functionality
    if (document.getElementById('main-product-image')) {
        loadProductDetail();
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Newsletter forms
    document.querySelectorAll('.subscribe-form').forEach(form => {
        form.addEventListener('submit', handleNewsletter);
    });

    // Quantity selectors
    setupQuantitySelectors();

    // Color and size selectors
    setupVariantSelectors();
});

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = products.slice(0, 3);
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Load all products
function loadAllProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Load related products
function loadRelatedProducts() {
    const container = document.getElementById('related-products');
    if (!container) return;

    const relatedProducts = products.slice(0, 4);
    
    relatedProducts.forEach(product => {
        const productCard = createProductCard(product, 'col-md-6');
        container.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product, colClass = 'col-lg-4') {
    const col = document.createElement('div');
    col.className = colClass;
    
    col.innerHTML = `
        <div class="card product-card h-100 border-0 shadow-sm">
            <div class="product-image-container position-relative overflow-hidden">
                <img src="PRODUCT/${product.id}/${product.images[0]}" alt="${product.name}" class="card-img-top product-image">
                ${product.discount ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-${product.discount}%</span>` : ''}
                <div class="product-overlay">
                    <button class="btn btn-primary btn-sm quick-view-btn" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye me-1"></i>Quick View
                    </button>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text text-muted small">${product.description}</p>
                <div class="price-section mb-3">
                    <span class="h5 text-primary fw-bold">$${product.price}</span>
                    ${product.originalPrice ? `<span class="text-muted text-decoration-line-through ms-2">$${product.originalPrice}</span>` : ''}
                </div>
                <button class="btn btn-primary w-100 add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product, 1, 'white', 'M');
    }
}

// View product details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Load cart items
function loadCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5" id="empty-cart">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                <h4 class="text-muted">Your cart is empty</h4>
                <p class="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                <a href="products.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left me-2"></i>Continue Shopping
                </a>
            </div>
        `;
        updateOrderSummary();
        return;
    }

    container.innerHTML = cart.items.map(item => `
        <div class="cart-item mb-3 p-3 border-bottom">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="PRODUCT/${item.id}/${item.images[0]}" alt="${item.name}" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">Color: ${item.color} | Size: ${item.size}</small>
                </div>
                <div class="col-md-2">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" onclick="updateCartItemQuantity(${item.id}, '${item.color}', '${item.size}', ${item.quantity - 1})">-</button>
                        <input type="number" class="form-control text-center" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="btn btn-outline-secondary" onclick="updateCartItemQuantity(${item.id}, '${item.color}', '${item.size}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <span class="h6">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="col-md-2 text-end">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id}, '${item.color}', '${item.size}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateOrderSummary();
}

// Update cart item quantity
function updateCartItemQuantity(productId, color, size, quantity) {
    if (quantity < 1) return;
    if (quantity > 10) return;
    
    cart.updateQuantity(productId, color, size, quantity);
    loadCartItems();
}

// Remove from cart
function removeFromCart(productId, color, size) {
    cart.removeItem(productId, color, size);
    loadCartItems();
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cart.getTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.items.length === 0;
    }
}

// Load product detail
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update product info
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price}`;
    document.getElementById('product-original-price').textContent = `$${product.originalPrice}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('breadcrumb-product').textContent = product.name;

    // Load main image
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = `PRODUCT/${product.id}/${product.images[0]}`;

    // Load thumbnails
    const thumbnailContainer = document.getElementById('thumbnail-container');
    thumbnailContainer.innerHTML = product.images.map((image, index) => `
        <img src="PRODUCT/${product.id}/${image}" alt="Thumbnail ${index + 1}" 
             class="thumbnail img-thumbnail cursor-pointer ${index === 0 ? 'border-primary' : ''}"
             onclick="changeMainImage('PRODUCT/${product.id}/${image}', this)">
    `).join('');

    // Setup add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            const selectedColor = document.querySelector('.color-option.active')?.dataset.color || 'white';
            const selectedSize = document.querySelector('.size-option.active')?.dataset.size || 'M';
            
            cart.addItem(product, quantity, selectedColor, selectedSize);
        };
    }
}

// Change main image
function changeMainImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = imageSrc;
    
    // Update thumbnail borders
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('border-primary');
    });
    thumbnail.classList.add('border-primary');
}

// Setup quantity selectors
function setupQuantitySelectors() {
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
}

// Setup variant selectors
function setupVariantSelectors() {
    // Color options
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Size options
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Here you would normally send the data to a server
    console.log('Contact form submitted:', data);
    
    // Show success message
    cart.showNotification('Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
}

// Handle newsletter subscription
function handleNewsletter(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Here you would normally send the email to a server
    console.log('Newsletter subscription:', email);
    
    // Show success message
    cart.showNotification('Successfully subscribed to newsletter!');
    e.target.reset();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .product-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .product-image {
        height: 300px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .product-image-container:hover .product-image {
        transform: scale(1.05);
    }
    
    .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .product-image-container:hover .product-overlay {
        opacity: 1;
    }
    
    .thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }
    
    .thumbnail:hover {
        border-color: #007bff !important;
    }
    
    .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
    
    .hero-image img {
        max-width: 100%;
        height: auto;
    }
    
    .page-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    .color-option.active,
    .size-option.active {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
    }
    
    .notification {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
`;

document.head.appendChild(style);
