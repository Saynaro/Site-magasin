// account.js

import { cart } from '../data/cart.js'; // To calculate global cart indicator

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html'; // Redirect to home if not logged in
        return;
    }

    // Update cart quantity in header
    let total = 0;
    cart.forEach(c => total += c.quantity);
    const qEl = document.querySelector('.quantity');
    if (qEl) qEl.innerHTML = total;

    // Load Profile
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {
        name: "Saina Rokhalid",
        email: "saina@example.com",
        avatar: "photo/Logo.png"
    };

    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const avatarEl = document.getElementById('user-avatar');

    if(nameEl) nameEl.textContent = profileData.name;
    if(emailEl) emailEl.textContent = profileData.email;
    if(avatarEl) avatarEl.src = profileData.avatar;

    // Handle Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.setItem('isLoggedIn', 'false');
            window.location.href = 'index.html';
        });
    }

    // Handle Avatar Upload
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newAvatar = event.target.result;
                    avatarEl.src = newAvatar;
                    profileData.avatar = newAvatar;
                    localStorage.setItem('userProfile', JSON.stringify(profileData));
                };
                reader.readAsDataURL(file); // Convert image to base64 string
            }
        });
    }
});
