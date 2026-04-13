// ==================== CONFIGURATION ====================
const RAWG_API_KEY = 'eb913bba43a54fa5b3fd87307730494c';
let inventoryData = [];
let currentUser = null;

// Taux de conversion FCFA (1 EUR = 655.957 XAF)
const XAF_RATE = 655.957;

// Langue courante
let currentLang = 'fr';
// Devise courante
let currentCurrency = 'EUR';

// ==================== TRADUCTIONS ====================
const translations = {
    fr: {
        login_title: "Connexion",
        login_btn: "Se connecter",
        logout: "Déconnexion",
        nav_inventory: "Inventaire",
        nav_add: "Ajouter produit",
        nav_users: "Gestion utilisateurs",
        stat_products: "📦 Produits distincts",
        stat_stock: "🎮 Stock total unités",
        stat_value: "💰 Valeur totale",
        filter_search: "🔍 Recherche",
        filter_category: "📁 Catégorie",
        all: "Toutes",
        games: "Jeux Vidéo",
        consoles: "Consoles",
        accessories: "Accessoires",
        filter_condition: "✨ État (Jeux)",
        new: "Neuf",
        used: "Occasion",
        filter_price_min: "💰 Prix min",
        filter_price_max: "💰 Prix max",
        filter_sort: "📊 Trier par",
        none: "Aucun tri",
        price_asc: "Prix croissant",
        price_desc: "Prix décroissant",
        name_asc: "Nom A→Z",
        name_desc: "Nom Z→A",
        stock_asc: "Stock croissant",
        stock_desc: "Stock décroissant",
        export: "📤 Exporter JSON",
        import: "📥 Importer JSON",
        inventory_title: "🎲 Inventaire en temps réel",
        add_title: "🕹️ Ajouter un produit",
        product_type: "Type d'entité *",
        product_name: "Nom du produit *",
        price: "Prix unitaire (€) *",
        stock: "Stock initial *",
        image_url: "URL de l'image (Optionnel)",
        platform: "Plateforme de jeu *",
        condition: "État *",
        genre: "Genre *",
        manufacturer: "Constructeur *",
        model: "Modèle *",
        color: "Couleur *",
        controllers: "Manettes incluses *",
        device_type: "Type de périphérique *",
        add_btn: "✅ Ajouter à l'inventaire",
        users_title: "👥 Gestion des utilisateurs",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        role: "Rôle",
        role_user: "Utilisateur",
        role_admin: "Administrateur",
        add_user: "➕ Ajouter utilisateur",
        user_list: "Liste des utilisateurs",
        actions: "Actions",
        edit_title: "✏️ Modifier le produit",
        save: "💾 Sauvegarder",
        delete_confirm: "⚠️ Supprimer définitivement ce produit ?",
        stock_updated: "Stock mis à jour: {name} → {qty}",
        product_deleted: "Produit supprimé.",
        product_added: "Produit ajouté !",
        product_modified: "Produit modifié !",
        export_success: "Export JSON réussi !",
        import_success: "Import réussi !",
        import_invalid: "Fichier JSON invalide",
        login_error_empty: "Veuillez remplir tous les champs.",
        login_error_invalid: "Nom d'utilisateur ou mot de passe incorrect.",
        user_add_error_exists: "Cet utilisateur existe déjà.",
        user_add_success: "Utilisateur {username} ajouté.",
        user_delete_self: "Vous ne pouvez pas vous supprimer vous-même !",
        user_delete_success: "Utilisateur {username} supprimé.",
        user_delete_admin_blocked: "Impossible de supprimer l'administrateur par défaut.",
        username_password_required: "Nom d'utilisateur et mot de passe requis.",
        search_placeholder: "Nom du produit...",
        no_products: "Aucun produit trouvé.",
        ai_fill_active: "✨ Auto-fill IA actif",
        ai_fill_manual: "⌨️ Saisie manuelle (Matériel)",
        ai_searching: "⏳ Recherche API RAWG...",
        ai_found: "✅ Jeu trouvé ! Image importée.",
        ai_not_found: "❌ Jeu non trouvé, saisie manuelle.",
        ai_error: "⚠️ Erreur API, vérifie ta connexion.",
        currency_xaf: "FCFA",
        currency_eur: "€"
    },
    en: {
        login_title: "Login",
        login_btn: "Login",
        logout: "Logout",
        nav_inventory: "Inventory",
        nav_add: "Add product",
        nav_users: "User management",
        stat_products: "📦 Distinct products",
        stat_stock: "🎮 Total stock units",
        stat_value: "💰 Total value",
        filter_search: "🔍 Search",
        filter_category: "📁 Category",
        all: "All",
        games: "Video Games",
        consoles: "Consoles",
        accessories: "Accessories",
        filter_condition: "✨ Condition (Games)",
        new: "New",
        used: "Used",
        filter_price_min: "💰 Min price",
        filter_price_max: "💰 Max price",
        filter_sort: "📊 Sort by",
        none: "No sort",
        price_asc: "Price ascending",
        price_desc: "Price descending",
        name_asc: "Name A→Z",
        name_desc: "Name Z→A",
        stock_asc: "Stock ascending",
        stock_desc: "Stock descending",
        export: "📤 Export JSON",
        import: "📥 Import JSON",
        inventory_title: "🎲 Real-time inventory",
        add_title: "🕹️ Add product",
        product_type: "Entity type *",
        product_name: "Product name *",
        price: "Unit price (€) *",
        stock: "Initial stock *",
        image_url: "Image URL (Optional)",
        platform: "Game platform *",
        condition: "Condition *",
        genre: "Genre *",
        manufacturer: "Manufacturer *",
        model: "Model *",
        color: "Color *",
        controllers: "Included controllers *",
        device_type: "Device type *",
        add_btn: "✅ Add to inventory",
        users_title: "👥 User management",
        username: "Username",
        password: "Password",
        role: "Role",
        role_user: "User",
        role_admin: "Administrator",
        add_user: "➕ Add user",
        user_list: "User list",
        actions: "Actions",
        edit_title: "✏️ Edit product",
        save: "💾 Save",
        delete_confirm: "⚠️ Permanently delete this product?",
        stock_updated: "Stock updated: {name} → {qty}",
        product_deleted: "Product deleted.",
        product_added: "Product added!",
        product_modified: "Product modified!",
        export_success: "JSON export successful!",
        import_success: "Import successful!",
        import_invalid: "Invalid JSON file",
        login_error_empty: "Please fill in all fields.",
        login_error_invalid: "Incorrect username or password.",
        user_add_error_exists: "This user already exists.",
        user_add_success: "User {username} added.",
        user_delete_self: "You cannot delete yourself!",
        user_delete_success: "User {username} deleted.",
        user_delete_admin_blocked: "Cannot delete default administrator.",
        username_password_required: "Username and password required.",
        search_placeholder: "Product name...",
        no_products: "No products found.",
        ai_fill_active: "✨ AI auto-fill active",
        ai_fill_manual: "⌨️ Manual input (Hardware)",
        ai_searching: "⏳ Searching RAWG API...",
        ai_found: "✅ Game found! Image imported.",
        ai_not_found: "❌ Game not found, manual entry.",
        ai_error: "⚠️ API error, check your connection.",
        currency_xaf: "XAF",
        currency_eur: "€"
    }
};

