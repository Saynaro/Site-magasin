import {products} from '../data/products.js';
import {cart, addToCart, updateQuantityInCart, removeFromCart} from '../data/cart.js';
import {initSearch} from './search.js';

let toastTimeout;
let currentToastProductId = null;

// ========================
// Slider Logic
// ========================
function initSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const dotsNav = document.querySelector('.slider-dots');

    if (slides.length === 0) return;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(i === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });
    
    const dots = Array.from(dotsNav.children);
    let currentIndex = 0;

    function moveToSlide(index) {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    nextBtn.addEventListener('click', () => {
        let nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        let prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        moveToSlide(prevIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => moveToSlide(index));
    });

    // Auto slide
    setInterval(() => {
        let nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    }, 5000);
}

// ========================
// Product Rendering
// ========================
function renderProducts() {
    let productHTML = '';
    
    // Parse search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search')?.toLowerCase() || '';

    // Filter products
    const filteredProducts = products.filter(p => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        
        // Exact category or subcategory
        if (p.category.toLowerCase() === query) return true;
        if (p.subcategory && p.subcategory.toLowerCase() === query) return true;

        // Fallback for search bar text
        return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    });

    if (filteredProducts.length === 0) {
        document.querySelector('.items').innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 18px;">Aucun produit trouvé pour "${searchQuery}"</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const cartItem = cart.find(c => c.productId === product.id);
        
        let actionHTML;
        if (cartItem && cartItem.quantity > 0) {
            actionHTML = `
            <div class="grid-qty-changer">
                <button class="grid-qty-btn minus" data-product-id="${product.id}">-</button>
                <span class="grid-qty-val">${cartItem.quantity}</span>
                <button class="grid-qty-btn plus" data-product-id="${product.id}">+</button>
            </div>
            `;
        } else {
            actionHTML = `<button class="button-add-to-cart" data-product-id="${product.id}">Add to cart</button>`;
        }

        productHTML += `
        <div class="item" style="position: relative;">
            <a href="product.html?id=${product.id}" class="items-title">
                <img src="${product.image}" alt="error">
                <h3 style="margin-top: 10px;">${product.name}</h3>
            </a>
            <p style="color: #6ebe70; font-size: 14px; margin: 5px 0;">${product.category}</p>
            <p style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">€${(product.priceCents / 100).toFixed(2)}</p>
            ${actionHTML}
        </div>
        `;
    });

    document.querySelector('.items').innerHTML = productHTML;

    // Attach listeners
    document.querySelectorAll('.button-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
            updateQuantity();
            renderProducts();
            showToastForProduct(productId);
        });
    });

    document.querySelectorAll('.grid-qty-btn.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const item = cart.find(c => c.productId === productId);
            if(item) {
                updateQuantityInCart(productId, item.quantity + 1);
                updateQuantity();
                renderProducts();
            }
        });
    });

    document.querySelectorAll('.grid-qty-btn.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const item = cart.find(c => c.productId === productId);
            if(item && item.quantity > 0) {
                updateQuantityInCart(productId, item.quantity - 1);
                updateQuantity();
                renderProducts();
            }
        });
    });
}

function updateQuantity() {
    let cartQuantity = 0;
    cart.forEach(cartItem => {
        cartQuantity += cartItem.quantity;
    });
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartQuantity;
}

// ========================
// Toast UI Logic
// ========================
function showToastForProduct(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(c => c.productId === productId);
    if (!product || !cartItem) return;

    currentToastProductId = productId;

    const toast = document.getElementById('cart-toast-container');
    const msg = document.querySelector('.toast-message');
    const qtyVal = document.querySelector('.toast-qty-val');

    msg.textContent = `${product.name} a été ajouté !`;
    qtyVal.textContent = cartItem.quantity;

    toast.classList.remove('toast-hidden');

    resetToastTimer();
}

function resetToastTimer() {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        const toast = document.getElementById('cart-toast-container');
        if (toast) toast.classList.add('toast-hidden');
    }, 5000);
}

function setupToastListeners() {
    const btnPlus = document.querySelector('.toast-qty-btn.plus');
    const btnMinus = document.querySelector('.toast-qty-btn.minus');
    const btnClose = document.querySelector('.toast-close');

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            if (!currentToastProductId) return;
            const cartItem = cart.find(c => c.productId === currentToastProductId);
            if (cartItem) {
                updateQuantityInCart(currentToastProductId, cartItem.quantity + 1);
                const updatedItem = cart.find(c => c.productId === currentToastProductId);
                if (updatedItem) {
                    document.querySelector('.toast-qty-val').textContent = updatedItem.quantity;
                }
                updateQuantity();
                renderProducts();
                resetToastTimer();
            }
        });
    }

    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            if (!currentToastProductId) return;
            const cartItem = cart.find(c => c.productId === currentToastProductId);
            if (cartItem && cartItem.quantity > 0) {
                updateQuantityInCart(currentToastProductId, cartItem.quantity - 1);
                
                const updatedItem = cart.find(c => c.productId === currentToastProductId);
                if (updatedItem && updatedItem.quantity > 0) {
                    document.querySelector('.toast-qty-val').textContent = updatedItem.quantity;
                } else {
                    document.getElementById('cart-toast-container').classList.add('toast-hidden');
                }
                
                updateQuantity();
                renderProducts();
                resetToastTimer();
            }
        });
    }
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            document.getElementById('cart-toast-container').classList.add('toast-hidden');
            if (toastTimeout) clearTimeout(toastTimeout);
        });
    }
}

function initMobileMenu() {
    const catalogContainer = document.querySelector('.catalog-container');
    const catalogBtn = catalogContainer?.querySelector('.catalog');
    const dropdownMenu = catalogContainer?.querySelector('.dropdown-menu');
    
    // Only apply click logic on mobile/tablet
    if (window.innerWidth <= 768) {
        // Toggle main menu on click
        if (catalogBtn && dropdownMenu) {
            // Override inline onclick attribute specifically for mobile
            catalogBtn.onclick = (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('active');
                    
                    if (!dropdownMenu.classList.contains('active')) {
                        document.querySelectorAll('.sub-dropdown-menu').forEach(s => s.classList.remove('active'));
                        document.querySelectorAll('.dropdown-category').forEach(c => c.classList.remove('mobile-active'));
                    }
                }
            };
        }

        // Toggle submenus on click
        const categories = document.querySelectorAll('.dropdown-category');
        categories.forEach(cat => {
            cat.addEventListener('click', (e) => {
                const subMenu = cat.querySelector('.sub-dropdown-menu');
                if (subMenu) {
                    // Prevent link navigation if it has a submenu
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other submenus first
                    categories.forEach(c => {
                        if (c !== cat) {
                            c.querySelector('.sub-dropdown-menu')?.classList.remove('active');
                            c.classList.remove('mobile-active');
                        }
                    });

                    subMenu.classList.toggle('active');
                    cat.classList.toggle('mobile-active');
                }
            });
        });

        // Close everything when clicking outside
        document.addEventListener('click', () => {
            dropdownMenu?.classList.remove('active');
            document.querySelectorAll('.sub-dropdown-menu').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.dropdown-category').forEach(c => c.classList.remove('mobile-active'));
        });
    }
}

// ========================
// Initialization
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initSlider();
    setupToastListeners();
    renderProducts();
    updateQuantity();
    initMobileMenu();
});

