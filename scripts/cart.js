import { cart, removeFromCart, suprimeAllProducts, updateQuantityInCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { initSearch } from './search.js';

// Variables globales pour gérer le toast d'annulation
let deleteTimeout;
let deleteInterval;

// Fonction principale pour afficher (et rafraîchir) le panier
function renderCart() {
    let cartHTML = '';

    cart.forEach(cartItem => {
        const productId = cartItem.productId;
        let matchingProduct;

        // Trouver le produit correspondant dans notre base de données "products"
        products.forEach(product => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        // Si le produit n'existe plus dans la base (ex: données de test obsolètes), on l'ignore
        if (!matchingProduct) {
            removeFromCart(productId);
            return;
        }

        // Génération du HTML pour chaque produit dans le panier
        // data-price, data-quantity et data-product-id nous permettent de récupérer
        // les données facilement lors des clics sur les boutons / cases à cocher.
        cartHTML += `           
        <div class="item item-container-${matchingProduct.id}">
            <div class="image-column">
                <input type="checkbox" class="item-checkbox" data-product-id="${matchingProduct.id}" data-price="${matchingProduct.priceCents}" data-quantity="${cartItem.quantity}">
                <a href="product.html?id=${matchingProduct.id}"><img src="${matchingProduct.image}"></a>
            </div>
            <div class="item-title-column">
                <a href="product.html?id=${matchingProduct.id}" style="text-decoration:none; color:inherit;"><p class="title" style="cursor:pointer;">${matchingProduct.name}</p></a>
                ${(() => {
                    const stored = localStorage.getItem(`variant_${matchingProduct.id}`);
                    if (!stored) return '';
                    const selections = JSON.parse(stored);
                    const chips = Object.entries(selections).map(([k, v]) => `${k}: <strong>${v}</strong>`).join(' &middot; ');
                    return `<p style="font-size:12px; color:#888; margin:3px 0 6px;">${chips}</p>`;
                })()}
                <div class="item-title-column-icons">
                    <!-- Bouton pour supprimer un produit spécifiquement -->
                    <button class="icon-button delete-item-button" data-product-id="${matchingProduct.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <!-- Bouton coeur -->
                    <button class="icon-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                    </button>
                </div>
            </div>

            <div class="price-column">
                <p class="prix product-prix">${((matchingProduct.priceCents * cartItem.quantity) / 100).toFixed(2)} €</p>
            </div>
            <div class="input-column">
                <!-- Bouton "+" pour augmenter la quantité -->
                <button class="quantity-button plus" data-product-id="${matchingProduct.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
                <span class="quantityItem">${cartItem.quantity}</span>
                <!-- Bouton "-" pour diminuer la quantité -->
                <button class="quantity-button minus" data-product-id="${matchingProduct.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
                </button>
            </div>
        </div>
    `
    });

    // Insertion du HTML généré dans la page
    document.querySelector('.items').innerHTML = cartHTML;
    
    // Après avoir re-généré le HTML, il faut rattacher tous les écouteurs d'événements
    attachEventListeners();
    
    // Et recalculer le prix total et la quantité
    updateSummary();
}

function attachEventListeners() {
    // 1. Boutons "Supprimer un article"
    document.querySelectorAll('.delete-item-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.productId;
            removeFromCart(itemId);
            
            // On sauvegarde quels éléments étaient cochés
            const checkedIds = getCheckedProductIds();
            // On rafraîchit l'affichage
            renderCart();
            // On restaure l'état coché
            restoreCheckedStates(checkedIds);
        });
    });

    // 2. Boutons "Plus (+)"
    document.querySelectorAll('.quantity-button.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.productId;
            const item = cart.find(c => c.productId === itemId);
            if (item) {
                updateQuantityInCart(itemId, item.quantity + 1);
                const checkedIds = getCheckedProductIds();
                renderCart();
                restoreCheckedStates(checkedIds);
            }
        });
    });

    // 3. Boutons "Moins (-)"
    document.querySelectorAll('.quantity-button.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.dataset.productId;
            const item = cart.find(c => c.productId === itemId);
            if (item && item.quantity > 1) { // Ne pas descendre en dessous de 1
                updateQuantityInCart(itemId, item.quantity - 1);
                const checkedIds = getCheckedProductIds();
                renderCart();
                restoreCheckedStates(checkedIds);
            }
        });
    });

    // 4. Cases à cocher individuelles
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const selectAllCheckbox = document.querySelector('.choisir-tous-input input');
    
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSummary();
            
            // Si toutes les cases sont cochées, on coche "Choisir tous".
            // Si une case est décochée, on décoche "Choisir tous".
            const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked && itemCheckboxes.length > 0;
            }
        });
    });

    // 5. Case "Choisir tous"
    if (selectAllCheckbox) {
        // Pour éviter de dupliquer les événements si on appelle renderCart(),
        // on remplace le bouton par un clone propre (qui efface les vieux event listeners)
        const clone = selectAllCheckbox.cloneNode(true);
        selectAllCheckbox.parentNode.replaceChild(clone, selectAllCheckbox);
        clone.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            // On coche ou décoche tout
            document.querySelectorAll('.item-checkbox').forEach(cb => {
                cb.checked = isChecked;
            });
            updateSummary(); // On recalcule le total
        });
    }

    // 6. Bouton "Supprimer le panier complet"
    const deleteAllBtn = document.querySelector('.button-delete-all');
    if (deleteAllBtn) {
        // Même technique de clonage
        const clone = deleteAllBtn.cloneNode(true);
        deleteAllBtn.parentNode.replaceChild(clone, deleteAllBtn);
        clone.addEventListener('click', () => {
            if (cart.length > 0) {
                showToast(); // Affiche la notification de 5 secondes
            }
        });
    }
}