function t(key, params = {}) {
    let text = translations[currentLang][key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
    document.getElementById('search-bar').placeholder = t('search_placeholder');
    const badge = document.getElementById('ai-badge');
    if (badge) {
        if (document.getElementById('new-type').value === 'jeu') {
            badge.textContent = t('ai_fill_active');
        } else {
            badge.textContent = t('ai_fill_manual');
        }
    }
}

// ==================== GESTION DE LA DEVISE ====================
function formatPrice(priceEUR) {
    if (currentCurrency === 'EUR') {
        return priceEUR.toFixed(2) + ' €';
    } else {
        const xaf = priceEUR * XAF_RATE;
        return Math.round(xaf).toLocaleString() + ' FCFA';
    }
}

function updateAllPrices() {
    filterInventory();
    updateStatistics();
}

// ==================== GESTION UTILISATEURS ====================
function loadUsers() {
    const users = localStorage.getItem('pixelUsers');
    if (users) return JSON.parse(users);
    const defaultUsers = [
        { username: 'admin', password: 'admin', role: 'admin' },
        { username: 'demo', password: 'demo', role: 'user' }
    ];
    localStorage.setItem('pixelUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem('pixelUsers', JSON.stringify(users));
}

function addUser(username, password, role) {
    let users = loadUsers();
    if (users.find(u => u.username === username)) return false;
    users.push({ username, password, role });
    saveUsers(users);
    return true;
}

function deleteUser(username) {
    let users = loadUsers();
    if (username === 'admin') return false;
    const newUsers = users.filter(u => u.username !== username);
    saveUsers(newUsers);
    return true;
}

function authenticate(username, password) {
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('pixelCurrentUser', JSON.stringify({ username: user.username, role: user.role }));
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('pixelCurrentUser');
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('app-container').classList.add('hidden');
}

function showAppScreen() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').classList.remove('hidden');
    document.getElementById('current-user').innerText = currentUser.username;
    const usersSection = document.getElementById('users-section');
    if (currentUser.role === 'admin') {
        usersSection.classList.remove('hidden');
        renderUsersList();
    } else {
        usersSection.classList.add('hidden');
    }
}

function renderUsersList() {
    const users = loadUsers();
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(user.username)}</td>
            <td>${user.role === 'admin' ? 'Admin' : 'User'}</td>
            <td><button class="delete-user-btn" data-username="${user.username}">🗑️ ${t('actions')}</button></td>
        `;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = btn.dataset.username;
            if (username === currentUser.username) {
                showToast(t('user_delete_self'), true);
                return;
            }
            if (confirm(t('delete_confirm'))) {
                if (deleteUser(username)) {
                    showToast(t('user_delete_success', { username }));
                    renderUsersList();
                } else {
                    showToast(t('user_delete_admin_blocked'), true);
                }
            }
        });
    });
}

// ==================== GESTION INVENTAIRE ====================
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.style.background = isError ? '#ff003c' : '#00cc66';
    toast.style.color = 'white';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function saveInventory() {
    localStorage.setItem('pixelInventoryData', JSON.stringify(inventoryData));
    updateStatistics();
}

function updateStatistics() {
    const totalProducts = inventoryData.length;
    const totalStock = inventoryData.reduce((sum, p) => sum + p.quantite, 0);
    const totalValueEUR = inventoryData.reduce((sum, p) => sum + (p.prix * p.quantite), 0);
    document.getElementById('stat-products').textContent = totalProducts;
    document.getElementById('stat-total-stock').textContent = totalStock;
    document.getElementById('stat-total-value').textContent = formatPrice(totalValueEUR);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    if (products.length === 0) {
        container.innerHTML = `<p style="text-align:center;">${t('no_products')}</p>`;
        return;
    }
    products.forEach(item => {
        const card = document.createElement('div');
        card.className = `product-card card-${item.type}`;
        const imgSrc = item.image && item.image.trim() !== '' ? item.image : 'https://via.placeholder.com/300x150/1f2833/00f2ff?text=No+Image';
        let metaHtml = '';
        if (item.type === 'jeu') {
            metaHtml = `<p class="meta-info">🎮 ${t('platform')}: <strong>${escapeHtml(item.plateforme || 'N/A')}</strong></p>
                        <p class="meta-info">📀 ${t('condition')}: <strong>${escapeHtml(item.etat || t('new'))}</strong> | ${t('genre')}: ${escapeHtml(item.genre || '-')}</p>`;
        } else if (item.type === 'console') {
            metaHtml = `<p class="meta-info">🕹️ ${t('manufacturer')}: <strong>${escapeHtml(item.constructeur)}</strong> | ${t('model')}: ${escapeHtml(item.modele)}</p>
                        <p class="meta-info">🎨 ${t('color')}: <strong>${escapeHtml(item.couleur || 'N/A')}</strong> | ${t('controllers')}: ${item.manettes || 0}</p>`;
        } else if (item.type === 'accessoire') {
            metaHtml = `<p class="meta-info">🔌 ${t('device_type')}: <strong>${escapeHtml(item.typeAcc)}</strong></p>
                        <p class="meta-info">🎨 ${t('color')}: <strong>${escapeHtml(item.couleur || 'N/A')}</strong></p>`;
        }
        card.innerHTML = `
            <img src="${imgSrc}" class="product-img" alt="${escapeHtml(item.nom)}" onerror="this.src='https://via.placeholder.com/300x150/1f2833/ff003c?text=Erreur+Image'">
            <h3>${escapeHtml(item.nom)}</h3>
            ${metaHtml}
            <p class="price">${formatPrice(item.prix)}</p>
            <div class="stock-controls">
                <button class="stock-btn" data-id="${item.id}" data-change="-1">-1</button>
                <div class="stock-display">${item.quantite}</div>
                <button class="stock-btn" data-id="${item.id}" data-change="1">+1</button>
            </div>
            <div class="card-actions">
                <button class="btn-edit" data-id="${item.id}">✏️ ${t('edit_title')}</button>
                <button class="btn-delete" data-id="${item.id}">🗑️ ${t('actions')}</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.stock-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const change = parseInt(btn.dataset.change);
            updateStock(id, change);
        });
    });
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => openEditModal(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => deleteProduct(parseInt(btn.dataset.id)));
    });
}

