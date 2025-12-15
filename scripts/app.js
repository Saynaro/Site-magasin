import {products} from '../data/products.js';
import {cart} from '../data/cart.js';
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





const buttonAddText = document.querySelector('.button-add-to-cart').textContent;


document.querySelectorAll('.button-add-to-cart')
.forEach(button => {
    
    button.addEventListener('click', () => {
        button.innerText = "Added";
        button.disabled = true;

        setTimeout(() => {
        button.innerHTML = buttonAddText;
        button.disabled = false;
    }, 1000);
    });

    const productId= button.dataset.productId;

    let matchingItem;
    button.addEventListener('click',  () => {
        cart.forEach(cartItem => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            };
        });
        if (matchingItem) {
            matchingItem.quantity += 1;
        } else{
            cart.push(
                    {
                        productId: productId,
                        quantity:1
                    }
                );
            };
            let cartQuantity = 0;

            cart.forEach(cartItem => {
                cartQuantity += cartItem.quantity;

                
            });
            document.querySelector('.quantity').innerHTML = cartQuantity;
    });
    
});



