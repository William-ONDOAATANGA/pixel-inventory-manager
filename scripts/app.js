// Base de données simulée (Tu pourras la lier à ton JSON plus tard)
let inventoryData = [
    { id: 1, type: "jeu", nom: "The Legend of Zelda: Tears of the Kingdom", plateforme: "Nintendo Switch", prix: 59.99, quantite: 15, etat: "Neuf", genre: "Action/Aventure", image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000063714/c42553b4fd0312c31e70ec7468c6c9cb1865ee0d2b54cd0bd1e718f12040d67f" },
    { id: 2, type: "console", nom: "PlayStation 5 Slim", constructeur: "Sony", modele: "Slim", prix: 549.99, quantite: 4, image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-disc-console-front-white-15nov23?$1600px$" },
    { id: 3, type: "accessoire", nom: "Manette Xbox Carbon Black", typeAcc: "Manette", prix: 59.99, quantite: 8, image: "https://compass-ssl.xbox.com/assets/2f/6d/2f6d5fb9-8b01-449e-b9b0-9ba24e39ec2f.jpg?n=111101_Gallery-0_1_1350x1013.jpg" }
];

// --- 1. AFFICHAGE DES PRODUITS ---
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    products.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `product-card card-${item.type}`;
        
        // Image par défaut si vide
        const imgSrc = item.image ? item.image : 'https://via.placeholder.com/300x150/1f2833/00f2ff?text=No+Image';

        // Construction des infos spécifiques selon le type
        let metaHtml = '';
        if (item.type === 'jeu') {
            metaHtml = `<p class="meta-info">Plateforme: <strong>${item.plateforme}</strong></p>
                        <p class="meta-info">État: <strong>${item.etat}</strong> | Genre: ${item.genre}</p>`;
        } else if (item.type === 'console') {
            metaHtml = `<p class="meta-info">Marque: <strong>${item.constructeur}</strong></p>
                        <p class="meta-info">Modèle: <strong>${item.modele}</strong></p>`;
        } else if (item.type === 'accessoire') {
            metaHtml = `<p class="meta-info">Type: <strong>${item.typeAcc}</strong></p>`;
        }

        card.innerHTML = `
            <img src="${imgSrc}" class="product-img" alt="${item.nom}">
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

// --- 2. GESTION DU STOCK ET CRUD ---
function updateStock(id, change) {
    const product = inventoryData.find(p => p.id === id);
    if (product) {
        product.quantite += change;
        if (product.quantite < 0) product.quantite = 0;
        filterInventory(); // Rafraîchit l'affichage avec les filtres actuels
    }
}

function deleteProduct(id) {
    if(confirm("Supprimer définitivement ce produit de la base ?")) {
        inventoryData = inventoryData.filter(p => p.id !== id);
        filterInventory();
    }
}

// --- 3. LOGIQUE DU FORMULAIRE DYNAMIQUE ---
document.getElementById('new-type').addEventListener('change', function() {
    const type = this.value;
    document.getElementById('fields-jeu').classList.add('hidden');
    document.getElementById('fields-console').classList.add('hidden');
    document.getElementById('fields-accessoire').classList.add('hidden');
    document.getElementById(`fields-${type}`).classList.remove('hidden');
});

// Enregistrement final
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
    } else if (type === 'accessoire') {
        newItem.typeAcc = document.getElementById('new-type-acc').value;
    }

    inventoryData.push(newItem);
    filterInventory();
    this.reset();
    alert("Produit ajouté au stock !");
});

// --- 4. FILTRES AVANCÉS ---
document.getElementById('search-bar').addEventListener('input', filterInventory);
document.getElementById('filter-type').addEventListener('change', function() {
    // Affiche le sous-filtre "Etat" uniquement si "Jeu" est sélectionné
    const etatFilter = document.getElementById('filter-etat');
    if(this.value === 'jeu') {
        etatFilter.classList.remove('hidden');
    } else {
        etatFilter.classList.add('hidden');
        etatFilter.value = 'all'; // Reset
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

// --- 5. SIMULATEUR D'IA (Auto-Fill) ---
// Quand on quitte le champ "Nom" (blur)
document.getElementById('new-nom').addEventListener('blur', function() {
    const text = this.value.toLowerCase();
    
    // Base de connaissances "IA" hardcodée
    if (text.includes("elden ring")) {
        document.getElementById('new-type').value = 'jeu';
        document.getElementById('new-type').dispatchEvent(new Event('change')); // Déclenche l'affichage des bons champs
        document.getElementById('new-prix').value = 49.99;
        document.getElementById('new-image').value = "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png";
        document.getElementById('new-plateforme-jeu').value = "PS5";
        document.getElementById('new-genre').value = "Action/Aventure";
    } 
    else if (text.includes("cyberpunk")) {
        document.getElementById('new-type').value = 'jeu';
        document.getElementById('new-type').dispatchEvent(new Event('change'));
        document.getElementById('new-prix').value = 29.99;
        document.getElementById('new-image').value = "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/285ef664a7c0d75a137ce52857eec07797825b7a10787e91.png";
        document.getElementById('new-plateforme-jeu').value = "PC";
        document.getElementById('new-genre').value = "RPG";
    }
});

// Lancement
displayProducts(inventoryData);