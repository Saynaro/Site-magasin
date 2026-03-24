// login.js

// 1. Inject CSS safely
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './styles/login.css';
document.head.appendChild(link);
document.addEventListener('DOMContentLoaded', () => {
    // Inject global toast
    if (!document.getElementById('global-toast')) {
        const toastHTML = `
            <div id="global-toast" style="position:fixed; bottom:30px; left:50%; transform:translate(-50%, 20px); width:max-content; max-width:90%; background:#111; color:white; padding:15px 25px; border-radius:8px; z-index:9999; box-shadow:0 6px 16px rgba(0,0,0,0.2); transition: opacity 0.3s, transform 0.3s; opacity:0; pointer-events:none; font-family:Arial,sans-serif; text-align:center;">
                <span id="global-toast-msg" style="font-size:14px; font-weight:500; line-height:1.4; display:block;"></span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toastHTML);
    }
    
    window.showGlobalToast = function(message) {
        const toast = document.getElementById('global-toast');
        const msgEl = document.getElementById('global-toast-msg');
        if (!toast || !msgEl) return;
        msgEl.textContent = message;
        toast.style.transform = 'translate(-50%, 0)';
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
        }, 3000);
    };

    // Prevent double modal injection
    if (document.getElementById('login-modal-overlay')) return;

    // 2. Inject HTML Modal
    const modalHTML = `
        <div id="login-modal-overlay" class="login-modal-hidden">
            <div class="login-modal">
                <button class="login-modal-close" style="z-index:10;">✕</button>
                <div class="login-modal-content" id="login-content">
                    <h2>Log in / Inscription</h2>
                    <p class="login-subtitle">We will send a code. No need to answer the call. The code can come by SMS or email.</p>
                    <div class="login-input-group">
                        <select class="country-code">
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+1">🇺🇸 +1</option>
                        </select>
                        <input type="tel" placeholder="0 00 00 00 00" id="login-phone">
                    </div>
                    <button class="login-submit-btn">Continue</button>
                    <div class="login-divider"><span>or</span></div>
                    <button class="login-sso-btn apple">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
                        Log in with Apple
                    </button>
                    <button class="login-sso-btn vk">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                        Log in with Facebook
                    </button>
                    <button class="login-sso-btn email" id="switch-to-register">
                        Login / Sign up by Email
                    </button>
                </div>

                <div class="login-modal-content hidden" id="register-content">
                    <h2>Login / Sign Up via Email</h2>
                    <p class="login-subtitle">Enter your email and password to log in or create a new account.</p>
                    <div class="login-input-group" style="margin-bottom: 10px;">
                        <input type="email" placeholder="Email address" id="register-email">
                    </div>
                    <div class="login-input-group" style="margin-bottom: 20px;">
                        <input type="password" placeholder="Password" id="register-password">
                    </div>
                    <button class="login-submit-btn">Log In / Sign Up</button>
                    <a href="#" class="login-link" id="switch-to-login">Back to phone login</a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. Attach Listeners
    const overlay = document.getElementById('login-modal-overlay');
    window.showLoginModal = function() {
        if (overlay) overlay.classList.remove('login-modal-hidden');
    };
    const closeBtn = document.querySelector('.login-modal-close');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');
    const switchReg = document.getElementById('switch-to-register');
    const switchLog = document.getElementById('switch-to-login');

    // Trigger modal opening when clicking the user icon
    const userIcons = document.querySelectorAll('.lucide-user');
    userIcons.forEach(icon => {
        const userBtn = icon.closest('a');
        if (userBtn) {
            userBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = 'account.html';
                } else {
                    overlay.classList.remove('login-modal-hidden');
                }
            });
        }
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.add('login-modal-hidden');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.add('login-modal-hidden');
    });

    switchReg.addEventListener('click', (e) => {
        e.preventDefault();
        loginContent.classList.add('hidden');
        registerContent.classList.remove('hidden');
    });

    switchLog.addEventListener('click', (e) => {
        e.preventDefault();
        registerContent.classList.add('hidden');
        loginContent.classList.remove('hidden');
    });

    // Handle authentication (Mock)
    const submitBtns = document.querySelectorAll('.login-submit-btn');
    submitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            localStorage.setItem('isLoggedIn', 'true');
            // If first time setting up, initialize userProfile
            if (!localStorage.getItem('userProfile')) {
                localStorage.setItem('userProfile', JSON.stringify({
                    name: "Saina",
                    surname: "Rokhalid",
                    email: "saina@example.com",
                    avatar: "photo/Logo.png" // Default avatar
                }));
            }
            window.location.href = 'account.html';
        });
    });
});
