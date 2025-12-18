import {products} from '../data/products.js';
import {cart, addToCart} from '../data/cart.js';
let productHTML = '';

products.forEach(product => {
    productHTML += `
    <div class="item">
        <a href="#" class = "items-title">
            <img src="${product.image}" alt="error">
            <h3>${product.name}</h3>
        </a>
            <p>€${(product.priceCents / 100).toFixed(2)}</p>
            <button class="button-add-to-cart"
            data-product-id = "${product.id}">Add to cart</button>
    </div>
`;
document.querySelector('.items')
.innerHTML = productHTML;
});






function updateQuantity() {
            let cartQuantity = 0;

            cart.forEach(cartItem => {
                cartQuantity += cartItem.quantity;

                
            });
            document.querySelector('.quantity').innerHTML = cartQuantity;
}
updateQuantity();

const buttonAddText = document.querySelector('.button-add-to-cart').textContent;

function changeButtonAddText(button) {
    button.innerText = "Added";
        button.disabled = true;

        setTimeout(() => {
        button.innerHTML = buttonAddText;
        button.disabled = false;
    }, 1000);  
}


document.querySelectorAll('.button-add-to-cart')
.forEach(button => {
    
    button.addEventListener('click', () => {

        const productId= button.dataset.productId;

        addToCart(productId);
        updateQuantity();
        changeButtonAddText(button);
    
    });
});
    




