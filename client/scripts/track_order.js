// track_order.js
import { refreshCurrentUser, preventHashNavigation } from './login.js';
import { cart, initCart } from '../data/cart.js';
import { fetchAPI } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    preventHashNavigation();
    await refreshCurrentUser();
    if (!window.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    await initCart();

    // Update cart quantity in header
    let cartTotal = 0;
    cart.forEach(c => cartTotal += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartTotal;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        document.getElementById('error-container').style.display = 'block';
        return;
    }

    try {
        const res = await fetchAPI('/orders/my');
        const orders = res || [];
        const order = orders.find(o => String(o.id) === String(orderId));

        if (!order) {
            document.getElementById('error-container').style.display = 'block';
            return;
        }

        document.getElementById('track-container').style.display = 'block';
        document.getElementById('order-id').textContent = order.id;

        // Status code mapping
        const statusMap = {
            'PENDING': { label: 'En attente', code: 0 },
            'PAID': { label: 'Commandé', code: 1 },
            'SHIPPED': { label: 'Expédié', code: 2 },
            'DELIVERED': { label: 'Livré', code: 3 },
            'CANCELLED': { label: 'Annulé', code: 4 }
        };

        const statusInfo = statusMap[order.status] || statusMap['PENDING'];

        // Status color
        const statusEl = document.getElementById('delivery-status');
        statusEl.textContent = statusInfo.label;
        if (statusInfo.code < 3) {
            statusEl.style.color = '#005bff'; // Blue if not fully delivered
        } else if (statusInfo.code === 4) {
            statusEl.style.color = 'red';
        }

        document.getElementById('delivery-address').textContent = window.currentUser?.name || "Votre adresse";

        // Timeline Setup
        const steps = ["Commandé", "Expédié", "En livraison", "Livré"];
        let pointsHTML = '';

        // Let's assume PENDING=0, PAID=1, SHIPPED=2, DELIVERED=3. 
        // If cancelled, timeline might be broken, but let's map it smoothly.
        let timelineCode = statusInfo.code;
        if (timelineCode === 0) timelineCode = 0; // PENDING -> Commandé (0)
        else if (timelineCode === 1) timelineCode = 1; // PAID -> Commandé / Expédié bridge (1)
        else if (timelineCode === 2) timelineCode = 2; // SHIPPED -> En livraison (2)
        else if (timelineCode === 3) timelineCode = 3; // DELIVERED -> Livré (3)
        else if (timelineCode >= 4) timelineCode = 0; // CANCELLED

        steps.forEach((step, index) => {
            let cls = '';
            if (index < timelineCode) cls = 'done';
            else if (index === timelineCode) cls = 'active';

            // Ensure final step acts properly for UI
            if (index === 3 && timelineCode === 3) cls = 'done';

            pointsHTML += `
                <div class="point ${cls}">
                    <div class="circle"></div>
                    <div class="label">${step}</div>
                </div>
            `;
        });

        const statusPoints = document.getElementById('status-points');
        if (statusPoints) statusPoints.innerHTML = pointsHTML;

        // Progress width: index ranges 0 to 3. So intervals are 0%, 33%, 66%, 100%.
        const progressWidth = (timelineCode / (steps.length - 1)) * 100;

        setTimeout(() => {
            const tlProgress = document.getElementById('timeline-progress');
            if (tlProgress) tlProgress.style.width = `${progressWidth}%`;
        }, 100);

        // Items renderer
        let itemsHTML = '';
        (order.items || []).forEach(item => {
            if (item.product) {
                itemsHTML += `
                    <div class="delivery-item">
                        <img src="${item.product.image}" alt="${item.product.name}">
                        <div class="delivery-item-name">${item.product.name}</div>
                    </div>
                `;
            }
        });
        const orderItemsContainer = document.getElementById('ordered-items');
        if (orderItemsContainer) orderItemsContainer.innerHTML = itemsHTML;

    } catch (err) {
        console.error("Fetch tracking order failed", err);
        document.getElementById('error-container').style.display = 'block';
    }
});
