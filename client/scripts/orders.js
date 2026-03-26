// orders.js

import { refreshCurrentUser, preventHashNavigation } from './login.js';
import { fetchAPI } from './api.js';

function formatDate(isoDate) {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

function mapStatus(status) {
    switch (status) {
        case 'PAID': return { label: 'Commandé', code: 1 };
        case 'SHIPPED': return { label: 'En cours de livraison', code: 2 };
        case 'DELIVERED': return { label: 'Livré', code: 3 };
        case 'CANCELLED': return { label: 'Annulé', code: 4 };
        default: return { label: 'En attente', code: 0 };
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    preventHashNavigation();
    await refreshCurrentUser();
    if (!window.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const listContainer = document.getElementById('orders-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<p>Chargement de vos commandes...</p>';

    try {
        const res = await fetchAPI('/orders/my');
        const orders = res || [];

        if (orders.length === 0) {
            listContainer.innerHTML = `<p>Vous n'avez passé aucune commande pour le moment.</p>`;
            return;
        }

        let html = '';
        orders.forEach(order => {
            const statusInfo = mapStatus(order.status);
            const isDelivered = statusInfo.code === 3;

            let imagesHTML = '';
            (order.items || []).forEach(item => {
                if (item.product) {
                    imagesHTML += `<img src="${item.product.image}" alt="${item.product.name}" title="${item.product.name}">`;
                }
            });

            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-meta">
                            <div class="meta-group">
                                <p>Commande effectuée le</p>
                                <strong>${formatDate(order.created_at)}</strong>
                            </div>
                            <div class="meta-group">
                                <p>Total</p>
                                <strong>${(order.totalAmount / 100).toFixed(2)} €</strong>
                            </div>
                            <div class="meta-group">
                                <p>Livraison à</p>
                                <strong>${window.currentUser?.name || "Vous"}</strong>
                            </div>
                        </div>
                        <div class="order-id">
                            N° de commande <br>
                            <span>${order.id}</span>
                        </div>
                    </div>
                    <div class="order-body">
                        <div class="order-content-left">
                            <h3 class="order-status ${isDelivered ? 'delivered' : ''}">${statusInfo.label}</h3>
                            <div class="order-items-preview">
                                ${imagesHTML}
                            </div>
                        </div>
                        <a href="track_order.html?id=${order.id}" class="btn-track">Suivre le colis</a>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = html;
    } catch (err) {
        console.error("Orders fetch failed:", err);
        listContainer.innerHTML = '<p>Erreur lors du chargement des commandes. Veuillez réessayer.</p>';
    }
});