function updateStock(id, change) {
    const product = inventoryData.find(p => p.id === id);
    if (product) {
        product.quantite = Math.max(0, product.quantite + change);
        saveInventory();
        filterInventory();
        showToast(t('stock_updated', { name: product.nom, qty: product.quantite }));
    }
}

function deleteProduct(id) {
    if (confirm(t('delete_confirm'))) {
        inventoryData = inventoryData.filter(p => p.id !== id);
        saveInventory();
        filterInventory();
        showToast(t('product_deleted'), true);
    }
}

function openEditModal(id) {
    const product = inventoryData.find(p => p.id === id);
    if (!product) return;
    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-nom').value = product.nom;
    document.getElementById('edit-prix').value = product.prix;
    document.getElementById('edit-quantite').value = product.quantite;
    document.getElementById('edit-image').value = product.image || '';
    const container = document.getElementById('edit-dynamic-fields');
    container.innerHTML = '';
    if (product.type === 'jeu') {
        container.innerHTML = `
            <div class="form-group"><label>${t('platform')}</label><input type="text" id="edit-plateforme" value="${escapeHtml(product.plateforme || '')}"></div>
            <div class="form-group"><label>${t('condition')}</label><select id="edit-etat"><option ${product.etat === 'Neuf' ? 'selected' : ''}>${t('new')}</option><option ${product.etat === 'Occasion' ? 'selected' : ''}>${t('used')}</option></select></div>
            <div class="form-group"><label>${t('genre')}</label><input type="text" id="edit-genre" value="${escapeHtml(product.genre || '')}"></div>
        `;
    } else if (product.type === 'console') {
        container.innerHTML = `
            <div class="form-group"><label>${t('manufacturer')}</label><input type="text" id="edit-constructeur" value="${escapeHtml(product.constructeur || '')}"></div>
            <div class="form-group"><label>${t('model')}</label><input type="text" id="edit-modele" value="${escapeHtml(product.modele || '')}"></div>
            <div class="form-group"><label>${t('color')}</label><input type="text" id="edit-couleur" value="${escapeHtml(product.couleur || '')}"></div>
            <div class="form-group"><label>${t('controllers')}</label><input type="number" id="edit-manettes" value="${product.manettes || 0}"></div>
        `;
    } else if (product.type === 'accessoire') {
        container.innerHTML = `
            <div class="form-group"><label>${t('device_type')}</label><input type="text" id="edit-typeAcc" value="${escapeHtml(product.typeAcc || '')}"></div>
            <div class="form-group"><label>${t('color')}</label><input type="text" id="edit-couleur" value="${escapeHtml(product.couleur || '')}"></div>
        `;
    }
    document.getElementById('edit-modal').style.display = 'flex';
}

