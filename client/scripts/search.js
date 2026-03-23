import { products } from '../data/products.js';

export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    
    if (!searchInput || !autocompleteList) return;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        autocompleteList.innerHTML = '';
        
        if (!val) {
            autocompleteList.style.display = 'none';
            return;
        }

        const matches = products.filter(p => 
            p.name.toLowerCase().includes(val) || 
            p.category.toLowerCase().includes(val)
        );

        if (matches.length > 0) {
            autocompleteList.style.display = 'block';
            matches.forEach(match => {
                const item = document.createElement('a');
                item.classList.add('autocomplete-item');
                item.href = `product.html?id=${match.id}`;
                item.innerHTML = `
                    <img src="${match.image}" alt="">
                    <span>${match.name}</span>
                `;
                autocompleteList.appendChild(item);
            });
        } else {
            autocompleteList.style.display = 'none';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
            autocompleteList.style.display = 'none';
        }
    });
}
