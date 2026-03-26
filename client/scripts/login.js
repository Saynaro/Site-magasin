import { fetchAPI } from './api.js';

// Inject CSS safely
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

    window.showGlobalToast = function (message) {
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

    // Eye icon SVG
    const eyeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>`;

    const eyeOffIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off">
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
            <path d="m2 2 20 20"/>
        </svg>`;

    // Inject HTML Modal
    const modalHTML = `
        <div id="login-modal-overlay" class="login-modal-hidden">
            <div class="login-modal">
                <button class="login-modal-close" style="z-index:10;">✕</button>
                
                <!-- LOGIN FORM -->
                <div class="login-modal-content" id="login-content">
                    <h2>Log In</h2>
                    <p class="login-subtitle">Enter your email and password to access your account.</p>
                    <form id="login-form">
                        <div class="login-input-group" style="margin-bottom: 15px;">
                            <input type="email" placeholder="Email address" id="login-email" required>
                        </div>
                        <div class="login-input-group" style="margin-bottom: 20px; position: relative;">
                            <input type="password" placeholder="Password" id="login-password" required style="padding-right: 40px; width: 100%;">
                            <span class="password-toggle" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #888;">
                                ${eyeIcon}
                            </span>
                        </div>
                        <button type="submit" class="login-submit-btn">Log In</button>
                    </form>
                    <div class="login-divider"><span>or</span></div>
                    <button class="login-sso-btn email" id="switch-to-register">
                        Create an Account
                    </button>
                </div>

                <!-- REGISTER FORM -->
                <div class="login-modal-content hidden" id="register-content">
                    <h2>Sign Up</h2>
                    <p class="login-subtitle">Create a new account.</p>
                    <form id="register-form">
                        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <div class="login-input-group">
                                <input type="text" placeholder="First Name" id="register-name" required>
                            </div>
                            <div class="login-input-group">
                                <input type="text" placeholder="Last Name" id="register-surname" required>
                            </div>
                        </div>
                        <div class="login-input-group" style="margin-bottom: 15px;">
                            <input type="email" placeholder="Email address" id="register-email" required>
                        </div>
                        <div class="login-input-group" style="margin-bottom: 20px; position: relative;">
                            <input type="password" placeholder="Password" id="register-password" required style="padding-right: 40px; width: 100%;">
                            <span class="password-toggle" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #888;">
                                ${eyeIcon}
                            </span>
                        </div>
                        <button type="submit" class="login-submit-btn">Sign Up</button>
                    </form>
                    <a href="#" class="login-link" id="switch-to-login">Already have an account? Log In</a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. Attach Listeners
    const overlay = document.getElementById('login-modal-overlay');
    window.showLoginModal = function () {
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
            userBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (window.currentUser) {
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

    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(toggleBtn => {
        toggleBtn.addEventListener('click', () => {
            const input = toggleBtn.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.innerHTML = eyeOffIcon;
            } else {
                input.type = 'password';
                toggleBtn.innerHTML = eyeIcon;
            }
        });
    });

    // Password Validation Helper
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    };

    // Form Submissions
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetchAPI('/auth/login', {
                method: 'POST',
                body: { email, password }
            });

            if (res.status === 'success') {
                window.currentUser = res.data.user; 
                localStorage.setItem('isLoggedIn', 'true');
                window.location.reload();
            }
        } catch (error) {
            window.showGlobalToast("Login failed: " + error.message);
        }
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const surname = document.getElementById('register-surname').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (!validatePassword(password)) {
            window.showGlobalToast("Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, and 1 number.");
            return;
        }

        try {
            const res = await fetchAPI('/auth/register', {
                method: 'POST',
                body: { name, surname, email, password }
            });

            if (res.status === 'success') {
                window.currentUser = res.data.user;
                localStorage.setItem('isLoggedIn', 'true');
                window.showGlobalToast("Account created successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            window.showGlobalToast("Registration failed: " + error.message);
        }
    });

    // // Auto-check auth on load to set up window.currentUser globally
    // (async () => {
    //     await refreshCurrentUser();
    // })();
});




export async function refreshCurrentUser() {
    
    try {
        const res = await fetchAPI('/auth/me');
        if (res?.data?.user) {
            window.currentUser = res.data.user;
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
    } catch (err) {
        // Silent fail sets as guest
    }

    window.currentUser = null;
    localStorage.removeItem('isLoggedIn');
    return false;
}

export function preventHashNavigation() {
    document.querySelectorAll('a[href="#"]').forEach(a => {
        a.addEventListener('click', (e) => e.preventDefault());
    });
}
