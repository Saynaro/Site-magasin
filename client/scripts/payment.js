// payment.js
import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Simple basic check: If cart empty, maybe alert?
    // Often checkout handles empty cart, but let's just render what we have.
    // If we came from product.html's "Buy Now", it might add to cart first, or we can handle it directly.
    renderOrderSummary();

    // Setup input formatting
    const cardNum = document.getElementById('card-number');
    if (cardNum) {
        cardNum.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            val = val.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = val;
        });
    }

    const cardExp = document.getElementById('card-expiry');
    if (cardExp) {
        cardExp.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
        });
    }

    const btnSubmit = document.getElementById('btn-pay-submit');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
             // Mock payment processing
             btnSubmit.innerHTML = "Traitement en cours...";
             btnSubmit.style.background = "#555";
             setTimeout(() => {
                 if (window.showGlobalToast) window.showGlobalToast("Paiement réussi! Merci pour votre achat.");
                 localStorage.removeItem('cart'); // Clear cart
                 
                 setTimeout(() => {
                     window.location.href = 'index.html'; // Redirect to success page
                 }, 2000);
             }, 1500);
        });
    }
});

function renderOrderSummary() {
    let summaryHTML = '';
    let totalCents = 0;
    let itemsCount = 0;

    let selectedIdsStr = localStorage.getItem('selectedForPayment');
    let selectedIds = null;
    if (selectedIdsStr) {
        try { selectedIds = JSON.parse(selectedIdsStr); } catch(e) {}
    }

    let itemsToProcess = cart;
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
        itemsToProcess = cart.filter(c => selectedIds.includes(c.productId));
    }

    itemsToProcess.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            summaryHTML += `
                <div class="payment-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="payment-item-details">
                        <p class="payment-item-title">${product.name}</p>
                        <p class="payment-item-price">${cartItem.quantity} x €${(product.priceCents / 100).toFixed(2)}</p>
                    </div>
                </div>
            `;
            totalCents += product.priceCents * cartItem.quantity;
            itemsCount += cartItem.quantity;
        }
    });

    const displayContainer = document.getElementById('payment-items-summary');
    if (displayContainer) {
        displayContainer.innerHTML = itemsCount > 0 ? summaryHTML : '<p style="color:#888;">Votre panier est vide.</p>';
    }

    const summaryItemsPrice = document.getElementById('summary-items-price');
    const summaryTotal = document.getElementById('summary-total');
    const summaryDelivery = document.getElementById('summary-delivery');
    const btnPayAmount = document.getElementById('btn-pay-amount');

    if (summaryItemsPrice && summaryTotal) {
        const sum = totalCents / 100;
        summaryItemsPrice.textContent = `${sum.toFixed(2)} €`;
        
        let delivery = sum > 0 ? 2.99 : 0;
        if (summaryDelivery) summaryDelivery.textContent = `${delivery.toFixed(2)} €`;

        const total = sum + delivery;
        summaryTotal.textContent = `${total.toFixed(2)} €`;
        if (btnPayAmount) btnPayAmount.textContent = `${total.toFixed(2)} €`;
    }
}
