// payment.js

import { refreshCurrentUser, preventHashNavigation } from './login.js';
import { cart, initCart } from '../data/cart.js';
import { fetchAPI } from './api.js';

let products = [];

async function fetchProducts() {
    try {
        const res = await fetchAPI('/products');
        if (res && res.products) {
            products = res.products;
        }
    } catch (err) {
        console.error("Failed to load products in payment.js", err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    preventHashNavigation();
    await refreshCurrentUser();

    // Check Auth
    if (!window.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    await fetchProducts();
    await initCart();

    renderOrderSummary();

    // Setup input formatting
    const cardNum = document.getElementById('card-number');
    if (cardNum) {
        cardNum.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\\D/g, '');
            val = val.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = val;
        });
    }

    const cardExp = document.getElementById('card-expiry');
    if (cardExp) {
        cardExp.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\\D/g, '');
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
        });
    }

    const btnSubmit = document.getElementById('btn-pay-submit');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', async (e) => {
            e.preventDefault();

            btnSubmit.innerHTML = "Traitement en cours...";
            btnSubmit.style.background = "#555";
            btnSubmit.disabled = true;

            try {
                const selectedForPayment = JSON.parse(localStorage.getItem('selectedForPayment') || '[]');
                const body = Array.isArray(selectedForPayment) && selectedForPayment.length > 0 ? { selectedProductIds: selectedForPayment } : {};

                const res = await fetchAPI('/orders/checkout', {
                    method: 'POST',
                    body
                });

                if (res.status === 'success') {
                    if (window.showGlobalToast) window.showGlobalToast("Paiement réussi! Merci pour votre achat.");
                    localStorage.removeItem('selectedForPayment');
                    await initCart();

                    setTimeout(() => {
                        window.location.href = 'account.html'; // Redirect to account to see orders
                    }, 2000);
                }
            } catch (err) {
                if (window.showGlobalToast) window.showGlobalToast("Payment Failed: " + err.message);
                btnSubmit.innerHTML = "Paiement";
                btnSubmit.style.background = "#005bff";
                btnSubmit.disabled = false;
            }
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
        try { selectedIds = JSON.parse(selectedIdsStr); } catch (e) { }
    }

    // Filter cart items to only show selected ones
    let itemsToProcess = cart;
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
        itemsToProcess = cart.filter(item => selectedIds.includes(item.productId));
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
