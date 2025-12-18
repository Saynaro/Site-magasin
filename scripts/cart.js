import { cart, removeFromCart, suprimeAllProducts } from '../data/cart.js';
import {products} from '../data/products.js';








const allProductsQuantity = document.querySelector('.quantity');


function updateQuantity() {
            let cartQuantity = 0;

            cart.forEach(cartItem => {
                cartQuantity += cartItem.quantity;

                
            });
            allProductsQuantity.innerHTML = cartQuantity;
            document.querySelector('.quantity-items').innerHTML = `${cartQuantity} items`;
            document.querySelector('.items-total').innerHTML = `Items (${cartQuantity})`;
            
            
        };

updateQuantity();


let cartHTML ='';

cart.forEach(cartItem => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach(product => {
        if (product.id  === productId) {
            matchingProduct = product;
            
        }
        
    });
    
    


    cartHTML += // below i created a special class for each container with their current id
    //that's useful when i want to delete a product from my cart.
    //  For choose in DOM exact a container which i need to delete.
    // and delete it from my cart page
    `           
        <div class="item item-container-${matchingProduct.id}">
            <div class="image-column">
                <input type="checkbox" class="item-checkbox">
                <img src="${matchingProduct.image}">
            </div>
            <div class="item-title-column">
                <p class="title">${matchingProduct.name}</p>
                <div class="item-title-column-icons">
                    <button class="icon-button delete-item-button" data-product-id="${matchingProduct.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <button class="icon-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                    </button>
                </div>
            </div>

            <div class="price-column">
                <p class="prix product-prix">${(matchingProduct.priceCents / 100).toFixed(2)} €</p>
            </div>
            <div class="input-column">
                <button class="quantity-button" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
                <span class="quantityItem">${cartItem.quantity}</span>
                <button class="quantity-button" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
                </button>
            </div>
        </div>
    `
});

document.querySelector('.items').innerHTML = cartHTML;
document.querySelectorAll('.delete-item-button')
.forEach(btn => {
    
    btn.addEventListener('click', () => {
        // pour creer un id pour chaque button, pour savoir lequel exactement on veux changer
        // la structure: "name" of the foreach parameter, dataset, and "name" of the data-atribute en html en camelCase always
        // "name-foreach-parameter".dataset."name-data-atribute"

        const itemId = btn.dataset.productId;
        
        removeFromCart(itemId); // function from data/cart.js
        

        const container = document.querySelector(`.item-container-${itemId}`); // choose itemId not matchingProduct.id like in html, because we want to delete the item which one we clicked
        container.remove(); // 'remove()' included js function for delete an html object from page

        updateQuantity();
    });
});


// marche pas 
const allProducts = document.querySelectorAll('.item');
document.querySelector('.button-delete-all')
.addEventListener('click', () =>{
    suprimeAllProducts();

});
// fin de fonction




// faire numeros en html changeable
const eachElementPrix = document.querySelectorAll('.product-prix');
let sum = 0;

eachElementPrix.forEach(el =>{
    let text = el.textContent;
    
    let prix = parseFloat(text.replace(",", ".").replace(/[^\d.]/g,""));


    if (!isNaN(prix)) {
    sum += prix;
    
    }
    
});
document.querySelector('.items-prix').textContent = sum.toFixed(2);


// let livraison = 2.99;
// let total = sum + livraison;

// document.querySelector('.prix-total').innerHTML = total.toFixed(2);
