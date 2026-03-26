
import { refreshCurrentUser, preventHashNavigation } from './login.js';
import { cart, initCart, addToCart, updateQuantityInCart } from '../data/cart.js';
import { initSearch } from './search.js';
import { fetchAPI } from './api.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let product = null;
let productReviews = [];

// Helper: Format date
function formatDate(isoDate) {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// Helper: Build star HTML
function buildStars(count, total = 5) {
    let html = '';
    for (let i = 1; i <= total; i++) {
        html += `<span style="color:${i <= count ? '#f5a623' : '#ddd'}; font-size:16px;">★</span>`;
    }
    return html;
}

document.addEventListener('DOMContentLoaded', async () => {
    preventHashNavigation();
    await refreshCurrentUser();
    initSearch();
    await initCart();

    try {
        const res = await fetchAPI(`/products/${productId}`);
        // Backend returns { status: "success", data: { id, name, ... } }
        if (res && res.status === 'success') {
            product = res.data;
        }

        const revRes = await fetchAPI(`/reviews/${productId}`);
        // Backend returns { status: "success", data: [...], ... }
        if (revRes && revRes.status === 'success') {
            productReviews = revRes.data || [];
        }
    } catch (err) {
        console.error("Failed to load product data:", err);
    }

    if (!product) {
        document.getElementById('loading-state').innerHTML = 'Produit non trouvé.';
        return;
    }

    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('product-content').style.display = 'grid';
    const detailsEl = document.getElementById('product-details');
    if (detailsEl) detailsEl.style.display = 'block';

    document.getElementById('product-title').textContent = product.name;
    const categoryName = product.category?.name || product.category || 'Catégorie inconnue';
    const categoryEl = document.getElementById('product-category');
    if (categoryEl) {
        categoryEl.textContent = categoryName;
        categoryEl.style.display = categoryName ? 'inline-block' : 'none';
    }
    document.getElementById('product-price').textContent = `€${(product.priceCents / 100).toFixed(2)}`;

    const avgScore = productReviews.length > 0
        ? (productReviews.reduce((s, r) => s + r.stars, 0) / productReviews.length).toFixed(1)
        : '0.0';
    const ratingEl = document.getElementById('product-rating');
    ratingEl.innerHTML =
        `${buildStars(Math.round(Number(avgScore)))} <strong>${avgScore}</strong> <span class="rating-link" style="color:#6ebe70; cursor:pointer; text-decoration:underline;">(${productReviews.length} avis)</span>`;

    ratingEl.querySelector('.rating-link').addEventListener('click', () => {
        document.querySelector('.product-reviews-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const mainImg = document.getElementById('main-product-image');
    mainImg.src = product.image;
    mainImg.alt = product.name;
    const thumbList = document.getElementById('thumbnail-list');
    (product.images && product.images.length ? product.images : [product.image]).forEach((url, i) => {
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

    const selectedVariants = {};
    if (product.variants && product.variants.length > 0) {
        const variantGroups = Array.isArray(product.variants) ? product.variants : [product.variants];
        const variantContainer = document.getElementById('variants-section');
        variantContainer.innerHTML = variantGroups.map((group, gi) => {
            if (!group.options || !group.options.length) return '';
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
                localStorage.setItem(`variant_${product.id}`, JSON.stringify(selectedVariants));
            });
        });
        localStorage.setItem(`variant_${product.id}`, JSON.stringify(selectedVariants));
    }

    document.getElementById('product-description').textContent = product.description;

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

    renderReviews();
    renderBuyBox();
    setTimeout(() => {
        updateGlobalCartQuantity();
        initMobileMenu();
    }, 200);
});

function renderReviews() {
    const reviewsContainer = document.getElementById('reviews-container');

    // Inject review form if logged in
    let formHTML = '';
    if (window.currentUser) {
        formHTML = `
            <div class="review-form-container" style="margin-bottom: 20px; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 8px; color: #111;">
                <h3 style="margin-top:0;">Laisser un avis</h3>
                <form id="add-review-form" style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
                    <select id="review-stars" required style="padding:10px; background:#f9f9f9; color:#111; border:1px solid #ddd; border-radius:4px;">
                        <option value="5">5 Étoiles</option>
                        <option value="4">4 Étoiles</option>
                        <option value="3">3 Étoiles</option>
                        <option value="2">2 Étoiles</option>
                        <option value="1">1 Étoile</option>
                    </select>
                    <textarea id="review-text" required placeholder="Votre avis..." style="padding:10px; height:80px; background:#f9f9f9; color:#111; border:1px solid #ddd; border-radius:4px;"></textarea>
                    <button type="submit" style="padding:10px; background:#6ebe70; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Envoyer</button>
                </form>
            </div>
        `;
    } else {
        formHTML = `<p style="margin-bottom:20px; font-style:italic;">Veuillez vous connecter pour laisser un avis.</p>`;
    }

    let reviewsListHTML = '';
    if (productReviews.length === 0) {
        reviewsListHTML = `<p style="color:#888; font-style:italic;">Aucun avis pour ce produit.</p>`;
    } else {
        reviewsListHTML = productReviews.map(r => {
            const user = r.user || { name: 'Utilisateur', avatar: '' };
            const initials = user.name ? user.name.split(' ').map(p => p[0]).join('') : 'U';
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
                        <span class="review-date">modifié ${formatDate(r.created_at || r.date)}</span>
                        <span class="review-stars">${buildStars(r.stars)}</span>
                    </div>
                </div>
                <p class="review-text">${r.text || r.reviewText}</p>
            </div>`;
        }).join('');
    }

    reviewsContainer.innerHTML = formHTML + reviewsListHTML;

    const form = document.getElementById('add-review-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const stars = parseInt(document.getElementById('review-stars').value);
            const text = document.getElementById('review-text').value;

            try {
                const res = await fetchAPI('/reviews', {
                    method: 'POST',
                    body: { productId, stars, text }
                });
                if (res.status === 'success') {
                    window.showGlobalToast('Avis ajouté !');
                    // Reload reviews
                    const revRes = await fetchAPI(`/reviews/${productId}`);
                    if (revRes.status === 'success') {
                        productReviews = revRes.data || [];
                        renderReviews();
                    }
                }
            } catch (err) {
                window.showGlobalToast('Erreur: ' + err.message);
            }
        });
    }
}

function renderBuyBox() {
    const container = document.getElementById('buy-action-container');
    const cartItem = cart.find(c => c.productId === product.id);
    const buyNowBtn = `<button id="btn-buy-now" style="background:#005bff; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; width:100%; margin-top:10px; font-size:16px; font-weight:bold;">Acheter maintenant</button>`;

    if (cartItem && cartItem.quantity > 0) {
        container.innerHTML = `
        <div class="grid-qty-changer">
            <button class="grid-qty-btn minus" id="btn-minus">-</button>
            <span class="grid-qty-val" id="qty-display">${cartItem.quantity}</span>
            <button class="grid-qty-btn plus" id="btn-plus">+</button>
        </div>
        ${buyNowBtn}`;

        document.getElementById('btn-plus').addEventListener('click', async () => {
            if (!window.currentUser) {
                if (window.showLoginModal) window.showLoginModal();
                return;
            }
            const currentItem = cart.find(c => c.productId === product.id);
            if (currentItem) {
                await updateQuantityInCart(product.id, currentItem.quantity + 1);
                
                // Update quantity display only
                const qtyDisplay = document.getElementById('qty-display');
                const updatedItem = cart.find(c => c.productId === product.id);
                if (qtyDisplay && updatedItem) {
                    qtyDisplay.textContent = updatedItem.quantity;
                }
                updateGlobalCartQuantity();
            }
        });

        document.getElementById('btn-minus').addEventListener('click', async () => {
            if (!window.currentUser) {
                if (window.showLoginModal) window.showLoginModal();
                return;
            }
            const currentItem = cart.find(c => c.productId === product.id);
            if (currentItem) {
                const newQuantity = currentItem.quantity - 1;
                await updateQuantityInCart(product.id, newQuantity);
                
                // If quantity reaches 0, renderBuyBox will switch to "Add to cart" button
                renderBuyBox();
                updateGlobalCartQuantity();
            }
        });
    } else {
        container.innerHTML = `<button class="button-add-to-cart" id="btn-add">Add to cart</button>${buyNowBtn}`;
        document.getElementById('btn-add').addEventListener('click', async () => {
            if (!window.currentUser) {
                if (window.showLoginModal) window.showLoginModal();
                return;
            }
            await addToCart(product.id);
            
            renderBuyBox();
            updateGlobalCartQuantity();
        });
    }

    document.getElementById('btn-buy-now').addEventListener('click', async () => {
        if (!window.currentUser) {
            if (window.showLoginModal) window.showLoginModal();
            return;
        }
        let currentItem = cart.find(c => c.productId === product.id);
        if (!currentItem || currentItem.quantity === 0) {
            await addToCart(product.id);
            
            currentItem = cart.find(c => c.productId === product.id);
        }
        localStorage.setItem('selectedForPayment', JSON.stringify([product.id]));
        window.location.href = 'payment.html';
    });
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
