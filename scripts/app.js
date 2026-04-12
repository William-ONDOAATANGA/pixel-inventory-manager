// ==================== CONFIGURATION ====================
const RAWG_API_KEY = 'eb913bba43a54fa5b3fd87307730494c';
let inventoryData = [];
let currentUser = null;

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
            <td>${user.role === 'admin' ? 'Admin' : 'Utilisateur'}</td>
            <td><button class="delete-user-btn" data-username="${user.username}">🗑️ Supprimer</button></td>
        `;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = btn.dataset.username;
            if (username === currentUser.username) {
                showToast("Vous ne pouvez pas vous supprimer vous-même !", true);
                return;
            }
            if (confirm(`Supprimer l'utilisateur "${username}" ?`)) {
                if (deleteUser(username)) {
                    showToast(`Utilisateur ${username} supprimé.`);
                    renderUsersList();
                } else {
                    showToast("Impossible de supprimer l'administrateur par défaut.", true);
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
    const totalValue = inventoryData.reduce((sum, p) => sum + (p.prix * p.quantite), 0);
    document.getElementById('stat-products').textContent = totalProducts;
    document.getElementById('stat-total-stock').textContent = totalStock;
    document.getElementById('stat-total-value').textContent = totalValue.toFixed(2) + ' €';
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
        container.innerHTML = '<p style="text-align:center;">Aucun produit trouvé.</p>';
        return;
    }
    products.forEach(item => {
        const card = document.createElement('div');
        card.className = `product-card card-${item.type}`;
        const imgSrc = item.image && item.image.trim() !== '' ? item.image : 'https://via.placeholder.com/300x150/1f2833/00f2ff?text=No+Image';
        let metaHtml = '';
        if (item.type === 'jeu') {
            metaHtml = `<p class="meta-info">🎮 Plateforme: <strong>${escapeHtml(item.plateforme || 'N/A')}</strong></p>
                        <p class="meta-info">📀 État: <strong>${escapeHtml(item.etat || 'Neuf')}</strong> | Genre: ${escapeHtml(item.genre || '-')}</p>`;
        } else if (item.type === 'console') {
            metaHtml = `<p class="meta-info">🕹️ Marque: <strong>${escapeHtml(item.constructeur)}</strong> | Modèle: ${escapeHtml(item.modele)}</p>
                        <p class="meta-info">🎨 Couleur: <strong>${escapeHtml(item.couleur || 'N/A')}</strong> | Manettes: ${item.manettes || 0}</p>`;
        } else if (item.type === 'accessoire') {
            metaHtml = `<p class="meta-info">🔌 Type: <strong>${escapeHtml(item.typeAcc)}</strong></p>
                        <p class="meta-info">🎨 Couleur: <strong>${escapeHtml(item.couleur || 'N/A')}</strong></p>`;
        }
        card.innerHTML = `
            <img src="${imgSrc}" class="product-img" alt="${escapeHtml(item.nom)}" onerror="this.src='https://via.placeholder.com/300x150/1f2833/ff003c?text=Erreur+Image'">
            <h3>${escapeHtml(item.nom)}</h3>
            ${metaHtml}
            <p class="price">${item.prix.toFixed(2)} €</p>
            <div class="stock-controls">
                <button class="stock-btn" data-id="${item.id}" data-change="-1">-1</button>
                <div class="stock-display">${item.quantite}</div>
                <button class="stock-btn" data-id="${item.id}" data-change="1">+1</button>
            </div>
            <div class="card-actions">
                <button class="btn-edit" data-id="${item.id}">✏️ Modifier</button>
                <button class="btn-delete" data-id="${item.id}">🗑️ Supprimer</button>
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
        showToast(`Stock mis à jour: ${product.nom} → ${product.quantite}`);
    }
}

function deleteProduct(id) {
    if (confirm("⚠️ Supprimer définitivement ce produit ?")) {
        inventoryData = inventoryData.filter(p => p.id !== id);
        saveInventory();
        filterInventory();
        showToast("Produit supprimé.", true);
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
            <div class="form-group"><label>Plateforme</label><input type="text" id="edit-plateforme" value="${escapeHtml(product.plateforme || '')}"></div>
            <div class="form-group"><label>État</label><select id="edit-etat"><option ${product.etat === 'Neuf' ? 'selected' : ''}>Neuf</option><option ${product.etat === 'Occasion' ? 'selected' : ''}>Occasion</option></select></div>
            <div class="form-group"><label>Genre</label><input type="text" id="edit-genre" value="${escapeHtml(product.genre || '')}"></div>
        `;
    } else if (product.type === 'console') {
        container.innerHTML = `
            <div class="form-group"><label>Constructeur</label><input type="text" id="edit-constructeur" value="${escapeHtml(product.constructeur || '')}"></div>
            <div class="form-group"><label>Modèle</label><input type="text" id="edit-modele" value="${escapeHtml(product.modele || '')}"></div>
            <div class="form-group"><label>Couleur</label><input type="text" id="edit-couleur" value="${escapeHtml(product.couleur || '')}"></div>
            <div class="form-group"><label>Manettes</label><input type="number" id="edit-manettes" value="${product.manettes || 0}"></div>
        `;
    } else if (product.type === 'accessoire') {
        container.innerHTML = `
            <div class="form-group"><label>Type</label><input type="text" id="edit-typeAcc" value="${escapeHtml(product.typeAcc || '')}"></div>
            <div class="form-group"><label>Couleur</label><input type="text" id="edit-couleur" value="${escapeHtml(product.couleur || '')}"></div>
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
        showToast("Produit modifié !");
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
    if (!document.getElementById('new-nom').value.trim()) return "Nom requis";
    if (!document.getElementById('new-prix').value) return "Prix requis";
    if (!document.getElementById('new-quantite').value) return "Stock requis";
    if (type === 'jeu') {
        if (!document.getElementById('new-plateforme-jeu').value.trim()) return "Plateforme requise";
        if (!document.getElementById('new-genre').value) return "Genre requis";
    } else if (type === 'console') {
        if (!document.getElementById('new-couleur-console').value.trim()) return "Couleur requise";
    } else if (type === 'accessoire') {
        if (!document.getElementById('new-couleur-acc').value.trim()) return "Couleur requise";
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
    showToast("Produit ajouté !");
});

document.getElementById('new-nom').addEventListener('blur', async function() {
    const query = this.value.trim();
    const currentType = document.getElementById('new-type').value;
    const badge = document.getElementById('ai-badge');
    if (!query || currentType !== 'jeu') return;
    badge.textContent = "⏳ Recherche API RAWG...";
    badge.style.color = "#00f2ff";
    try {
        const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${RAWG_API_KEY}&page_size=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const game = data.results[0];
            if (game.background_image) document.getElementById('new-image').value = game.background_image;
            if (game.name) document.getElementById('new-nom').value = game.name;
            badge.textContent = "✅ Jeu trouvé ! Image importée.";
            badge.style.color = "#39ff14";
        } else {
            badge.textContent = "❌ Jeu non trouvé, saisie manuelle.";
            badge.style.color = "#ff003c";
        }
    } catch (error) {
        console.error("API Error:", error);
        badge.textContent = "⚠️ Erreur API, vérifie ta connexion.";
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
        badge.textContent = "✨ Auto-fill IA actif";
        badge.style.color = "var(--accent-warning)";
    } else {
        badge.textContent = "⌨️ Saisie manuelle (Matériel)";
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
    showToast("Export JSON réussi !");
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
                showToast("Import réussi !");
            } else throw new Error("Format invalide");
        } catch (err) {
            showToast("Fichier JSON invalide", true);
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

// ==================== AUTHENTIFICATION & INIT ====================
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        document.getElementById('login-error').innerText = "Veuillez remplir tous les champs.";
        document.getElementById('login-error').classList.remove('hidden');
        return;
    }
    if (authenticate(username, password)) {
        initInventory();
        showAppScreen();
        renderUsersList();
    } else {
        document.getElementById('login-error').innerText = "Nom d'utilisateur ou mot de passe incorrect.";
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
        showToast("Nom d'utilisateur et mot de passe requis.", true);
        return;
    }
    if (addUser(username, password, role)) {
        showToast(`Utilisateur ${username} ajouté.`);
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        renderUsersList();
    } else {
        showToast("Cet utilisateur existe déjà.", true);
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
        } else {
            showLoginScreen();
        }
    } else {
        showLoginScreen();
    }
});