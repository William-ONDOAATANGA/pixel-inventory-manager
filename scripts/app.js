// --- CONFIGURATION API ---
// ⚠️ Remplace 'TA_CLE_API_ICI' par la vraie clé obtenue sur rawg.io
const RAWG_API_KEY = 'eb913bba43a54fa5b3fd87307730494c'; 

let inventoryData = [];

// --- 1. GESTION DE LA SAUVEGARDE (LocalStorage) ---
function saveInventory() {
    localStorage.setItem('pixelInventoryData', JSON.stringify(inventoryData));
}

function initApp() {
    const savedData = localStorage.getItem('pixelInventoryData');
    if (savedData) {
        inventoryData = JSON.parse(savedData);
        displayProducts(inventoryData);
    } else {
        // Données d'exemple si premier lancement
        inventoryData = [
            { id: 1, type: "jeu", nom: "The Legend of Zelda: Tears of the Kingdom", plateforme: "Nintendo Switch", prix: 59.99, quantite: 15, etat: "Neuf", genre: "Action/Aventure", image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000063714/c42553b4fd0312c31e70ec7468c6c9cb1865ee0d2b54cd0bd1e718f12040d67f" },
            { id: 2, type: "console", nom: "PlayStation 5 Slim", constructeur: "Sony", modele: "Slim", couleur: "Blanc", manettes: 1, prix: 549.99, quantite: 4, image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-disc-console-front-white-15nov23?$1600px$" }
        ];
        saveInventory();
        displayProducts(inventoryData);
    }
}

// --- 2. AFFICHAGE DES PRODUITS ---
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    products.forEach((item) => {
        const card = document.createElement('div');
        card.className = `product-card card-${item.type}`;
        
        const imgSrc = item.image ? item.image : 'https://via.placeholder.com/300x150/1f2833/00f2ff?text=Image+Manquante';

        let metaHtml = '';
        if (item.type === 'jeu') {
            metaHtml = `<p class="meta-info">Plateforme: <strong>${item.plateforme}</strong></p>
                        <p class="meta-info">État: <strong>${item.etat}</strong> | Genre: ${item.genre}</p>`;
        } else if (item.type === 'console') {
            metaHtml = `<p class="meta-info">Marque: <strong>${item.constructeur}</strong> | Modèle: ${item.modele}</p>
                        <p class="meta-info">Couleur: <strong>${item.couleur || 'N/A'}</strong> | Manettes: <strong>${item.manettes || 0}</strong></p>`;
        } else if (item.type === 'accessoire') {
            metaHtml = `<p class="meta-info">Type: <strong>${item.typeAcc}</strong></p>
                        <p class="meta-info">Couleur: <strong>${item.couleur || 'N/A'}</strong></p>`;
        }

        // Ajout du onerror pour ne pas casser le design si l'URL de l'image est morte
        card.innerHTML = `
            <img src="${imgSrc}" class="product-img" alt="${item.nom}" onerror="this.src='https://via.placeholder.com/300x150/1f2833/ff003c?text=Erreur+Image'">
            <h3>${item.nom}</h3>
            ${metaHtml}
            <p class="price">${item.prix.toFixed(2)} €</p>
            
            <div class="stock-controls">
                <button class="stock-btn" onclick="updateStock(${item.id}, -1)">-1</button>
                <div class="stock-display">${item.quantite}</div>
                <button class="stock-btn" onclick="updateStock(${item.id}, 1)">+1</button>
            </div>
            
            <button class="btn-delete" onclick="deleteProduct(${item.id})">Supprimer l'entité</button>
        `;
        container.appendChild(card);
    });
}

// --- 3. GESTION DU STOCK ET CRUD ---
window.updateStock = function(id, change) {
    const product = inventoryData.find(p => p.id === id);
    if (product) {
        product.quantite += change;
        if (product.quantite < 0) product.quantite = 0;
        saveInventory();
        filterInventory(); 
    }
}

window.deleteProduct = function(id) {
    if(confirm("Supprimer définitivement ce produit de la base ?")) {
        inventoryData = inventoryData.filter(p => p.id !== id);
        saveInventory();
        filterInventory();
    }
}

// --- 4. LOGIQUE DU FORMULAIRE DYNAMIQUE ---
document.getElementById('new-type').addEventListener('change', function() {
    const type = this.value;
    const badge = document.querySelector('.ai-badge');
    
    // Bascule de l'affichage des champs
    document.getElementById('fields-jeu').classList.add('hidden');
    document.getElementById('fields-console').classList.add('hidden');
    document.getElementById('fields-accessoire').classList.add('hidden');
    document.getElementById(`fields-${type}`).classList.remove('hidden');

    // Mise à jour du badge IA selon le type
    if (type === 'jeu') {
        badge.textContent = "✨ Auto-fill IA actif";
        badge.style.color = "var(--accent-warning)";
    } else {
        badge.textContent = "⌨️ Saisie manuelle (Matériel)";
        badge.style.color = "#aaaaaa";
    }
});

document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('new-type').value;
    
    let newItem = {
        id: Date.now(),
        type: type,
        nom: document.getElementById('new-nom').value,
        prix: parseFloat(document.getElementById('new-prix').value),
        quantite: parseInt(document.getElementById('new-quantite').value),
        image: document.getElementById('new-image').value
    };

    if (type === 'jeu') {
        newItem.plateforme = document.getElementById('new-plateforme-jeu').value;
        newItem.etat = document.getElementById('new-etat').value;
        newItem.genre = document.getElementById('new-genre').value;
    } else if (type === 'console') {
        newItem.constructeur = document.getElementById('new-constructeur').value;
        newItem.modele = document.getElementById('new-modele').value;
        newItem.couleur = document.getElementById('new-couleur-console').value;
        newItem.manettes = parseInt(document.getElementById('new-manettes').value) || 0;
    } else if (type === 'accessoire') {
        newItem.typeAcc = document.getElementById('new-type-acc').value;
        newItem.couleur = document.getElementById('new-couleur-acc').value;
    }

    inventoryData.push(newItem);
    saveInventory();
    filterInventory();
    
    // Reset complet
    this.reset();
    document.getElementById('new-type').dispatchEvent(new Event('change')); // Remet le bon badge IA
    alert("Produit ajouté avec succès et sauvegardé !");
});

