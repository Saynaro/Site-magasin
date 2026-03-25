/**
 * Main application script for Magasin e-commerce.
 * Handles product rendering, filtering (search), sorting, pagination,
 * sliding banner, and shopping cart UI interactions.
 */

import './login.js';
import {products} from '../data/products.js';
import {cart, addToCart, updateQuantityInCart} from '../data/cart.js';
import {initSearch} from './search.js';

// Global variables for toast notifications and pagination state
let toastTimeout;
let currentToastProductId = null;
let currentPage = 1;
const itemsPerPage = 6; // Number of products to display per page

/**
 * ========================
 * Slider Logic
 * ========================
 * Initializes the image slider on the homepage.
 */
function initSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const dotsNav = document.querySelector('.slider-dots');

    if (slides.length === 0) return;

    // Create navigation dots dynamically based on number of slides
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(i === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });
    
    const dots = Array.from(dotsNav.children);
    let currentIndex = 0;

    /**
     * Moves the slider track to the specified slide index.
     * @param {number} index - Index of the slide to show.
     */
    function moveToSlide(index) {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Event listeners for manual navigation buttons
    nextBtn.addEventListener('click', () => {
        let nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        let prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        moveToSlide(prevIndex);
    });

    // Dot navigation listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => moveToSlide(index));
    });

    // Automatic slide transition every 5 seconds
    setInterval(() => {
        let nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    }, 5000);
}

/**
 * ========================
 * Product Rendering Logic
 * ========================
 * Filters, sorts, and paginates products, then renders them to the DOM.
 */
function renderProducts() {
    let productHTML = '';
    
    // 1. Parse search parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search')?.toLowerCase() || '';

    // 2. Filter products based on search query (name, description, category)
    let filteredProducts = products.filter(p => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        
        if (p.category.toLowerCase() === query) return true;
        if (p.subcategory && p.subcategory.toLowerCase() === query) return true;

        return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    });

    // 3. Apply Sorting
    const sortValue = document.getElementById('sort-select')?.value || 'default';
    if (sortValue === 'price-asc') {
        filteredProducts.sort((a, b) => a.priceCents - b.priceCents);
    } else if (sortValue === 'price-desc') {
        filteredProducts.sort((a, b) => b.priceCents - a.priceCents);
    }

    // 4. Handle Empty Results
    if (filteredProducts.length === 0) {
        document.querySelector('.items').innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 18px;">Aucun produit trouvé pour "${searchQuery}"</p>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    // 5. Apply Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    // Ensure currentPage is within bounds if filters changed
    if (currentPage > totalPages) currentPage = 1;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    // 6. Generate HTML for filtered/sorted/paginated products
    paginatedProducts.forEach(product => {
        const cartItem = cart.find(c => c.productId === product.id);
        
        let actionHTML;
        // Show quantity controls if item is in cart, otherwise show "Add to cart" button
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
                <img src="${product.image}" alt="${product.name}">
                <h3 style="margin-top: 10px;">${product.name}</h3>
            </a>
            <p style="color: #6ebe70; font-size: 14px; margin: 5px 0;">${product.category}</p>
            <p style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">€${(product.priceCents / 100).toFixed(2)}</p>
            ${actionHTML}
        </div>
        `;
    });

    // Update the products grid
    document.querySelector('.items').innerHTML = productHTML;

    // 7. Render Pagination Controls
    renderPagination(totalPages);

    // 8. Attach event listeners to newly rendered elements
    attachProductEventListeners();
}

/**
 * Renders pagination buttons (prev, page numbers, next).
 * @param {number} totalPages - Total number of pages.
 */
function renderPagination(totalPages) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''}>❮</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="page-btn num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
        `;
    }

    paginationHTML += `
        <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''}>❯</button>
    `;

    paginationEl.innerHTML = paginationHTML;

    // Add listeners to pagination buttons
    paginationEl.querySelectorAll('.page-btn.num').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderProducts();
            window.scrollTo({ top: 400, behavior: 'smooth' });
        });
    });

    paginationEl.querySelector('.page-btn.prev')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    });

    paginationEl.querySelector('.page-btn.next')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    });
}

/**
 * Attaches event listeners for "Add to cart" and quantity control buttons.
 */
function attachProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.button-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                if (window.showLoginModal) window.showLoginModal();
                return;
            }
            const productId = button.dataset.productId;
            addToCart(productId);
            updateQuantity();
            renderProducts();
            showToastForProduct(productId);
        });
    });

    // Increment quantity buttons
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

    // Decrement quantity buttons
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

/**
 * Updates the cart quantity badge in the header.
 */
function updateQuantity() {
    let cartQuantity = 0;
    cart.forEach(cartItem => {
        cartQuantity += cartItem.quantity;
    });
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartQuantity;
}

/**
 * ========================
 * Toast UI Logic
 * ========================
 * Displays a temporary notification when an item is added to the cart.
 */
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

/**
 * Resets the 5-second timer for the toast visibility.
 */
function resetToastTimer() {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        const toast = document.getElementById('cart-toast-container');
        if (toast) toast.classList.add('toast-hidden');
    }, 5000);
}

/**
 * Sets up listeners for interactions within the toast notification.
 */
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

/**
 * Initializes mobile-specific behavior for the catalog menu.
 */
function initMobileMenu() {
    const catalogContainer = document.querySelector('.catalog-container');
    const catalogBtn = catalogContainer?.querySelector('.catalog');
    const dropdownMenu = catalogContainer?.querySelector('.dropdown-menu');
    
    if (window.innerWidth <= 768) {
        if (catalogBtn && dropdownMenu) {
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

        const categories = document.querySelectorAll('.dropdown-category');
        categories.forEach(cat => {
            const titleLink = cat.querySelector('.category-title');
            const subMenu = cat.querySelector('.sub-dropdown-menu');
            
            if (titleLink && subMenu) {
                titleLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation();
                        
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
            }

            const subLinks = cat.querySelectorAll('.sub-dropdown-menu a');
            subLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        dropdownMenu?.classList.remove('active');
                        subMenu?.classList.remove('active');
                        cat.classList.remove('mobile-active');
                    }
                });
            });
        });

        document.addEventListener('click', () => {
            dropdownMenu?.classList.remove('active');
            document.querySelectorAll('.sub-dropdown-menu').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.dropdown-category').forEach(c => c.classList.remove('mobile-active'));
        });
    }
}

/**
 * ========================
 * Initialization
 * ========================
 * Runs when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initSlider();
    setupToastListeners();
    renderProducts();
    updateQuantity();
    initMobileMenu();

    // Listener for sorting selection changes
    document.getElementById('sort-select')?.addEventListener('change', () => {
        currentPage = 1; // Reset to first page when sort changes
        renderProducts();
    });
});