// Récupérer les identifiants des produits cochés
function getCheckedProductIds() {
    return Array.from(document.querySelectorAll('.item-checkbox:checked')).map(cb => cb.dataset.productId);
}

// Restaurer l'état des cases à cocher après un rafraîchissement
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

// Calculer et afficher le prix total dynamique basé sur ce qui est sélectionné
function updateSummary() {
    let totalCents = 0;
    let selectedQuantity = 0;

    // Ne boucler que sur les cases *cochées*
    document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
        const priceCents = parseInt(checkbox.dataset.price);
        const quantity = parseInt(checkbox.dataset.quantity);
        totalCents += priceCents * quantity;
        selectedQuantity += quantity;
    });

    const sum = totalCents / 100;
    
    // Mettre à jour l'HTML pour les totaux
    document.querySelector('.quantity-items').innerHTML = `${selectedQuantity} items`;
    document.querySelector('.items-total').innerHTML = `Items (${selectedQuantity})`;
    document.querySelector('.items-prix').textContent = sum.toFixed(2);
    
    // Livraison gratuite si le panier est vide (ou si rien n'est coché)
    const livraison = sum > 0 ? 2.99 : 0;
    document.querySelector('.prix-livraison').textContent = livraison > 0 ? `${livraison} €` : `0 €`;

    const total = sum + livraison;
    document.querySelector('.prix-total').textContent = `${total.toFixed(2)} €`;
}

// Afficher le toast d'annulation (compte à rebours 5 secondes)
function showToast() {
    const toast = document.getElementById('toast-container');
    const toastMessage = document.querySelector('.toast-message');
    toast.classList.remove('toast-hidden');

    // Effacer les anciens compteurs s'ils existent (par ex: on clique plusieurs fois)
    if (deleteTimeout) {
        clearTimeout(deleteTimeout);
    }
    if (deleteInterval) {
        clearInterval(deleteInterval);
    }

    let countdown = 5;
    toastMessage.textContent = `Tous les articles seront supprimés dans ${countdown} secondes`;

    // Mettre à jour le texte chaque seconde (5... 4... 3... 2... 1)
    deleteInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            toastMessage.textContent = `Tous les articles seront supprimés dans ${countdown} secondes`;
        } else {
            clearInterval(deleteInterval);
        }
    }, 1000);

    // Supprimer dans tous les cas après 5 secondes
    deleteTimeout = setTimeout(() => {
        suprimeAllProducts(); // Vide la base de données (localStorage)
        toast.classList.add('toast-hidden');
        document.querySelector('.choisir-tous-input input').checked = false;
        renderCart(); // Rafraîchit l'écran avec un panier vide
    }, 5000);

    // Bouton de retour en arrière (undo)
    const undoBtn = document.querySelector('.toast-undo');
    const clone = undoBtn.cloneNode(true);
    undoBtn.parentNode.replaceChild(clone, undoBtn);

    clone.addEventListener('click', () => {
        // L'utilisateur annule la suppression
        clearTimeout(deleteTimeout);
        clearInterval(deleteInterval);
        toast.classList.add('toast-hidden');
    });
}

// Initialisation au chargement de la page
const selectAllCheckbox = document.querySelector('.choisir-tous-input input');
if (selectAllCheckbox) {
    selectAllCheckbox.checked = false; // Par sécurité, décocher le "Choisir tous" par défaut
}
renderCart(); // Premier affichage du panier
initSearch();

