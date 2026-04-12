// ==================== CONFIGURATION ====================
const RAWG_API_KEY = 'eb913bba43a54fa5b3fd87307730494c';
let inventoryData = [];
let currentUser = null;

// ==================== GESTION UTILISATEURS ====================
function loadUsers() {
    const users = localStorage.getItem('pixelUsers');
    if (users) return JSON.parse(users);
    // Compte admin par défaut
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
    if (username === 'admin') return false; // empêche suppression admin par défaut
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
    // Afficher ou masquer la section gestion utilisateurs selon le rôle
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

// ==================== GESTION INVENTAIRE (inchangée) ====================
// ... toutes les fonctions existantes (saveInventory, updateStatistics, displayProducts, etc.)
// Elles doivent être reprises telles quelles depuis la version précédente.
// Pour éviter la répétition, je les réinclus ci-dessous de manière synthétique.

function showToast(message, isError = false) { /* identique */ }
function saveInventory() { localStorage.setItem('pixelInventoryData', JSON.stringify(inventoryData)); updateStatistics(); }
function updateStatistics() { /* idem */ }
function escapeHtml(str) { /* idem */ }
function displayProducts(products) { /* idem */ }
function updateStock(id, change) { /* idem */ }
function deleteProduct(id) { /* idem */ }
function openEditModal(id) { /* idem */ }
function filterInventory() { /* idem */ }
function validateForm(type) { /* idem */ }

// Formulaire ajout produit
document.getElementById('add-product-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('new-type').value;
    const error = validateForm(type);
    if (error) { showToast(error, true); return; }
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

// API RAWG
document.getElementById('new-nom')?.addEventListener('blur', async function() { /* identique */ });
document.getElementById('new-type')?.addEventListener('change', function() { /* identique */ });

// Export/Import
document.getElementById('export-btn')?.addEventListener('click', () => { /* identique */ });
document.getElementById('import-file')?.addEventListener('change', (e) => { /* identique */ });

// Filtres
document.getElementById('filter-type')?.addEventListener('change', function() { /* identique */ });
// ... tous les addEventListener pour les filtres

// Modal édition
document.getElementById('edit-form')?.addEventListener('submit', function(e) { /* identique */ });
document.querySelector('.close-modal')?.addEventListener('click', () => { /* identique */ });
window.addEventListener('click', (e) => { if (e.target === document.getElementById('edit-modal')) document.getElementById('edit-modal').style.display = 'none'; });

// Initialisation inventaire
function initInventory() {
    const savedData = localStorage.getItem('pixelInventoryData');
    if (savedData) {
        inventoryData = JSON.parse(savedData);
    } else {
        inventoryData = [ /* données par défaut */ ];
        saveInventory();
    }
    filterInventory();
    updateStatistics();
}

// ==================== AUTHENTIFICATION ====================
document.getElementById('login-btn')?.addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        document.getElementById('login-error').innerText = "Veuillez remplir tous les champs.";
        document.getElementById('login-error').classList.remove('hidden');
        return;
    }
    if (authenticate(username, password)) {
        initInventory();       // charge l'inventaire
        showAppScreen();
        renderUsersList();     // si admin
    } else {
        document.getElementById('login-error').innerText = "Nom d'utilisateur ou mot de passe incorrect.";
        document.getElementById('login-error').classList.remove('hidden');
    }
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
});

document.getElementById('add-user-btn')?.addEventListener('click', () => {
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

// Vérification de session au chargement
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('pixelCurrentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        // On vérifie que l'utilisateur existe toujours dans la base (sécurité)
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