<<<<<<< HEAD
const RAWG_API_KEY = 'eb913bba43a54fa5b3fd87307730494c'; // <-- Insère ta clé ici

// --- ETAT GLOBAL DE L'APPLICATION ---
let appState = {
    inventory: [],
    users: [{ username: 'admin', password: 'admin123', role: 'admin' }],
    logs: [],
    currentUser: null,
    settings: { lang: 'fr', currency: 'EUR' }
};

// --- CONFIGURATION DEVISES & LANGUES ---
const exchangeRates = { EUR: 1, USD: 1.08, FCFA: 655.95 };
const currencySymbols = { EUR: '€', USD: '$', FCFA: 'F' };

const i18n = {
    fr: { appTitle: "🎮 PIXEL INVENTORY", loginDesc: "Veuillez vous identifier", btnLogin: "Se connecter", navDash: "Tableau de bord", navInv: "Inventaire", navAdd: "Ajouter Produit", navAdmin: "Panel Admin", statTotalItems: "Total Produits", statTotalValue: "Valeur Marchande", statBreakdown: "Répartition", filterAll: "Toutes les catégories", filterGames: "Jeux Vidéo", filterConsoles: "Consoles", filterAcc: "Accessoires", liveInventory: "Inventaire en direct", addProductTitle: "👾 Enregistrement Produit", labelName: "Nom du produit *", labelPrice: "Prix unitaire *", labelStock: "Stock initial *", btnAdd: "✅ Ajouter à la base de données", adminPanelTitle: "🛡️ Panneau d'Administration", adminLogs: "Historique des Opérations (Audit)" },
    en: { appTitle: "🎮 PIXEL INVENTORY", loginDesc: "Please log in to access the system", btnLogin: "Login", navDash: "Dashboard", navInv: "Inventory", navAdd: "Add Product", navAdmin: "Admin Panel", statTotalItems: "Total Items", statTotalValue: "Market Value", statBreakdown: "Breakdown", filterAll: "All Categories", filterGames: "Video Games", filterConsoles: "Consoles", filterAcc: "Accessories", liveInventory: "Live Inventory", addProductTitle: "👾 Product Registration", labelName: "Product Name *", labelPrice: "Unit Price *", labelStock: "Initial Stock *", btnAdd: "✅ Add to Database", adminPanelTitle: "🛡️ Administration Panel", adminLogs: "Operation History (Audit)" },
    es: { appTitle: "🎮 PIXEL INVENTORY", loginDesc: "Inicie sesión para acceder", btnLogin: "Conectarse", navDash: "Tablero", navInv: "Inventario", navAdd: "Añadir Producto", navAdmin: "Panel de Admin", statTotalItems: "Total Productos", statTotalValue: "Valor de Mercado", statBreakdown: "Desglose", filterAll: "Todas las categorías", filterGames: "Videojuegos", filterConsoles: "Consolas", filterAcc: "Accesorios", liveInventory: "Inventario en vivo", addProductTitle: "👾 Registro de Producto", labelName: "Nombre del producto *", labelPrice: "Precio unitario *", labelStock: "Stock inicial *", btnAdd: "✅ Añadir a la base de datos", adminPanelTitle: "🛡️ Panel de Administración", adminLogs: "Historial de Operaciones (Auditoría)" }
};

// --- INITIALISATION & PERSISTANCE ---
function saveState() {
    localStorage.setItem('pixelERPState', JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem('pixelERPState');
    if (saved) {
        let parsed = JSON.parse(saved);
        appState.inventory = parsed.inventory || [];
        appState.users = parsed.users && parsed.users.length > 0 ? parsed.users : appState.users;
        appState.logs = parsed.logs || [];
        appState.settings = parsed.settings || { lang: 'fr', currency: 'EUR' };
    }
}

// --- SYSTEME D'AUDIT (LOGS) ---
function addLog(action, details) {
    const time = new Date().toLocaleString();
    const user = appState.currentUser ? appState.currentUser.username : 'Système';
    const logEntry = `[${time}] ${user} > ${action}: ${details}`;
    appState.logs.unshift(logEntry);
    if(appState.logs.length > 50) appState.logs.pop();
    saveState();
    renderLogs();
}

function renderLogs() {
    const container = document.getElementById('audit-log-container');
    container.innerHTML = appState.logs.map(log => `<div>${log}</div>`).join('');
}

// --- AUTHENTIFICATION ---
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    
    const user = appState.users.find(x => x.username === u && x.password === p);
    if (user) {
        appState.currentUser = user;
        addLog('CONNEXION', 'Accès autorisé');
        startSession();
    } else {
        alert("Identifiants incorrects !");
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    addLog('DECONNEXION', 'Fermeture de session');
    appState.currentUser = null;
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('login-form').reset();
});