document.getElementById('edit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('edit-id').value);
    const product = inventoryData.find(p => p.id === id);
    if (product) {
        product.nom = document.getElementById('edit-nom').value;
        product.prix = parseFloat(document.getElementById('edit-prix').value);
        product.quantite = parseInt(document.getElementById('edit-quantite').value);
        product.image = document.getElementById('edit-image').value;
        if (product.type === 'jeu') {
            product.plateforme = document.getElementById('edit-plateforme')?.value;
            product.etat = document.getElementById('edit-etat')?.value;
            product.genre = document.getElementById('edit-genre')?.value;
        } else if (product.type === 'console') {
            product.constructeur = document.getElementById('edit-constructeur')?.value;
            product.modele = document.getElementById('edit-modele')?.value;
            product.couleur = document.getElementById('edit-couleur')?.value;
            product.manettes = parseInt(document.getElementById('edit-manettes')?.value) || 0;
        } else if (product.type === 'accessoire') {
            product.typeAcc = document.getElementById('edit-typeAcc')?.value;
            product.couleur = document.getElementById('edit-couleur')?.value;
        }
        saveInventory();
        filterInventory();
        showToast(t('product_modified'));
        document.getElementById('edit-modal').style.display = 'none';
    }
});

function filterInventory() {
    const search = document.getElementById('search-bar').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const etat = document.getElementById('filter-etat').value;
    const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
    const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;
    const sort = document.getElementById('sort-by').value;

    let filtered = inventoryData.filter(item => {
        const matchSearch = item.nom.toLowerCase().includes(search);
        const matchType = type === 'all' || item.type === type;
        const matchEtat = (item.type !== 'jeu') || (etat === 'all' || item.etat === etat);
        const matchPrice = item.prix >= priceMin && item.prix <= priceMax;
        return matchSearch && matchType && matchEtat && matchPrice;
    });

    switch(sort) {
        case 'price-asc': filtered.sort((a,b) => a.prix - b.prix); break;
        case 'price-desc': filtered.sort((a,b) => b.prix - a.prix); break;
        case 'name-asc': filtered.sort((a,b) => a.nom.localeCompare(b.nom)); break;
        case 'name-desc': filtered.sort((a,b) => b.nom.localeCompare(a.nom)); break;
        case 'stock-asc': filtered.sort((a,b) => a.quantite - b.quantite); break;
        case 'stock-desc': filtered.sort((a,b) => b.quantite - a.quantite); break;
        default: break;
    }
    displayProducts(filtered);
}

