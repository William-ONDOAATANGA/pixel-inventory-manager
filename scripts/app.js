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