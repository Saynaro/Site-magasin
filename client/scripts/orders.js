// orders.js
import { cart } from '../data/cart.js'; // to get cart quantity

// Global Mock Orders Data (Used by both orders.js and track_order.js)
export const mockOrders = [
    {
        id: "193-4920194-209341",
        date: "20 Février 2026",
        total: 154.99,
        status: "Livré",
        statusCode: 3, // 0: Commandé, 1: Expédié, 2: En transit, 3: Livré
        items: [
            { image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=200", name: "Apple Watch Series 9" }
        ],
        address: "123 Rue de la Paix, 75000 Paris, France"
    },
    {
        id: "204-9840291-827364",
        date: "22 Mars 2026",
        total: 89.00,
        status: "En cours de livraison",
        statusCode: 2,
        items: [
            { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200", name: "Assortiment Gourmand" },
            { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200", name: "Casque Audio Premium" }
        ],
        address: "123 Rue de la Paix, 75000 Paris, France"
    },
    {
        id: "311-5345621-998822",
        date: "24 Mars 2026",
        total: 25.50,
        status: "Commandé",
        statusCode: 0,
        items: [
            { image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=200", name: "T-shirt Noir Basique" }
        ],
        address: "123 Rue de la Paix, 75000 Paris, France"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Ensure user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Update cart quantity in header
    let cartTotal = 0;
    cart.forEach(c => cartTotal += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartTotal;

    const listContainer = document.getElementById('orders-list');
    if (!listContainer) return;

    if (mockOrders.length === 0) {
        listContainer.innerHTML = '<p>Vous n\'avez passé aucune commande pour le moment.</p>';
        return;
    }

    let html = '';
    mockOrders.forEach(order => {
        const isDelivered = order.statusCode === 3;
        
        let imagesHTML = '';
        order.items.forEach(item => {
            imagesHTML += `<img src="${item.image}" alt="${item.name}" title="${item.name}">`;
        });

        html += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-meta">
                        <div class="meta-group">
                            <p>Commande effectuée le</p>
                            <strong>${order.date}</strong>
                        </div>
                        <div class="meta-group">
                            <p>Total</p>
                            <strong>${order.total.toFixed(2)} €</strong>
                        </div>
                        <div class="meta-group">
                            <p>Livraison à</p>
                            <strong>Saina Rokhalid</strong>
                        </div>
                    </div>
                    <div class="order-id">
                        N° de commande <br>
                        <span>${order.id}</span>
                    </div>
                </div>
                <div class="order-body">
                    <div class="order-content-left">
                        <h3 class="order-status ${isDelivered ? 'delivered' : ''}">${order.status}</h3>
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
});