function validateForm(type) {
    if (!document.getElementById('new-nom').value.trim()) return t('product_name') + " requis";
    if (!document.getElementById('new-prix').value) return t('price') + " requis";
    if (!document.getElementById('new-quantite').value) return t('stock') + " requis";
    if (type === 'jeu') {
        if (!document.getElementById('new-plateforme-jeu').value.trim()) return t('platform') + " requise";
        if (!document.getElementById('new-genre').value) return t('genre') + " requis";
    } else if (type === 'console') {
        if (!document.getElementById('new-couleur-console').value.trim()) return t('color') + " requise";
    } else if (type === 'accessoire') {
        if (!document.getElementById('new-couleur-acc').value.trim()) return t('color') + " requise";
    }
    return null;
}

document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('new-type').value;
    const error = validateForm(type);
    if (error) {
        showToast(error, true);
        return;
    }
    let newItem = {
        id: Date.now(),
        type: type,
        nom: document.getElementById('new-nom').value.trim(),
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
    this.reset();
    document.getElementById('new-type').dispatchEvent(new Event('change'));
    showToast(t('product_added'));
});

document.getElementById('new-nom').addEventListener('blur', async function() {
    const query = this.value.trim();
    const currentType = document.getElementById('new-type').value;
    const badge = document.getElementById('ai-badge');
    if (!query || currentType !== 'jeu') return;
    badge.textContent = t('ai_searching');
    badge.style.color = "#00f2ff";
    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${RAWG_API_KEY}&page_size=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const game = data.results[0];
            if (game.background_image) document.getElementById('new-image').value = game.background_image;
            if (game.name) document.getElementById('new-nom').value = game.name;
            badge.textContent = t('ai_found');
            badge.style.color = "#39ff14";
        } else {
            badge.textContent = t('ai_not_found');
            badge.style.color = "#ff003c";
        }
    } catch (error) {
        console.error("API Error:", error);
        badge.textContent = t('ai_error');
        badge.style.color = "#ffaa00";
    }
});

document.getElementById('new-type').addEventListener('change', function() {
    const type = this.value;
    const badge = document.getElementById('ai-badge');
    document.getElementById('fields-jeu').classList.add('hidden');
    document.getElementById('fields-console').classList.add('hidden');
    document.getElementById('fields-accessoire').classList.add('hidden');
    document.getElementById(`fields-${type}`).classList.remove('hidden');
    if (type === 'jeu') {
        badge.textContent = t('ai_fill_active');
        badge.style.color = "var(--accent-warning)";
    } else {
        badge.textContent = t('ai_fill_manual');
        badge.style.color = "#aaaaaa";
    }
});

document.getElementById('export-btn').addEventListener('click', () => {
    const dataStr = JSON.stringify(inventoryData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel_inventory_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('export_success'));
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const imported = JSON.parse(ev.target.result);
            if (Array.isArray(imported)) {
                inventoryData = imported;
                saveInventory();
                filterInventory();
                showToast(t('import_success'));
            } else throw new Error("Format invalide");
        } catch (err) {
            showToast(t('import_invalid'), true);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
});

