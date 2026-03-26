import { fetchAPI } from '../scripts/api.js';

export let cart = [];

// Fetch the user's cart from the database
export async function initCart() {

    console.trace('initCart called');
    cart.length = 0;
    try {
        const res = await fetchAPI('/cart');
        if (res.status === 'success') {
            const newItems = res.data.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                variant: item.variant,
                priceCents: item.product?.priceCents,
                image: item.product?.image,
                name: item.product?.name
            }));
            cart.push(...newItems);
        }
    } catch (err) {
        console.error("Failed to load cart from DB", err);
    }
    return cart;
}

export async function addToCart(productId, quantity = 1, variant = null) {
    if (!window.currentUser && localStorage.getItem('isLoggedIn') !== 'true') return;
    try {
        await fetchAPI('/cart/add', {
            method: 'POST',
            body: { productId, quantity, variant }
        });
        await initCart();
    } catch (err) {
        console.error("Add to cart error:", err);
    }
}

export async function updateQuantityInCart(productId, newQuantity) {
    if (!window.currentUser && localStorage.getItem('isLoggedIn') !== 'true') return;
    
    if (newQuantity <= 0) {
        return removeFromCart(productId);
    }

    try {
        await fetchAPI('/cart/update', {
            method: 'PATCH',
            body: { productId, quantity: newQuantity }
        });
        await initCart();
    } catch(err) {
        console.error("Update quantity error:", err);
    }
}

export async function removeFromCart(productId) {
    if (!window.currentUser && localStorage.getItem('isLoggedIn') !== 'true') return;

    try {
        await fetchAPI('/cart/remove', {
            method: 'DELETE',
            body: { productId }
        });
        await initCart();
    } catch(err) {
        console.error("Remove from cart error:", err);
    }
}

export async function suprimeAllProducts() {
    // Currently no drop-all endpoint exist, so we delete individually
    if (!window.currentUser && localStorage.getItem('isLoggedIn') !== 'true') return;
    try {
        for (const item of cart) {
            await fetchAPI('/cart/remove', {
                method: 'DELETE',
                body: { productId: item.productId }
            });
        }
        await initCart();
    } catch(err) {
        console.error("Wipe cart error:", err);
    }
}

// Removed automatic top-level call to avoid redundant requests across multiple script imports.
// Pages should call initCart() explicitly in their DOMContentLoaded listeners.
// initCart();
