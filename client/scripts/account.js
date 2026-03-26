// account.js
import { refreshCurrentUser } from './login.js';
import { cart } from '../data/cart.js';
import { fetchAPI } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Wait for auth check from login.js (or re-check here to be sure)
    const isLoggedIn = await refreshCurrentUser();
        if (!isLoggedIn) {
            window.location.href = 'index.html';
            return;
        }

    const { name, surname, email, role, avatar } = window.currentUser;

    // Update cart quantity
    let total = 0;
    cart.forEach(c => total += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = total;

    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl) nameEl.textContent = `${name} ${surname || ''}`;
    if (emailEl) emailEl.textContent = email;
    if (avatarEl) avatarEl.src = avatar || "photo/Logo.png";

    // Handle Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetchAPI('/auth/logout', { method: 'POST' });
                window.currentUser = null;
                localStorage.setItem('isLoggedIn', 'false');
                window.location.href = 'index.html';
            } catch (e) {
                console.error("Logout failed:", e);
                window.location.href = 'index.html';
            }
        });
    }

    // Handle Admin Section
    if (role === 'ADMIN') {
        injectAdminDashboard();
    }
});

async function injectAdminDashboard() {
    const mainContainer = document.querySelector('.account-container') || document.body;

    const adminHTML = `
        <div class="admin-dashboard" style="margin-top: 40px; border-top: 1px solid #333; padding-top: 30px;">
            <h2 style="color: #6ebe70; margin-bottom: 20px;">Panneau d'Administration</h2>
            
            <div class="admin-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <!-- Banners Management -->
                <div class="admin-card" style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd; color: #111;">
                    <h3>Ajouter une Bannière</h3>
                    <form id="admin-banner-form" style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                        <input type="text" id="banner-title" placeholder="Titre (Optionnel)" style="padding: 10px; background: #f9f9f9; border: 1px solid #ddd; color: #111;">
                        <input type="text" id="banner-image" placeholder="URL de l'image" required style="padding: 10px; background: #f9f9f9; border: 1px solid #ddd; color: #111;">
                        <input type="text" id="banner-link" placeholder="Lien de redirection (Optionnel)" style="padding: 10px; background: #f9f9f9; border: 1px solid #ddd; color: #111;">
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="banner-active" checked> Actif
                        </label>
                        <button type="submit" style="padding: 10px; background: #005bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Sauvegarder</button>
                    </form>
                </div>
                
                <!-- Orders Management -->
                <div class="admin-card" style="background: #fff; padding: 20px; border-radius: 8px; grid-column: 1 / -1; border: 1px solid #ddd; color: #111;">
                    <h3>Toutes les Commandes</h3>
                    <div id="admin-orders-list" style="margin-top: 15px; max-height: 400px; overflow-y: auto;">
                        <p>Chargement des commandes...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    mainContainer.insertAdjacentHTML('beforeend', adminHTML);

    // Banner Form Logic
    document.getElementById('admin-banner-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('banner-title').value,
            imageUrl: document.getElementById('banner-image').value,
            linkUrl: document.getElementById('banner-link').value,
            isActive: document.getElementById('banner-active').checked
        };
        try {
            const res = await fetchAPI('/banners', { method: 'POST', body: payload });
            if (res.status === 'success') {
                if (window.showGlobalToast) window.showGlobalToast('Bannière ajoutée avec succès !');
                e.target.reset();
            }
        } catch (err) {
            if (window.showGlobalToast) window.showGlobalToast(`Erreur d'ajout bannière: ${err.message}`);
        }
    });

    // Orders List Logic
    loadAdminOrders();
}

async function loadAdminOrders() {
    const listContainer = document.getElementById('admin-orders-list');
    try {
        const orders = await fetchAPI('/orders/admin/all');
        if (!orders || orders.length === 0) {
            listContainer.innerHTML = '<p>Aucune commande à afficher.</p>';
            return;
        }

        let html = '<table style="width:100%; text-align:left; border-collapse: collapse;">';
        html += `
            <tr style="border-bottom: 1px solid #333;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">Client</th>
                <th style="padding: 10px;">Date</th>
                <th style="padding: 10px;">Total</th>
                <th style="padding: 10px;">Statut</th>
                <th style="padding: 10px;">Action</th>
            </tr>
        `;

        orders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            const total = (order.totalAmount / 100).toFixed(2);

            html += `
                <tr style="border-bottom: 1px solid #222;">
                    <td style="padding: 10px;">${order.id}</td>
                    <td style="padding: 10px;">${order.user.name} <br> <small style="color:#888;">${order.user.email}</small></td>
                    <td style="padding: 10px;">${date}</td>
                    <td style="padding: 10px;">${total} €</td>
                    <td style="padding: 10px;">
                        <select class="admin-status-select" data-order-id="${order.id}" style="padding:5px; background:#f9f9f9; color:#111; border:1px solid #ddd;">
                            <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                            <option value="PAID" ${order.status === 'PAID' ? 'selected' : ''}>PAID</option>
                            <option value="SHIPPED" ${order.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                            <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                            <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                        </select>
                    </td>
                    <td style="padding: 10px;">
                        <button class="admin-save-status-btn" data-order-id="${order.id}" style="padding:5px 10px; background:#6ebe70; color:white; border:none; cursor:pointer; border-radius:4px;">Sauvegarder</button>
                    </td>
                </tr>
            `;
        });
        html += '</table>';
        listContainer.innerHTML = html;

        // Attach save listeners
        document.querySelectorAll('.admin-save-status-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const orderId = btn.dataset.orderId;
                const select = document.querySelector(`.admin-status-select[data-order-id="${orderId}"]`);
                const newStatus = select.value;

                try {
                    const res = await fetchAPI('/orders/admin/status', {
                        method: 'PATCH',
                        body: { orderId: parseInt(orderId), status: newStatus }
                    });
                    if (res.status === 'success') {
                        if (window.showGlobalToast) window.showGlobalToast(`Statut mis à jour : ${newStatus}`);
                    }
                } catch (err) {
                    if (window.showGlobalToast) window.showGlobalToast(`Erreur de MAJ: ${err.message}`);
                }
            });
        });

    } catch (err) {
        listContainer.innerHTML = '<p>Erreur lors du chargement des commandes : ' + err.message + '</p>';
    }
}