document.getElementById('filter-type').addEventListener('change', function() {
    const etatFilter = document.getElementById('filter-etat');
    if (this.value === 'jeu') etatFilter.classList.remove('hidden');
    else etatFilter.classList.add('hidden');
    filterInventory();
});
document.getElementById('search-bar').addEventListener('input', filterInventory);
document.getElementById('filter-etat').addEventListener('change', filterInventory);
document.getElementById('price-min').addEventListener('input', filterInventory);
document.getElementById('price-max').addEventListener('input', filterInventory);
document.getElementById('sort-by').addEventListener('change', filterInventory);

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('edit-modal')) {
        document.getElementById('edit-modal').style.display = 'none';
    }
});

function initInventory() {
    const savedData = localStorage.getItem('pixelInventoryData');
    if (savedData) {
        inventoryData = JSON.parse(savedData);
    } else {
        inventoryData = [
            { id: 1, type: "jeu", nom: "The Legend of Zelda: Tears of the Kingdom", plateforme: "Nintendo Switch", prix: 59.99, quantite: 15, etat: "Neuf", genre: "Action/Aventure", image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000063714/c42553b4fd0312c31e70ec7468c6c9cb1865ee0d2b54cd0bd1e718f12040d67f" },
            { id: 2, type: "console", nom: "PlayStation 5 Slim", constructeur: "Sony", modele: "Slim", couleur: "Blanc", manettes: 1, prix: 549.99, quantite: 4, image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-disc-console-front-white-15nov23?$1600px$" },
            { id: 3, type: "accessoire", nom: "Manette Xbox Carbon Black", typeAcc: "Manette", couleur: "Noir", prix: 59.99, quantite: 8, image: "https://compass-ssl.xbox.com/assets/1f/42/1f42d4d2-7a16-4dab-bc0e-7e45db184968.jpg?n=Gaming-Hardware_Hero-0_788x444_03.jpg" }
        ];
        saveInventory();
    }
    filterInventory();
    updateStatistics();
}

// ==================== GESTION LANGUE & DEVISE ====================
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pixelLang', lang);
    updatePageLanguage();
    filterInventory();
    updateStatistics();
}

function setCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('pixelCurrency', currency);
    updateAllPrices();
}

document.getElementById('lang-selector').addEventListener('change', (e) => setLanguage(e.target.value));
document.getElementById('currency-selector').addEventListener('change', (e) => setCurrency(e.target.value));

// ==================== AUTHENTIFICATION & INIT ====================
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        document.getElementById('login-error').innerText = t('login_error_empty');
        document.getElementById('login-error').classList.remove('hidden');
        return;
    }
    if (authenticate(username, password)) {
        initInventory();
        showAppScreen();
        renderUsersList();
        const savedLang = localStorage.getItem('pixelLang');
        if (savedLang) {
            currentLang = savedLang;
            document.getElementById('lang-selector').value = savedLang;
            updatePageLanguage();
        }
        const savedCurrency = localStorage.getItem('pixelCurrency');
        if (savedCurrency) {
            currentCurrency = savedCurrency;
            document.getElementById('currency-selector').value = savedCurrency;
            updateAllPrices();
        }
    } else {
        document.getElementById('login-error').innerText = t('login_error_invalid');
        document.getElementById('login-error').classList.remove('hidden');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
});

document.getElementById('add-user-btn').addEventListener('click', () => {
    if (currentUser?.role !== 'admin') return;
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('new-role').value;
    if (!username || !password) {
        showToast(t('username_password_required'), true);
        return;
    }
    if (addUser(username, password, role)) {
        showToast(t('user_add_success', { username }));
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        renderUsersList();
    } else {
        showToast(t('user_add_error_exists'), true);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('pixelCurrentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const users = loadUsers();
        const valid = users.find(u => u.username === user.username);
        if (valid) {
            currentUser = valid;
            initInventory();
            showAppScreen();
            renderUsersList();
            const savedLang = localStorage.getItem('pixelLang');
            if (savedLang) {
                currentLang = savedLang;
                document.getElementById('lang-selector').value = savedLang;
                updatePageLanguage();
            }
            const savedCurrency = localStorage.getItem('pixelCurrency');
            if (savedCurrency) {
                currentCurrency = savedCurrency;
                document.getElementById('currency-selector').value = savedCurrency;
                updateAllPrices();
            }
        } else {
            showLoginScreen();
        }
    } else {
        showLoginScreen();
    }
});