function startSession() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('current-user-display').textContent = `👤 ${appState.currentUser.username} (${appState.currentUser.role})`;
    
    if (appState.currentUser.role === 'admin') {
        document.getElementById('nav-admin').classList.remove('hidden');
        renderUsers();
        renderLogs();
    } else {
        document.getElementById('nav-admin').classList.add('hidden');
        document.getElementById('admin-section').classList.add('hidden');
    }

    document.getElementById('lang-selector').value = appState.settings.lang;
    document.getElementById('currency-selector').value = appState.settings.currency;
    applyLanguage();
    updateDashboard();
    filterInventory();
}

// --- TRADUCTION & DEVISES ---
document.getElementById('lang-selector').addEventListener('change', (e) => {
    appState.settings.lang = e.target.value;
    saveState();
    applyLanguage();
});

document.getElementById('currency-selector').addEventListener('change', (e) => {
    appState.settings.currency = e.target.value;
    saveState();
    updateDashboard();
    filterInventory();
});

function applyLanguage() {
    const lang = appState.settings.lang;
    const dict = i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
}

function formatPrice(priceInEur) {
    const curr = appState.settings.currency;
    const converted = priceInEur * exchangeRates[curr];
    return `${converted.toFixed(2)} ${currencySymbols[curr]}`;
}

// --- TABLEAU DE BORD (STATS) ---
function updateDashboard() {
    const totalItems = appState.inventory.reduce((sum, item) => sum + item.quantite, 0);
    const totalValueEur = appState.inventory.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    
    const countJeux = appState.inventory.filter(i => i.type === 'jeu').length;
    const countConsoles = appState.inventory.filter(i => i.type === 'console').length;
    const countAcc = appState.inventory.filter(i => i.type === 'accessoire').length;

    document.getElementById('stat-total-items').textContent = totalItems;
    document.getElementById('stat-total-value').textContent = formatPrice(totalValueEur);
    document.getElementById('stat-jeux').textContent = countJeux;
    document.getElementById('stat-consoles').textContent = countConsoles;
    document.getElementById('stat-acc').textContent = countAcc;
}

// --- CRUD & AFFICHAGE INVENTAIRE ---
function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    products.forEach((item) => {
        const card = document.createElement('div');
        card.className = `product-card card-${item.type}`;
        const imgSrc = item.image || 'https://via.placeholder.com/300x150/1f2833/00f2ff?text=No+Image';

        // Génération des détails spécifiques
        let specificDetails = '';
        if (item.type === 'jeu') {
            specificDetails = `<p>Plateforme: ${item.plateforme} | Genre: ${item.genre} | État: ${item.etat}</p>`;
        } else if (item.type === 'console') {
            specificDetails = `<p>${item.marque} - ${item.modele} | Couleur: ${item.couleur}</p>`;
        } else if (item.type === 'accessoire') {
            specificDetails = `<p>Type: ${item.type_accessoire} | Couleur: ${item.couleur}</p>`;
        }

        card.innerHTML = `
            <img src="${imgSrc}" class="product-img" onerror="this.src='https://via.placeholder.com/300x150/1f2833/ff003c?text=Error'">
            <h3>${item.nom}</h3>
            <p style="color: var(--color-${item.type}); text-transform: uppercase; font-weight:bold; font-size:0.8em;">${item.type}</p>
            ${specificDetails}
            <p class="price">${formatPrice(item.prix)}</p>
            <div class="stock-controls">
                <button class="stock-btn" onclick="updateStock(${item.id}, -1)">-1</button>
                <div class="stock-display">${item.quantite}</div>
                <button class="stock-btn" onclick="updateStock(${item.id}, 1)">+1</button>
            </div>
            <button class="btn-delete" onclick="deleteProduct(${item.id})">Supprimer</button>
        `;
        container.appendChild(card);
    });
}

window.updateStock = function(id, change) {
    const product = appState.inventory.find(p => p.id === id);
    if (product) {
        product.quantite += change;
        if (product.quantite < 0) product.quantite = 0;
        addLog('STOCK_UPDATE', `${product.nom} -> Nouvelle qté: ${product.quantite}`);
        saveState();
        updateDashboard();
        filterInventory(); 
    }
}

