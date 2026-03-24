// track_order.js
import { mockOrders } from './orders.js';
import { cart } from '../data/cart.js'; // To calculate global cart indicator

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Update cart quantity in header
    let cartTotal = 0;
    cart.forEach(c => cartTotal += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartTotal;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    const order = mockOrders.find(o => o.id === orderId);

    if (!order) {
        document.getElementById('error-container').style.display = 'block';
        return;
    }

    document.getElementById('track-container').style.display = 'block';
    document.getElementById('order-id').textContent = order.id;
    
    // Status color
    const statusEl = document.getElementById('delivery-status');
    statusEl.textContent = order.status;
    if (order.statusCode < 3) {
        statusEl.style.color = '#005bff'; // Blue if not fully delivered
    }

    document.getElementById('delivery-address').textContent = order.address;

    // Timeline Setup
    const steps = ["Commandé", "Expédié", "En livraison", "Livré"];
    let pointsHTML = '';
    
    steps.forEach((step, index) => {
        let cls = '';
        if (index < order.statusCode) cls = 'done';
        else if (index === order.statusCode) cls = 'active';
        
        // Ensure final step acts properly for UI
        if (index === 3 && order.statusCode === 3) cls = 'done';
        
        pointsHTML += `
            <div class="point ${cls}">
                <div class="circle"></div>
                <div class="label">${step}</div>
            </div>
        `;
    });
    
    document.getElementById('status-points').innerHTML = pointsHTML;
    
    // Progress width: index ranges 0 to 3. So intervals are 0%, 33%, 66%, 100%.
    const progressWidth = (order.statusCode / (steps.length - 1)) * 100;
    // Animate width after a tiny timeout so it glides from 0 instead of popping instantly.
    setTimeout(() => {
        document.getElementById('timeline-progress').style.width = `${progressWidth}%`;
    }, 100);

    // Items renderer
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="delivery-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="delivery-item-name">${item.name}</div>
            </div>
        `;
    });
    document.getElementById('ordered-items').innerHTML = itemsHTML;
});