// --- 5. FILTRES AVANCÉS ---
document.getElementById('search-bar').addEventListener('input', filterInventory);
document.getElementById('filter-type').addEventListener('change', function() {
    const etatFilter = document.getElementById('filter-etat');
    if(this.value === 'jeu') {
        etatFilter.classList.remove('hidden');
    } else {
        etatFilter.classList.add('hidden');
        etatFilter.value = 'all';
    }
    filterInventory();
});
document.getElementById('filter-etat').addEventListener('change', filterInventory);
document.getElementById('sort-price').addEventListener('change', filterInventory);

function filterInventory() {
    const search = document.getElementById('search-bar').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const etat = document.getElementById('filter-etat').value;
    const sort = document.getElementById('sort-price').value;

    let filtered = inventoryData.filter(item => {
        const matchSearch = item.nom.toLowerCase().includes(search);
        const matchType = type === 'all' || item.type === type;
        const matchEtat = etat === 'all' || item.etat === etat;
        return matchSearch && matchType && (item.type !== 'jeu' || matchEtat);
    });

    if (sort === 'asc') filtered.sort((a, b) => a.prix - b.prix);
    if (sort === 'desc') filtered.sort((a, b) => b.prix - a.prix);

    displayProducts(filtered);
}

// --- 6. API RAWG (Jeux Uniquement) ---
document.getElementById('new-nom').addEventListener('blur', async function() {
    const query = this.value.trim();
    const currentType = document.getElementById('new-type').value; 
    const badge = document.querySelector('.ai-badge');

    if (!query || currentType !== 'jeu') return;

    badge.textContent = "⏳ Recherche dans la base mondiale...";
    badge.style.color = "#00f2ff"; 

    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${query}&key=${RAWG_API_KEY}&page_size=1`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const game = data.results[0];
            
            if (game.background_image) {
                document.getElementById('new-image').value = game.background_image;
            }
            document.getElementById('new-nom').value = game.name;

            badge.textContent = "✅ Jeu reconnu et importé !";
            badge.style.color = "#39ff14"; 
        } else {
            badge.textContent = "❌ Jeu inconnu, saisie manuelle.";
            badge.style.color = "#ff003c"; 
        }
    } catch (error) {
        console.error("Erreur API :", error);
        badge.textContent = "⚠️ Erreur réseau";
        badge.style.color = "#ffaa00"; 
    }
});

// Lancement au démarrage
initApp();