import { fetchAPI } from './api.js';

export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    let searchTimeout; // For timer

    if (!searchInput || !autocompleteList) return;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        
        // 1. Reset timer in every click 
        clearTimeout(searchTimeout);
        
        if (!val) {
            autocompleteList.innerHTML = '';
            autocompleteList.style.display = 'none';
            return;
        }

        // 2. Make ping 400ms
        searchTimeout = setTimeout(async () => {
            try {
                // The request will be send just only user make a stop when making search 
                const res = await fetchAPI('/products');
                if (res && res.products) {
                    const products = res.products || [];
                    const matches = products.filter(p => 
                        p.name.toLowerCase().includes(val) || 
                        (p.category?.name && p.category.name.toLowerCase().includes(val))
                    );

                    renderAutocomplete(matches, autocompleteList);
                }
            } catch(err) {
                console.error("Search error:", err);
            }
        }, 400); 
    });

    
    function renderAutocomplete(matches, list) {
        list.innerHTML = '';
        if (matches.length > 0) {
            list.style.display = 'block';
            matches.forEach(match => {
                const item = document.createElement('a');
                item.classList.add('autocomplete-item');
                item.href = `product.html?id=${match.id}`;
                item.innerHTML = `
                    <img src="${match.image}" alt="">
                    <span>${match.name}</span>
                `;
                list.appendChild(item);
            });
        } else {
            list.style.display = 'none';
        }
    }

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
            autocompleteList.style.display = 'none';
        }
    });
}