window.deleteProduct = function(id) {
    const product = appState.inventory.find(p => p.id === id);
    if(confirm(`Supprimer définitivement ${product.nom} ?`)) {
        appState.inventory = appState.inventory.filter(p => p.id !== id);
        addLog('SUPPRESSION', `${product.nom} retiré du catalogue`);
        saveState();
        updateDashboard();
        filterInventory();
    }
}

// --- LOGIQUE DU FORMULAIRE DYNAMIQUE ---
const typeSelect = document.getElementById('new-type');
const badgeIA = document.getElementById('badge-ia');

const champsJeu = document.getElementById('champs-jeu');
const champsConsole = document.getElementById('champs-console');
const champsAccessoire = document.getElementById('champs-accessoire');

typeSelect.addEventListener('change', function(e) {
    const typeChoisi = e.target.value;

    champsJeu.classList.add('hidden');
    champsConsole.classList.add('hidden');
    champsAccessoire.classList.add('hidden');
    badgeIA.classList.add('hidden');

    if (typeChoisi === 'jeu') {
        champsJeu.classList.remove('hidden');
        badgeIA.classList.remove('hidden');
    } 
    else if (typeChoisi === 'console') {
        champsConsole.classList.remove('hidden');
    } 
    else if (typeChoisi === 'accessoire') {
        champsAccessoire.classList.remove('hidden');
    }
});

// --- API RAWG (Auto-fill uniquement pour les jeux) ---
document.getElementById('new-nom').addEventListener('blur', async function() {
    const query = this.value.trim();
    if (!query || typeSelect.value !== 'jeu') return; // Bloque si ce n'est pas un jeu

    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${query}&key=${RAWG_API_KEY}&page_size=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            document.getElementById('new-image').value = data.results[0].background_image || '';
            document.getElementById('new-nom').value = data.results[0].name;
            addLog('API_RAWG', `Succès de l'auto-complétion pour ${data.results[0].name}`);
        }
    } catch (error) {
        console.error("Erreur API RAWG:", error);
    }
});

// --- SOUMISSION DU FORMULAIRE ---
document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const type = typeSelect.value;
    const priceInput = parseFloat(document.getElementById('new-prix').value);
    const priceInEur = priceInput / exchangeRates[appState.settings.currency];

    let nouveauProduit = {
        id: Date.now(),
        type: type,
        nom: document.getElementById('new-nom').value,
        prix: priceInEur,
        quantite: parseInt(document.getElementById('new-quantite').value),
        image: document.getElementById('new-image').value
    };

    if (type === 'jeu') {
        nouveauProduit.plateforme = document.getElementById('plateforme-jeu').value;
        nouveauProduit.genre = document.getElementById('genre-jeu').value;
        nouveauProduit.etat = document.getElementById('etat-jeu').value;
    } 
    else if (type === 'console') {
        nouveauProduit.marque = document.getElementById('constructeur-console').value;
        nouveauProduit.modele = document.getElementById('version-console').value;
        nouveauProduit.couleur = document.getElementById('couleur-console').value;
    } 
    else if (type === 'accessoire') {
        nouveauProduit.type_accessoire = document.getElementById('type-accessoire').value;
        nouveauProduit.couleur = document.getElementById('couleur-accessoire').value;
    }

    appState.inventory.push(nouveauProduit);
    addLog('AJOUT_PRODUIT', `${nouveauProduit.nom} ajouté (${nouveauProduit.quantite} ex.)`);
    saveState();
    updateDashboard();
    filterInventory();
    this.reset();
    
    // Réinitialise l'affichage par défaut après soumission
    typeSelect.value = 'jeu';
    typeSelect.dispatchEvent(new Event('change'));
    
    alert("Produit ajouté avec succès !");
});

// --- RECHERCHE ET FILTRES ---
document.getElementById('search-bar').addEventListener('input', filterInventory);
document.getElementById('filter-type').addEventListener('change', filterInventory);

function filterInventory() {
    const search = document.getElementById('search-bar').value.toLowerCase();
    const type = document.getElementById('filter-type').value;

    let filtered = appState.inventory.filter(item => {
        const matchSearch = item.nom.toLowerCase().includes(search);
        const matchType = type === 'all' || item.type === type;
        return matchSearch && matchType;
    });
    displayProducts(filtered);
}

