import { refreshCurrentUser } from './login.js';
import { cart, initCart } from '../data/cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    // take user first
    const isLoggedIn = await refreshCurrentUser();

    if (!isLoggedIn) {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'index.html';
        return;
    }

    await initCart();

    // Update cart quantity
    let cartTotal = 0;
    cart.forEach(c => cartTotal += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartTotal;

    function renderUI() {
        const dispName = document.getElementById('display-name');
        const dispEmail = document.getElementById('display-email');
        const inpName = document.getElementById('input-name');
        const inpEmail = document.getElementById('input-email');

        if (dispName) dispName.textContent = window.currentUser.name;
        if (dispEmail) dispEmail.textContent = window.currentUser.email;
        if (inpName) inpName.value = window.currentUser.name;
        if (inpEmail) inpEmail.value = window.currentUser.email;
    }

    renderUI();

    document.getElementById('save-name').addEventListener('click', async () => {
        const inpName = document.getElementById('input-name');
        const newName = inpName.value.trim();
        if (newName !== '') {
            try {
                const { fetchAPI } = await import('./api.js');
                const res = await fetchAPI('/auth/update', {
                    method: 'PATCH',
                    body: { name: newName, email: window.currentUser.email }
                });
                if (res.status === 'success') {
                    window.currentUser = res.data.user;
                    renderUI();
                    document.getElementById('edit-name').style.display = 'none';
                    if (window.showGlobalToast) window.showGlobalToast('Nom mis à jour !');
                }
            } catch (err) {
                if (window.showGlobalToast) window.showGlobalToast('Erreur: ' + err.message);
            }
        }
    });

    document.getElementById('save-email').addEventListener('click', async () => {
        const inpEmail = document.getElementById('input-email');
        const newEmail = inpEmail.value.trim();
        if (newEmail !== '' && newEmail.includes('@')) {
            try {
                const { fetchAPI } = await import('./api.js');
                const res = await fetchAPI('/auth/update', {
                    method: 'PATCH',
                    body: { name: window.currentUser.name, email: newEmail }
                });
                if (res.status === 'success') {
                    window.currentUser = res.data.user;
                    renderUI();
                    document.getElementById('edit-email').style.display = 'none';
                    if (window.showGlobalToast) window.showGlobalToast('Email mis à jour !');
                }
            } catch (err) {
                if (window.showGlobalToast) window.showGlobalToast('Erreur: ' + err.message);
            }
        } else {
            if (window.showGlobalToast) window.showGlobalToast('Veuillez entrer une adresse email valide.');
        }
    });
});