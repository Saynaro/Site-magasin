/**
 * Main application script for Magasin e-commerce.
 * Handles product rendering, filtering (search), sorting, pagination,
 * sliding banner, and shopping cart UI interactions.
 */

import { refreshCurrentUser, preventHashNavigation } from './login.js';
import { cart, initCart, addToCart, updateQuantityInCart } from '../data/cart.js';
import { initSearch } from './search.js';
import { fetchAPI, API_URL } from './api.js';

console.log('main.js executing', new Date().toISOString());
window.addEventListener('beforeunload', () => {
    console.trace('PAGE IS UNLOADING');
});

if (window.mainJsLoaded) {
    console.warn("main.js already loaded, skipping execution.");
} else {
    window.mainJsLoaded = true;

// Global variables
let products = [];
let banners = [];
let toastTimeout;
let currentToastProductId = null;
let currentPage = 1;
const itemsPerPage = 9;

/**
 * ========================
 * Load and Update Categories Menu
 * ========================
 */
async function updateCategoriesMenu() {
    try {
        const res = await fetchAPI('/categories/menu');
        if (!Array.isArray(res)) return;

        res.forEach(category => {
            // Find the category element by its text content (e.g., "Food", "Electronics")
            const categoryEl = Array.from(document.querySelectorAll('.dropdown-category'))
                .find(el => {
                    const title = el.querySelector('.category-title');
                    return title && title.textContent.trim().includes(category.name);
                });

            if (!categoryEl) return;

            const titleLink = categoryEl.querySelector('.category-title');
            if (titleLink) {
                titleLink.href = `index.html?categoryId=${category.id}`;
            }

            const subMenu = categoryEl.querySelector('.sub-dropdown-menu');
            if (subMenu && category.subCategories) {
                subMenu.innerHTML = category.subCategories.map(sub => {
                    // Capitalize first letter of the subcategory
                    const capitalized = sub.name.charAt(0).toUpperCase() + sub.name.slice(1);
                    return `<a href="index.html?categoryId=${sub.id}">${capitalized}</a>`;
                }).join('');
            }
        });
    } catch (err) {
        console.error("Failed to load categories menu:", err);
    }
}

/**
 * ========================
 * Slider Logic
 * ========================
 */
async function initSlider() {
    const track = document.querySelector('.slider-track');
    if (!track) return;

    // Fetch banners
    try {
        const res = await fetchAPI('/banners');
        if (Array.isArray(res)) {
            banners = res;
        }
    } catch (err) {
        console.error("Failed to load banners:", err);
    }

    if (banners.length > 0) {
        track.innerHTML = '';
        banners.forEach(banner => {
            track.innerHTML += `
                <div class="slide">
                    <img src="${banner.imageUrl}" alt="${banner.title}">
                </div>
            `;
        });
    }

    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const dotsNav = document.querySelector('.slider-dots');

    if (slides.length === 0) return;

    dotsNav.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
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

    setInterval(() => {
        let nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        moveToSlide(nextIndex);
    }, 5000);
}

/**
 * ========================
 * Product Rendering Logic
 * ========================
 */
async function loadProducts() {
    try {
        console.log('--- FETCH CALLED ---');
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get('search') || '';
        const catId = urlParams.get('categoryId') || '';
        const sortValue = document.getElementById('sort-select')?.value || 'default';
        
        let sortBy = 'default';
        if (sortValue === 'price-asc') sortBy = 'price_asc';
        else if (sortValue === 'price-desc') sortBy = 'price_desc';

        const res = await fetchAPI(`/products?page=${currentPage}&limit=${itemsPerPage}&search=${search}&categoryId=${catId}&sortBy=${sortBy}`);
        
        if (res && res.products) {
            products = res.products;
            renderProducts(res.totalPages || 1);
        }
    } catch (err) {
        console.error("Failed to fetch products:", err);
        return;
    }
}

function renderProducts(totalPagesFromServer) {
    let productHTML = '';

    if (products.length === 0) {
        document.querySelector('.items').innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 18px;">Aucun produit trouvé.</p>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const isAdmin = window.currentUser?.role === 'ADMIN';

    products.forEach(product => {
        let adminControls = '';
        if (isAdmin) {
            adminControls = `
                <div class="admin-grid-controls" style="margin-top: 10px;">
                    <button class="admin-edit-product-btn" data-product-id="${product.id}">Edit</button>
                    <button class="admin-delete-product-btn" data-product-id="${product.id}">Delete</button>
                </div>
            `;
        }

        const categoryName = product.category?.name || product.category || '';
        const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

        productHTML += `
        <div class="item" style="position: relative; display: flex; flex-direction: column; height: 100%;">
            <a href="product.html?id=${product.id}" class="items-title">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="item-info" style="display: flex; flex-direction: column; flex: 1; padding: 15px;">
                <a href="product.html?id=${product.id}" class="items-title">
                    <h3 style="margin-top: 0;">${product.name}</h3>
                </a>
                <p style="color: #6ebe70; font-size: 14px; margin: 5px 0;">${capitalizedCategory}</p>
                <div style="flex-grow: 1;"></div>
                <p style="font-weight: bold; font-size: 20px; margin-top: 10px;">€${(product.priceCents / 100).toFixed(2)}</p>
                ${adminControls}
            </div>
        </div>
        `;
    });

    document.querySelector('.items').innerHTML = productHTML;

    // Inject Add Product button if admin
    if (isAdmin && currentPage === 1) {
        document.querySelector('.items').insertAdjacentHTML('afterbegin', `
            <div class="item" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; border: 2px dashed #ccc; cursor: pointer; color: #111;" onclick="window.showProductModal()">
                <div style="font-size: 40px; color: #888;">+</div>
                <h3 style="color: #666; margin-top: 10px;">Add New Product</h3>
            </div>
        `);
        injectAdminProductModal();
    }

    renderPagination(totalPagesFromServer);
    attachProductEventListeners();
}

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

    paginationEl.querySelectorAll('.page-btn.num').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            loadProducts();
            window.scrollTo({ top: 400, behavior: 'smooth' });
        });
    });

    paginationEl.querySelector('.page-btn.prev')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts();
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    });

    paginationEl.querySelector('.page-btn.next')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadProducts();
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    });
}

