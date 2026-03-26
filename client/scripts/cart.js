
import { refreshCurrentUser, preventHashNavigation } from './login.js';
import { cart, initCart, removeFromCart, suprimeAllProducts, updateQuantityInCart } from '../data/cart.js';
import { fetchAPI } from './api.js';
import { initSearch } from './search.js';

let products = [];
let deleteTimeout;
let deleteInterval;

// Fetch products directly
// No longer need a separate products fetch for the cart page,
// because the /cart API now returns product details in item.product.
// async function fetchProducts() { ... }

// Fonction principale pour afficher (et rafraîchir) le panier
function renderCart() {
    let cartHTML = '';

    cart.forEach(cartItem => {
        const productId = cartItem.productId;
        
        // Use details already embedded in the cart item (returned by backend)
        const name = cartItem.name || 'Produit sans nom';
        const image = cartItem.image || 'photo/Logo.png';
        const priceCents = cartItem.priceCents || 0;

        cartHTML += `           
        <div class="item item-container-${productId}">
            <div class="image-column">
                <input type="checkbox" class="item-checkbox" data-product-id="${productId}" data-price="${priceCents}" data-quantity="${cartItem.quantity}" checked>
                <a href="product.html?id=${productId}"><img src="${image}"></a>
            </div>
            <div class="item-title-column">
                <a href="product.html?id=${productId}" style="text-decoration:none; color:inherit;"><p class="title" style="cursor:pointer;">${name}</p></a>
                ${(() => {
                const stored = localStorage.getItem(`variant_${productId}`);
                if (!stored) return '';
                const selections = JSON.parse(stored);
                const chips = Object.entries(selections).map(([k, v]) => `${k}: <strong>${v}</strong>`).join(' &middot; ');
                return `<p style="font-size:12px; color:#888; margin:3px 0 6px;">${chips}</p>`;
            })()}
                <div class="item-title-column-icons">
                    <!-- Bouton pour supprimer un produit spécifiquement -->
                    <button class="icon-button delete-item-button" data-product-id="${productId}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <!-- Bouton coeur -->
                    <button class="icon-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                    </button>
                </div>
            </div>

            <div class="price-column">
                <p class="prix product-prix" id="price-display-${productId}">${((priceCents * cartItem.quantity) / 100).toFixed(2)} €</p>
            </div>
            <div class="input-column">
                <button class="quantity-button plus" data-product-id="${productId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
                <span class="quantityItem">${cartItem.quantity}</span>
                <button class="quantity-button minus" data-product-id="${productId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
                </button>
            </div>
        </div>
    `;
    });

    // Insertion du HTML généré dans la page
    const itemsContainer = document.querySelector('.items');
    if (itemsContainer) {
        itemsContainer.innerHTML = cartHTML || '<p style="text-align:center; padding:20px; color:#888; font-style:italic;">Votre panier est vide.</p>';
    }

    // Après avoir re-généré le HTML, il faut rattacher tous les écouteurs d'événements
    attachEventListeners();
    updateSummary();
}

function attachEventListeners() {
    // 1. Boutons "Supprimer un article"
    document.querySelectorAll('.delete-item-button').forEach(btn => {
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const itemId = btn.dataset.productId;
            await removeFromCart(itemId);

            // Remove the item container instead of re-rendering everything
            const itemContainer = document.querySelector(`.item-container-${itemId}`);
            if (itemContainer) {
                itemContainer.remove();
            }
            
            updateSummary();
            btn.disabled = false;
        });
    });

    // 2. Boutons "Plus (+)"
    document.querySelectorAll('.quantity-button.plus').forEach(btn => {
    btn.addEventListener('click', async () => {
        btn.disabled = true;
        const itemId = btn.dataset.productId;
        const item = cart.find(c => c.productId === itemId);
        if (item) {
            await updateQuantityInCart(itemId, item.quantity + 1);
            const updatedItem = cart.find(c => c.productId === itemId);
            if (updatedItem) {
                const qtySpan = btn.nextElementSibling;
                if (qtySpan) qtySpan.textContent = updatedItem.quantity;
                
                const priceDisplay = document.getElementById(`price-display-${itemId}`);
                if (priceDisplay) {
                    priceDisplay.textContent = `${((updatedItem.priceCents * updatedItem.quantity) / 100).toFixed(2)} €`;
                }

                const checkbox = btn.closest('.item').querySelector('.item-checkbox');
                if (checkbox) checkbox.dataset.quantity = updatedItem.quantity;
                updateSummary();
            }
        }
        btn.disabled = false;
    });
});

    // 3. Boutons "Moins (-)"
    document.querySelectorAll('.quantity-button.minus').forEach(btn => {
    btn.addEventListener('click', async () => {
        btn.disabled = true;
        const itemId = btn.dataset.productId;
        const item = cart.find(c => c.productId === itemId);
        if (item) {
            const newQuantity = item.quantity - 1;
            await updateQuantityInCart(itemId, newQuantity);
            
            if (newQuantity > 0) {
                const updatedItem = cart.find(c => c.productId === itemId);
                if (updatedItem) {
                    const qtySpan = btn.previousElementSibling;
                    if (qtySpan) qtySpan.textContent = updatedItem.quantity;
                    
                    const priceDisplay = document.getElementById(`price-display-${itemId}`);
                    if (priceDisplay) {
                        priceDisplay.textContent = `${((updatedItem.priceCents * updatedItem.quantity) / 100).toFixed(2)} €`;
                    }

                    const checkbox = btn.closest('.item').querySelector('.item-checkbox');
                    if (checkbox) checkbox.dataset.quantity = updatedItem.quantity;
                    updateSummary();
                }
            } else {
                // Remove the item row if quantity becomes 0
                const itemContainer = document.querySelector(`.item-container-${itemId}`);
                if (itemContainer) {
                    itemContainer.remove();
                }
                updateSummary();
            }
        }
        btn.disabled = false;
    });
});

    // 4. Cases à cocher individuelles
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const selectAllCheckbox = document.querySelector('.choisir-tous-input input');

    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSummary();
            const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked && itemCheckboxes.length > 0;
            }
        });
    });

    // 5. Case "Choisir tous"
    if (selectAllCheckbox) {
        const clone = selectAllCheckbox.cloneNode(true);
        selectAllCheckbox.parentNode.replaceChild(clone, selectAllCheckbox);
        clone.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.querySelectorAll('.item-checkbox').forEach(cb => {
                cb.checked = isChecked;
            });
            updateSummary();
        });
    }

    // 6. Bouton "Supprimer le panier complet"
    const deleteAllBtn = document.querySelector('.button-delete-all');
    if (deleteAllBtn) {
        const clone = deleteAllBtn.cloneNode(true);
        deleteAllBtn.parentNode.replaceChild(clone, deleteAllBtn);
        clone.addEventListener('click', () => {
            if (cart.length > 0) {
                showToast();
            }
        });
    }
}

