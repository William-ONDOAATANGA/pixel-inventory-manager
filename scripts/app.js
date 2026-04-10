// 1. Fonction pour charger les données du JSON
async function loadInventory() {
    try {
        const response = await fetch('data/inventory.json');
        const data = await response.json();
        displayProducts(data.stock);
    } catch (error) {
        console.error("Erreur lors du chargement :", error);
    }
}

// 2. Fonction pour créer les cartes HTML dynamiquement
function displayProducts(products) {
    const container = document.getElementById('product-container');
    
    products.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <h3>${item.nom}</h3>
            <p>Plateforme: <strong>${item.plateforme}</strong></p>
            <p class="price">${item.prix} €</p>
            <p>En stock: ${item.quantite}</p>
        `;
        
        container.appendChild(card);
    });
}

// Lancer le chargement au démarrage
loadInventory();