// --- GESTION UTILISATEURS (ADMIN) ---
document.getElementById('btn-add-user').addEventListener('click', (e) => {
    e.preventDefault();
    if(appState.currentUser.role !== 'admin') return;
    
    const name = document.getElementById('new-emp-name').value;
    const pass = document.getElementById('new-emp-pass').value;
    const role = document.getElementById('new-emp-role').value;
    
    if(name && pass) {
        appState.users.push({username: name, password: pass, role: role});
        addLog('ADMIN', `Nouvel utilisateur créé: ${name} (${role})`);
        saveState();
        renderUsers();
        document.getElementById('new-emp-name').value = '';
        document.getElementById('new-emp-pass').value = '';
    }
});

function renderUsers() {
    const ul = document.getElementById('user-list');
    ul.innerHTML = appState.users.map((u, index) => 
        `<li style="padding: 5px; border-bottom: 1px solid #333;">
            👤 ${u.username} - Role: ${u.role.toUpperCase()} 
            ${u.username !== 'admin' ? `<button onclick="deleteUser(${index})" style="background:var(--danger-color); color:white; border:none; border-radius:3px; float:right; cursor:pointer;">Supprimer</button>` : ''}
        </li>`
    ).join('');
}

window.deleteUser = function(index) {
    const user = appState.users[index];
    if(confirm(`Supprimer l'accès de ${user.username} ?`)) {
        appState.users.splice(index, 1);
        addLog('ADMIN', `Utilisateur supprimé: ${user.username}`);
        saveState();
        renderUsers();
    }
}

// --- DEMARRAGE ---
loadState();
=======
// ================= CACHE DOM =================
const DOM = {
    loginBtn: document.getElementById("login-btn"),
    loginContainer: document.getElementById("login-container"),
    appContainer: document.getElementById("app-container"),
    currentUser: document.getElementById("current-user"),
    loginError: document.getElementById("login-error"),
    logoutBtn: document.getElementById("logout-btn"),

    form: document.getElementById("add-product-form"),
    container: document.getElementById("product-container"),

    search: document.getElementById("search-bar"),
    statProducts: document.getElementById("stat-products"),
    statStock: document.getElementById("stat-total-stock"),
    statValue: document.getElementById("stat-total-value")
};

// ================= STATE =================
let products = JSON.parse(localStorage.getItem("products")) || [];

// ================= LOGIN =================
DOM.loginBtn.addEventListener("click", () => {
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;

    if (user === "admin" && pass === "1234") {
        DOM.loginContainer.classList.add("hidden");
        DOM.appContainer.classList.remove("hidden");
        DOM.currentUser.textContent = user;
    } else {
        DOM.loginError.textContent = "Identifiants incorrects";
        DOM.loginError.classList.remove("hidden");
    }
});

// ================= LOGOUT =================
DOM.logoutBtn.addEventListener("click", () => {
    DOM.appContainer.classList.add("hidden");
    DOM.loginContainer.classList.remove("hidden");
});

// ================= SAVE LOCAL =================
function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
}

// ================= ADD PRODUCT =================
DOM.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const product = {
        id: Date.now(),
        nom: document.getElementById("new-nom").value,
        prix: Number(document.getElementById("new-prix").value),
        quantite: Number(document.getElementById("new-quantite").value),
        image: document.getElementById("new-image").value || ""
    };

    products.push(product);
    saveData();
    renderProducts();
    DOM.form.reset();
});

// ================= PERFORMANCE RENDER =================
function renderProducts(list = products) {
    DOM.container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    let totalStock = 0;
    let totalValue = 0;

    list.forEach(p => {
        totalStock += p.quantite;
        totalValue += p.prix * p.quantite;

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <h3>${p.nom}</h3>
            <p>💰 ${p.prix} €</p>
            <p>📦 Stock: ${p.quantite}</p>
        `;

        fragment.appendChild(card);
    });

    DOM.container.appendChild(fragment);

    // stats update (1 seule fois = rapide)
    DOM.statProducts.textContent = list.length;
    DOM.statStock.textContent = totalStock;
    DOM.statValue.textContent = totalValue.toFixed(2) + " €";
}

// ================= SEARCH (DEBOUNCE) =================
let timeout;

DOM.search.addEventListener("input", (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        const value = e.target.value.toLowerCase();

        const filtered = products.filter(p =>
            p.nom.toLowerCase().includes(value)
        );

        renderProducts(filtered);
    }, 200); // delay performance
});

// ================= INIT =================
renderProducts();
>>>>>>> 14d8ced2aedc515405dd7b5f36d6896f166b0982