function attachProductEventListeners() {
    document.querySelectorAll('.button-add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    document.querySelectorAll('.grid-qty-btn.plus').forEach(button => {
        button.addEventListener('click', handleQtyIncrement);
    });

    document.querySelectorAll('.grid-qty-btn.minus').forEach(button => {
        button.addEventListener('click', handleQtyDecrement);
    });

    document.querySelectorAll('.admin-edit-product-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const product = products.find(p => p.id === btn.dataset.productId);
            if (product) {
                window.showProductModal(product);
            }
        });
    });

    document.querySelectorAll('.admin-delete-product-btn').forEach(btn => {
        btn.addEventListener('click', handleAdminDelete);
    });

    // Variant selection
    document.querySelectorAll('.item-variant-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = btn.closest('.item-variant-options');
            container.querySelectorAll('.item-variant-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

async function handleAddToCart(event) {
    const button = event.target.closest('.button-add-to-cart');
    if (!button) return;

    if (!window.currentUser) {
        if (window.showLoginModal) window.showLoginModal();
        return;
    }
    const productId = button.dataset.productId;
    button.disabled = true;

    // Capture selected variants
    const selected = {};
    const card = button.closest('.item');
    card.querySelectorAll('.item-variant-btn.active').forEach(btn => {
        selected[btn.dataset.group] = btn.dataset.value;
    });

    // Save to localStorage so cart page can display it (consistent with product.js logic)
    if (Object.keys(selected).length > 0) {
        localStorage.setItem(`variant_${productId}`, JSON.stringify(selected));
    }

    await addToCart(productId, 1, selected);
    updateQuantity();
    
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(c => c.productId === productId);
    if (product && cartItem) {
        button.outerHTML = `
            <div class="grid-qty-changer" data-product-id="${product.id}">
                <button class="grid-qty-btn minus" data-product-id="${product.id}">-</button>
                <span class="grid-qty-val">${cartItem.quantity}</span>
                <button class="grid-qty-btn plus" data-product-id="${product.id}">+</button>
            </div>
        `;
        const newPlus = document.querySelector(`.grid-qty-changer[data-product-id="${productId}"] .grid-qty-btn.plus`);
        const newMinus = document.querySelector(`.grid-qty-changer[data-product-id="${productId}"] .grid-qty-btn.minus`);
        
        if (newPlus) newPlus.addEventListener('click', handleQtyIncrement);
        if (newMinus) newMinus.addEventListener('click', handleQtyDecrement);
    }
    // Note: button.disabled = false is intentionally omitted since outerHTML replaced the button
    showToastForProduct(productId);
}

async function handleQtyIncrement(event) {
    const button = event.target.closest('.grid-qty-btn.plus');
    if (!button) return;
    
    const productId = button.dataset.productId;
    const item = cart.find(c => c.productId === productId);
    if (item) {
        const qtyDisplay = button.previousElementSibling; // ← was nextElementSibling
        const optimisticQty = item.quantity + 1;
        
        if (qtyDisplay) qtyDisplay.textContent = optimisticQty;
        item.quantity = optimisticQty;
        updateQuantity();

        button.disabled = true;
        await updateQuantityInCart(productId, optimisticQty);
        button.disabled = false;
    }
}

async function handleQtyDecrement(event) {
    const button = event.target.closest('.grid-qty-btn.minus');
    if (!button) return;
    
    const productId = button.dataset.productId;
    const item = cart.find(c => c.productId === productId);
    if (item && item.quantity >= 1) {
        const qtyDisplay = button.nextElementSibling; // was previousElementSibling
        const optimisticQty = item.quantity - 1;
        
        if (optimisticQty > 0) {
            if (qtyDisplay) qtyDisplay.textContent = optimisticQty;
            item.quantity = optimisticQty;
            updateQuantity();

            button.disabled = true;
            await updateQuantityInCart(productId, optimisticQty);
            button.disabled = false;
        } else {
            // Quantity becomes 0, remove and show "Add to cart"
            item.quantity = 0;
            updateQuantity();
            
            const container = button.closest('.grid-qty-changer');
            if (container) {
                container.outerHTML = `<button class="button-add-to-cart" data-product-id="${productId}">Add to cart</button>`;
                const newBtn = document.querySelector(`.button-add-to-cart[data-product-id="${productId}"]`);
                if (newBtn) {
                    newBtn.addEventListener('click', handleAddToCart);
                }
            }
            await updateQuantityInCart(productId, 0);
        }
    }
}

async function handleAdminDelete(event) {
    const btn = event.target.closest('.admin-delete-product-btn');
    if (!btn) return;

    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        const res = await fetchAPI(`/products/delete/${btn.dataset.productId}`, { method: 'DELETE' });
        if (res.status === 'success') {
            window.showGlobalToast('Product deleted.');
            currentPage = 1;
            loadProducts();
        }
    } catch (e) {
        window.showGlobalToast('Failed: ' + e.message);
    }
}



function updateQuantity() {
    let cartQuantity = 0;
    cart.forEach(cartItem => {
        cartQuantity += cartItem.quantity;
    });
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartQuantity;
}

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
        btnPlus.addEventListener('click', async () => {
            if (!currentToastProductId) return;
            const cartItem = cart.find(c => c.productId === currentToastProductId);
            if (cartItem) {
                // updateQuantityInCart already calls initCart() internally
                await updateQuantityInCart(currentToastProductId, cartItem.quantity + 1);
                const updatedItem = cart.find(c => c.productId === currentToastProductId);
                if (updatedItem) {
                    document.querySelector('.toast-qty-val').textContent = updatedItem.quantity;
                }
                updateQuantity();
                resetToastTimer();
            }
        });
    }

    if (btnMinus) {
        btnMinus.addEventListener('click', async () => {
            if (!currentToastProductId) return;
            const cartItem = cart.find(c => c.productId === currentToastProductId);
            if (cartItem && cartItem.quantity > 0) {
                // updateQuantityInCart already calls initCart() internally
                await updateQuantityInCart(currentToastProductId, cartItem.quantity - 1);
                const updatedItem = cart.find(c => c.productId === currentToastProductId);
                if (updatedItem && updatedItem.quantity > 0) {
                    document.querySelector('.toast-qty-val').textContent = updatedItem.quantity;
                } else {
                    document.getElementById('cart-toast-container').classList.add('toast-hidden');
                }
                updateQuantity();
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

// Simple Admin Product Modal
function injectAdminProductModal() {
    if (document.getElementById('admin-product-modal-ol')) return;
    const modal = `
    <div id="admin-product-modal-ol" style="display:none; position:fixed; top:0;left:0;right:0;bottom:0; background:rgba(0,0,0,0.5); z-index:10000; align-items:center; justify-content:center;">
        <div style="background:#fff; color:#111; padding:20px; border-radius:8px; width:400px; max-width:90%; border: 1px solid #ddd;">
            <h2 id="apm-title">Product</h2>
            <form id="apm-form" style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                <input type="hidden" id="apm-id">
                <input type="text" id="apm-name" placeholder="Name" required style="padding:10px; background:#f9f9f9; border:1px solid #ddd; color:#111;">
                <input type="text" id="apm-slug" placeholder="Slug (unique)" required style="padding:10px; background:#f9f9f9; border:1px solid #ddd; color:#111;">
                <textarea id="apm-desc" placeholder="Description" style="padding:10px; height:80px; background:#f9f9f9; border:1px solid #ddd; color:#111;"></textarea>
                <input type="number" id="apm-price" placeholder="Price in cents" required style="padding:10px; background:#f9f9f9; border:1px solid #ddd; color:#111;">
                <input type="number" id="apm-cat" placeholder="Category ID (e.g. 1)" required style="padding:10px; background:#f9f9f9; border:1px solid #ddd; color:#111;">
                <input type="text" id="apm-img" placeholder="Image URL" required style="padding:10px; background:#f9f9f9; border:1px solid #ddd; color:#111;">
                
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button type="button" onclick="document.getElementById('admin-product-modal-ol').style.display='none'" style="flex:1; padding:10px; background:#eee; color:#333; border:1px solid #ccc; cursor:pointer;">Cancel</button>
                    <button type="submit" style="flex:1; padding:10px; background:#6ebe70; color:white; border:none; cursor:pointer;">Save</button>
                </div>
            </form>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modal);

    window.showProductModal = (product = null) => {
        document.getElementById('apm-id').value = product ? product.id : '';
        document.getElementById('apm-name').value = product ? product.name : '';
        document.getElementById('apm-slug').value = product ? product.slug : '';
        document.getElementById('apm-desc').value = product ? product.description : '';
        document.getElementById('apm-price').value = product ? product.priceCents : '';
        document.getElementById('apm-cat').value = product ? product.categoryId : 1;
        document.getElementById('apm-img').value = product ? product.image : '';
        document.getElementById('admin-product-modal-ol').style.display = 'flex';
    };

    document.getElementById('apm-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('apm-id').value;
        const payload = {
            name: document.getElementById('apm-name').value,
            slug: document.getElementById('apm-slug').value,
            description: document.getElementById('apm-desc').value,
            priceCents: parseInt(document.getElementById('apm-price').value),
            categoryId: parseInt(document.getElementById('apm-cat').value),
            image: document.getElementById('apm-img').value
        };

        try {
            let res;
            if (id) {
                res = await fetchAPI(`/products/update/${id}`, { method: 'PATCH', body: payload });
            } else {
                res = await fetchAPI('/products/create', { method: 'POST', body: payload });
            }
            if (res.status === 'success') {
                document.getElementById('admin-product-modal-ol').style.display = 'none';
                window.showGlobalToast('Product saved successfully');
                currentPage = 1;
                loadProducts();
            }
        } catch (err) {
            window.showGlobalToast('Error: ' + err.message);
        }
    });
}

/**
 * ========================
 * Initialization
 * ========================
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded fired');
    // 0. Prevent anchors from reloading the page unexpectedly
    preventHashNavigation();

    // 1. Initialise auth state — called ONCE here, not again in initCart()
    await refreshCurrentUser();
    initSearch();

    // 2. Load data
    await initSlider();
    await initCart();
    await updateCategoriesMenu();
    
    // 3. Load products once
    await loadProducts(); 
    
    // 4. Handle UI
    updateQuantity();
    initMobileMenu();
    setupToastListeners();

    // Sort listener
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.onchange = () => {
            currentPage = 1;
            loadProducts();
        };
    }
});
}