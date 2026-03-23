
// in the LocalStorage.getItem below we convert our string to array because we want an array in our cart
// structure localStorage.getItem('name-which-we-gave-like-first-parameter-in-setItem');

export let cart = JSON.parse(localStorage.getItem('cart'));




// if cart is empty we take default products
    
        if(!cart){  
            cart = [{
                productId: '1',
                quantity: 1
            },
            {
                productId: '2',
                quantity: 2
            }];
        }
            



export function addToCart(productId) {

    let matchingItem;

    cart.forEach(cartItem => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            };
    });

    if (matchingItem) {
            matchingItem.quantity += 1;
    } else{
        cart.push({
                    productId: productId,
                    quantity:1
                });

            };

            saveToStorage(); // we saved the storage after adding a product in cart
    
};

export function saveToStorage() {
    // structure of localStorage.setItem('name-what-we-want', our array)
    // localStorage.setItem can save only strings, so we translate our array on string
    // However localStorege.getItem can get only array, so we need to retranslate our string in array, when we use GET, like : JSON.parse()
    localStorage.setItem('cart', JSON.stringify(cart));
}


export function removeFromCart(itemId){
    const newCart = [];


    cart.forEach(cartItem => {
        //if it's not equal we add items in new array
        if (cartItem.productId !== itemId) {     
            newCart.push(cartItem);
        };
    })

    cart = newCart;  // replaced cart with new cart (after deleted peoducts)
    
    saveToStorage(); // we saved the storage our new array
};



export function suprimeAllProducts () {
    cart = [];
    saveToStorage();
}

export function updateQuantityInCart(productId, newQuantity) {
    let matchingItem;
    cart.forEach(cartItem => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        };
    });

    if (matchingItem && newQuantity > 0) {
        matchingItem.quantity = newQuantity;
        saveToStorage();
    } else if (matchingItem && newQuantity <= 0) {
        removeFromCart(productId);
    }
}
