// security.js
import { cart } from '../data/cart.js'; // To calculate global cart indicator

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Update cart quantity
    let cartTotal = 0;
    cart.forEach(c => cartTotal += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = cartTotal;

    let profileData = JSON.parse(localStorage.getItem('userProfile')) || {
        name: "Saina Rokhalid",
        email: "saina@example.com",
        avatar: "photo/Logo.png"
    };

    const dispName = document.getElementById('display-name');
    const dispEmail = document.getElementById('display-email');
    const inpName = document.getElementById('input-name');
    const inpEmail = document.getElementById('input-email');

    function renderUI() {
        dispName.textContent = profileData.name;
        dispEmail.textContent = profileData.email;
        inpName.value = profileData.name;
        inpEmail.value = profileData.email;
    }

    renderUI();

    document.getElementById('save-name').addEventListener('click', () => {
        if (inpName.value.trim() !== '') {
            profileData.name = inpName.value.trim();
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            renderUI();
            document.getElementById('edit-name').style.display = 'none';
        }
    });

    document.getElementById('save-email').addEventListener('click', () => {
        if (inpEmail.value.trim() !== '' && inpEmail.value.includes('@')) {
            profileData.email = inpEmail.value.trim();
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            renderUI();
            document.getElementById('edit-email').style.display = 'none';
        } else {
            if (window.showGlobalToast) window.showGlobalToast('Veuillez entrer une adresse email valide.');
        }
    });
});
