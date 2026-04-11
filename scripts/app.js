let inventoryData = [];

// 1. Initialisation : Charger les données
async function initApp() {
    try {
        const response = await fetch('data/inventory.json');
        const data = await response.json();
        inventoryData = data.stock; // On stocke les données en mémoire
        displayProducts(inventoryData);
    } catch (error) {
        console.error("Erreur de chargement :", error);
    }
}

// 2. Affichage avec colorimétrie
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; // On vide avant de réafficher

    products.forEach((item, index) => {
        const card = document.createElement('div');
        // On ajoute la classe de couleur spécifique au type (jeu, console, accessoire)
        card.className = `product-card card-${item.type}`;

        card.innerHTML = `
            <h3>${item.nom}</h3>
            <p>Type: ${item.type.toUpperCase()}</p>
            <p>Plateforme: <strong>${item.plateforme}</strong></p>
            <p class="price">${item.prix} €</p>
            <p>En stock: ${item.quantite}</p>
            <button class="btn-delete" onclick="deleteProduct(${index})">🗑️ Vendre/Supprimer</button>
        `;
        container.appendChild(card);
    });
}

// 3. Ajouter un produit (Formulaire)
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche la page de se recharger

    const newItem = {
        id: Date.now(), // ID unique fictif
        type: document.getElementById('new-type').value,
        nom: document.getElementById('new-nom').value,
        plateforme: document.getElementById('new-plateforme').value,
        prix: parseFloat(document.getElementById('new-prix').value),
        quantite: parseInt(document.getElementById('new-quantite').value)
    };

    // Ajouter à notre tableau et rafraîchir l'affichage
    inventoryData.push(newItem);
    displayProducts(inventoryData);
    this.reset(); // Vider le formulaire
    alert("Produit ajouté avec succès !");
});

// 4. Supprimer un produit
function deleteProduct(index) {
    if(confirm("Es-tu sûr de vouloir retirer ce produit ?")) {
        inventoryData.splice(index, 1); // Retire 1 élément à cet index
        displayProducts(inventoryData);
    }
}

// 5. Recherche et Filtres
document.getElementById('search-bar').addEventListener('input', filterInventory);
document.getElementById('filter-type').addEventListener('change', filterInventory);

function filterInventory() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filterType = document.getElementById('filter-type').value;

    const filteredData = inventoryData.filter(item => {
        const matchesSearch = item.nom.toLowerCase().includes(searchTerm) || item.plateforme.toLowerCase().includes(searchTerm);
        const matchesType = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesType;
    });

    displayProducts(filteredData);
}

// Lancer l'application
initApp();