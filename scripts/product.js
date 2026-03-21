import { products, reviews, users } from '../data/products.js';
import { cart, addToCart, updateQuantityInCart } from '../data/cart.js';
import { initSearch } from './search.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const product = products.find(p => p.id === productId);

// Helper: Format date as "15 février 2026"
function formatDate(isoDate) {
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const [year, month, day] = isoDate.split('-').map(Number);
    return `${day} ${months[month - 1]} ${year}`;
}

// Helper: Build star HTML
function buildStars(count, total = 5) {
    let html = '';
    for (let i = 1; i <= total; i++) {
        html += `<span style="color:${i <= count ? '#f5a623' : '#ddd'}; font-size:16px;">★</span>`;
    }
    return html;
}

document.addEventListener('DOMContentLoaded', () => {
    initSearch();

    if (!product) {
        document.getElementById('loading-state').innerHTML = 'Produit non trouvé.';
        return;
    }

    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('product-content').style.display = 'grid';
    const detailsEl = document.getElementById('product-details');
    if (detailsEl) detailsEl.style.display = 'block';

    // ─── Title / Category / Price ───
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-price').textContent = `€${(product.priceCents / 100).toFixed(2)}`;

    // ─── Dynamic Rating from reviews ───
    const productReviews = reviews.filter(r => r.itemId === product.id);
    const avgScore = productReviews.length > 0
        ? (productReviews.reduce((s, r) => s + r.stars, 0) / productReviews.length).toFixed(1)
        : '0.0';
    const ratingEl = document.getElementById('product-rating');
    ratingEl.innerHTML =
        `${buildStars(Math.round(Number(avgScore)))} <strong>${avgScore}</strong> <span class="rating-link" style="color:#6ebe70; cursor:pointer; text-decoration:underline;">(${productReviews.length} avis)</span>`;
    // Scroll to reviews on click
    ratingEl.querySelector('.rating-link').addEventListener('click', () => {
        document.querySelector('.product-reviews-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ─── Gallery ───
    const mainImg = document.getElementById('main-product-image');
    mainImg.src = product.image;
    mainImg.alt = product.name;
    const thumbList = document.getElementById('thumbnail-list');
    (product.images || [product.image]).forEach((url, i) => {
        const thumb = document.createElement('img');
        thumb.src = url;
        thumb.className = 'thumbnail-img' + (i === 0 ? ' active' : '');
        thumb.addEventListener('click', () => {
            mainImg.src = url;
            thumbList.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbList.appendChild(thumb);
    });

    // ─── Variants ───
    const selectedVariants = {}; // label -> selected value
    if (product.variants) {
        const variantGroups = Array.isArray(product.variants) ? product.variants : [product.variants];
        const variantContainer = document.getElementById('variants-section');
        variantContainer.innerHTML = variantGroups.map((group, gi) => {
            const firstVal = group.options[0].value;
            selectedVariants[group.label] = firstVal;
            const optionsHTML = group.options.map((opt, i) => {
                if (group.type === 'color') {
                    return `<button class="variant-btn color-btn ${i === 0 ? 'active' : ''}" 
                        style="background:${opt.color};" data-group="${gi}" data-label="${group.label}" data-value="${opt.value}" title="${opt.value}"></button>`;
                } else {
                    return `<button class="variant-btn text-btn ${i === 0 ? 'active' : ''}" 
                        data-group="${gi}" data-label="${group.label}" data-value="${opt.value}">${opt.value}</button>`;
                }
            }).join('');
            return `
                <div class="variant-group" data-group-index="${gi}">
                    <p class="variant-label">${group.label} : <strong class="selected-val-${gi}">${firstVal}</strong></p>
                    <div class="variant-options">${optionsHTML}</div>
                </div>`;
        }).join('');

        variantContainer.querySelectorAll('.variant-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gi = btn.dataset.group;
                const label = btn.dataset.label;
                variantContainer.querySelectorAll(`.variant-btn[data-group="${gi}"]`).forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelector(`.selected-val-${gi}`).textContent = btn.dataset.value;
                selectedVariants[label] = btn.dataset.value;
                // Persist to localStorage so cart can display it
                const key = `variant_${product.id}`;
                localStorage.setItem(key, JSON.stringify(selectedVariants));
            });
        });
        // Save initial defaults
        localStorage.setItem(`variant_${product.id}`, JSON.stringify(selectedVariants));
    }

    // ─── Description ───
    document.getElementById('product-description').textContent = product.description;

    // ─── Characteristics Table ───
    if (product.characteristics && product.characteristics.length > 0) {
        const charaSection = document.getElementById('characteristics-section');
        charaSection.innerHTML = `
            <h2 class="section-title">Caractéristiques</h2>
            <div class="characteristics-table">
                ${product.characteristics.map(c => `
                    <div class="char-row">
                        <span class="char-label">${c.label}</span>
                        <span class="char-value">${c.value}</span>
                    </div>`).join('')}
            </div>`;
    }

    // ─── Reviews Section ───
    const reviewsContainer = document.getElementById('reviews-container');
    if (productReviews.length === 0) {
        reviewsContainer.innerHTML = `<p style="color:#888; font-style:italic;">Aucun avis pour ce produit.</p>`;
    } else {
        reviewsContainer.innerHTML = productReviews.map(r => {
            const user = users.find(u => u.id === r.userId) || { name: 'Utilisateur', avatar: '' };
            const initials = user.name.split(' ').map(p => p[0]).join('');
            const avatarHTML = user.avatar
                ? `<img src="${user.avatar}" alt="${user.name}" class="review-avatar">`
                : `<div class="review-avatar avatar-initials">${initials}</div>`;
            return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-user-info">
                        ${avatarHTML}
                        <strong class="review-username">${user.name}</strong>
                    </div>
                    <div class="review-meta">
                        <span class="review-date">modifié ${formatDate(r.date)}</span>
                        <span class="review-stars">${buildStars(r.stars)}</span>
                    </div>
                </div>
                <p class="review-text">${r.reviewText}</p>
            </div>`;
        }).join('');
    }

    renderBuyBox();
    updateGlobalCartQuantity();
    initMobileMenu();
});

function renderBuyBox() {
    const container = document.getElementById('buy-action-container');
    const cartItem = cart.find(c => c.productId === product.id);
    if (cartItem && cartItem.quantity > 0) {
        container.innerHTML = `
        <div class="grid-qty-changer">
            <button class="grid-qty-btn minus" id="btn-minus">-</button>
            <span class="grid-qty-val">${cartItem.quantity}</span>
            <button class="grid-qty-btn plus" id="btn-plus">+</button>
        </div>`;
        document.getElementById('btn-plus').addEventListener('click', () => {
            updateQuantityInCart(product.id, cartItem.quantity + 1);
            renderBuyBox(); updateGlobalCartQuantity();
        });
        document.getElementById('btn-minus').addEventListener('click', () => {
            updateQuantityInCart(product.id, cartItem.quantity - 1);
            renderBuyBox(); updateGlobalCartQuantity();
        });
    } else {
        container.innerHTML = `<button class="button-add-to-cart" id="btn-add">Add to cart</button>`;
        document.getElementById('btn-add').addEventListener('click', () => {
            addToCart(product.id);
            renderBuyBox(); updateGlobalCartQuantity();
        });
    }
}

function updateGlobalCartQuantity() {
    let total = 0;
    cart.forEach(c => total += c.quantity);
    const el = document.querySelector('.quantity');
    if (el) el.innerHTML = total;
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
            cat.addEventListener('click', (e) => {
                const subMenu = cat.querySelector('.sub-dropdown-menu');
                if (subMenu) {
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
        });

        document.addEventListener('click', () => {
            dropdownMenu?.classList.remove('active');
            document.querySelectorAll('.sub-dropdown-menu').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.dropdown-category').forEach(c => c.classList.remove('mobile-active'));
        });
    }
}