function getCheckedProductIds() {
    return Array.from(document.querySelectorAll('.item-checkbox:checked')).map(cb => cb.dataset.productId);
}

function restoreCheckedStates(checkedIds) {
    document.querySelectorAll('.item-checkbox').forEach(cb => {
        if (checkedIds.includes(cb.dataset.productId)) {
            cb.checked = true;
        }
    });

    const selectAllCheckbox = document.querySelector('.choisir-tous-input input');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    if (selectAllCheckbox) {
        const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
        selectAllCheckbox.checked = allChecked && itemCheckboxes.length > 0;
    }

    updateSummary();
}

function updateSummary() {
    let totalCents = 0;
    let selectedQuantity = 0;

    document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
        const priceCents = parseInt(checkbox.dataset.price);
        const quantity = parseInt(checkbox.dataset.quantity);
        totalCents += priceCents * quantity;
        selectedQuantity += quantity;
    });

    const sum = totalCents / 100;

    const qtyItemsEl = document.querySelector('.quantity-items');
    if (qtyItemsEl) qtyItemsEl.innerHTML = `${selectedQuantity} items`;

    const itemsTotalEl = document.querySelector('.items-total');
    if (itemsTotalEl) itemsTotalEl.innerHTML = `Items (${selectedQuantity})`;

    const reqPrixEl = document.querySelector('.items-prix');
    if (reqPrixEl) reqPrixEl.textContent = sum.toFixed(2);

    const livraison = sum > 0 ? 2.99 : 0;
    const reqLivraisonEl = document.querySelector('.prix-livraison');
    if (reqLivraisonEl) reqLivraisonEl.textContent = livraison > 0 ? `${livraison} €` : `0 €`;

    const total = sum + livraison;
    const prixTotalEl = document.querySelector('.prix-total');
    if (prixTotalEl) prixTotalEl.textContent = `${total.toFixed(2)} €`;
}

function showToast() {
    const toast = document.getElementById('toast-container');
    const toastMessage = document.querySelector('.toast-message');
    if (toast) toast.classList.remove('toast-hidden');

    if (deleteTimeout) clearTimeout(deleteTimeout);
    if (deleteInterval) clearInterval(deleteInterval);

    let countdown = 5;
    toastMessage.textContent = `Tous les articles seront supprimés dans ${countdown} secondes`;

    deleteInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            toastMessage.textContent = `Tous les articles seront supprimés dans ${countdown} secondes`;
        } else {
            clearInterval(deleteInterval);
        }
    }, 1000);

    deleteTimeout = setTimeout(async () => {
        await suprimeAllProducts();
        if (toast) toast.classList.add('toast-hidden');
        const selectAllCb = document.querySelector('.choisir-tous-input input');
        if (selectAllCb) selectAllCb.checked = false;
        renderCart();
    }, 5000);

    const undoBtn = document.querySelector('.toast-undo');
    if (undoBtn) {
        const clone = undoBtn.cloneNode(true);
        undoBtn.parentNode.replaceChild(clone, undoBtn);
        clone.addEventListener('click', () => {
            clearTimeout(deleteTimeout);
            clearInterval(deleteInterval);
            if (toast) toast.classList.add('toast-hidden');
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

document.addEventListener('DOMContentLoaded', async () => {
    preventHashNavigation();
    await refreshCurrentUser();
    initSearch();

    // await fetchProducts(); // Removed
    await initCart();      // This now populates everything we need

    const selectAllCheckbox = document.querySelector('.choisir-tous-input input');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }

    renderCart();
    initMobileMenu();

    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', (e) => {
            e.preventDefault();
            if (!window.currentUser && localStorage.getItem('isLoggedIn') !== 'true') {
                if (window.showLoginModal) window.showLoginModal();
                return;
            }
            const checkedIds = getCheckedProductIds();
            if (checkedIds.length === 0) {
                if (window.showGlobalToast) window.showGlobalToast("Veuillez sélectionner au moins un article pour continuer.");
                return;
            }
            localStorage.setItem('selectedForPayment', JSON.stringify(checkedIds));
            window.location.href = 'payment.html'; // Assuming payment routes to Orders Checkout later
        });
    }
});
