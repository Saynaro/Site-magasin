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





// POUR CHERCHER DANS LA BASE DE DONNEES
/* // Убираем импорт локального массива, теперь данные в БД
// import { products } from '../data/products.js'; 

export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const autocompleteList = document.getElementById('autocomplete-list');
    
    if (!searchInput || !autocompleteList) return;

    searchInput.addEventListener('input', async (e) => {
        const val = e.target.value.trim();
        autocompleteList.innerHTML = '';
        
        if (val.length < 2) { // Не ищем, если введено меньше 2 символов
            autocompleteList.style.display = 'none';
            return;
        }

        try {
            // Делаем запрос к твоему бэкенду!
            // Используем параметр search (который мы обсуждали ранее)
            const response = await fetch(`/products?search=${encodeURIComponent(val)}&limit=5`);
            const data = await response.json();
            const matches = data.products; // Твой бэкенд возвращает объект { products: [...] }

            if (matches && matches.length > 0) {
                autocompleteList.style.display = 'block';
                matches.forEach(match => {
                    const item = document.createElement('a');
                    item.classList.add('autocomplete-item');
                    // У тебя в БД используется slug или id (cuid)
                    item.href = `product.html?slug=${match.slug}`; 
                    item.innerHTML = `
                        <img src="${match.image}" alt="">
                        <div>
                            <span>${match.name}</span>
                            <small>${match.priceCents / 100} $</small>
                        </div>
                    `;
                    autocompleteList.appendChild(item);
                });
            } else {
                autocompleteList.style.display = 'none';
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    });

    // ... логика закрытия кликом вне списка остается прежней
} */