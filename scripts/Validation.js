/* =============================================================
   GAMESTORE — assets/js/app.js
   Auteur   : Team B (Le Logicien)
   Rôle     : Logique CRUD — Jeux · Consoles · Accessoires
   Dépend de: index.html (Lead) + assets/css/style.css (Team A)
   ============================================================= */

"use strict";

/* =============================================================
   1. BASE DE DONNÉES (localStorage)
   Toutes les données sont persistées dans le navigateur.
   Clés utilisées :
     gs_jeux        → tableau de jeux
     gs_consoles    → tableau de consoles
     gs_accessoires → tableau d'accessoires
============================================================= */

const DB = {
  KEYS: {
    jeux:        "gs_jeux",
    consoles:    "gs_consoles",
    accessoires: "gs_accessoires",
  },

  /** Charge un tableau depuis localStorage */
  load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  },

  /** Sauvegarde un tableau dans localStorage */
  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  /** Génère un identifiant unique */
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },
};


/* =============================================================
   2. STORE — état global de l'application
   Toute modification passe par Store, jamais directement.
============================================================= */

const Store = {
  jeux:        DB.load(DB.KEYS.jeux),
  consoles:    DB.load(DB.KEYS.consoles),
  accessoires: DB.load(DB.KEYS.accessoires),

  // ---- JEUX ------------------------------------------------

  /** Ajoute un jeu et renvoie l'objet créé */
  ajouterJeu(data) {
    const jeu = { id: DB.uid(), ...data, createdAt: Date.now() };
    this.jeux.push(jeu);
    DB.save(DB.KEYS.jeux, this.jeux);
    return jeu;
  },

  /** Modifie un jeu existant (par id) */
  modifierJeu(id, data) {
    const idx = this.jeux.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.jeux[idx] = { ...this.jeux[idx], ...data, updatedAt: Date.now() };
    DB.save(DB.KEYS.jeux, this.jeux);
    return this.jeux[idx];
  },

  /** Supprime un jeu (par id) */
  supprimerJeu(id) {
    this.jeux = this.jeux.filter(j => j.id !== id);
    DB.save(DB.KEYS.jeux, this.jeux);
  },

  /** Trouve un jeu par id */
  trouverJeu(id) {
    return this.jeux.find(j => j.id === id) || null;
  },

  // ---- CONSOLES --------------------------------------------

  ajouterConsole(data) {
    const console_ = { id: DB.uid(), ...data, createdAt: Date.now() };
    this.consoles.push(console_);
    DB.save(DB.KEYS.consoles, this.consoles);
    return console_;
  },

  modifierConsole(id, data) {
    const idx = this.consoles.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.consoles[idx] = { ...this.consoles[idx], ...data, updatedAt: Date.now() };
    DB.save(DB.KEYS.consoles, this.consoles);
    return this.consoles[idx];
  },

  supprimerConsole(id) {
    this.consoles = this.consoles.filter(c => c.id !== id);
    DB.save(DB.KEYS.consoles, this.consoles);
  },

  trouverConsole(id) {
    return this.consoles.find(c => c.id === id) || null;
  },

  // ---- ACCESSOIRES -----------------------------------------

  ajouterAccessoire(data) {
    const acc = { id: DB.uid(), ...data, createdAt: Date.now() };
    this.accessoires.push(acc);
    DB.save(DB.KEYS.accessoires, this.accessoires);
    return acc;
  },

  modifierAccessoire(id, data) {
    const idx = this.accessoires.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.accessoires[idx] = { ...this.accessoires[idx], ...data, updatedAt: Date.now() };
    DB.save(DB.KEYS.accessoires, this.accessoires);
    return this.accessoires[idx];
  },

  supprimerAccessoire(id) {
    this.accessoires = this.accessoires.filter(a => a.id !== id);
    DB.save(DB.KEYS.accessoires, this.accessoires);
  },

  trouverAccessoire(id) {
    return this.accessoires.find(a => a.id === id) || null;
  },
};


/* =============================================================
   3. VALIDATION
   Chaque règle retourne null (OK) ou un message d'erreur (string).
   Les fonctions validateJeu / validateConsole / validateAccessoire
   retournent un objet { ok: bool, erreurs: { champ: message } }
============================================================= */

const Validate = {

  /** Champ texte obligatoire */
  requis(val, label) {
    return val.trim() === "" ? `${label} est obligatoire.` : null;
  },

  /** Longueur minimale */
  minLen(val, min, label) {
    return val.trim().length < min
      ? `${label} doit contenir au moins ${min} caractères.`
      : null;
  },

  /** Prix : obligatoire, numérique, strictement positif */
  prix(val) {
    if (val === "" || val === null) return "Le prix est obligatoire.";
    const n = parseFloat(val);
    if (isNaN(n))  return "Le prix doit être un nombre.";
    if (n < 0)     return "Le prix ne peut pas être négatif.";
    if (n === 0)   return "Le prix doit être supérieur à 0 FCFA.";
    return null;
  },

  /** Entier positif ou nul */
  entierPositif(val, label) {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0) return `${label} doit être un nombre ≥ 0.`;
    return null;
  },

  /** URL optionnelle mais valide si renseignée */
  urlOptionnel(val) {
    if (!val || val.trim() === "") return null;
    try { new URL(val); return null; }
    catch { return "L'URL est invalide (ex: https://exemple.com/img.jpg)."; }
  },

  /** Select obligatoire */
  select(val, label) {
    return !val || val === "" ? `Veuillez choisir ${label}.` : null;
  },

  // ----------------------------------------------------------

  jeu(data) {
    const e = {};
    const set = (k, msg) => { if (msg) e[k] = msg; };

    set("titre",      this.requis(data.titre, "Le titre"));
    set("titre",      e.titre || this.minLen(data.titre, 2, "Le titre"));
    set("editeur",    this.requis(data.editeur, "L'éditeur"));
    set("genre",      this.select(data.genre, "un genre"));
    set("plateforme", this.select(data.plateforme, "une plateforme"));
    set("prix",       this.prix(data.prix));
    set("pegi",       this.select(data.pegi, "une classification PEGI"));
    set("stock",      this.entierPositif(data.stock, "Le stock"));
    set("image",      this.urlOptionnel(data.image));

    return { ok: Object.keys(e).length === 0, erreurs: e };
  },

  console(data) {
    const e = {};
    const set = (k, msg) => { if (msg) e[k] = msg; };

    set("nom",      this.requis(data.nom, "Le nom"));
    set("marque",   this.select(data.marque, "une marque"));
    set("type",     this.select(data.type, "un type"));
    set("prix",     this.prix(data.prix));
    set("manettes", this.entierPositif(data.manettes, "Le nombre de manettes"));
    set("stock",    this.entierPositif(data.stock, "Le stock"));
    set("image",    this.urlOptionnel(data.image));

    return { ok: Object.keys(e).length === 0, erreurs: e };
  },

  accessoire(data) {
    const e = {};
    const set = (k, msg) => { if (msg) e[k] = msg; };

    set("nom",          this.requis(data.nom, "Le nom"));
    set("type",         this.select(data.type, "un type d'accessoire"));
    set("compatible",   this.requis(data.compatible, "La compatibilité"));
    set("prix",         this.prix(data.prix));
    set("stock",        this.entierPositif(data.stock, "Le stock"));
    set("image",        this.urlOptionnel(data.image));

    return { ok: Object.keys(e).length === 0, erreurs: e };
  },
};


/* =============================================================
   4. UI HELPERS
   Fonctions utilitaires pour manipuler le DOM.
   Le Lead définit les IDs dans index.html — on les cible ici.
============================================================= */

const UI = {

  /**
   * Affiche ou efface une erreur sous un champ.
   * Le Lead doit créer un <span id="err-CHAMP"> sous chaque input.
   * Le Designer ajoute .field-error / .field-success dans style.css.
   */
  setFieldError(champ, message) {
    const input = document.getElementById(champ);
    const span  = document.getElementById("err-" + champ);
    if (input) {
      input.classList.remove("field-success");
      input.classList.add("field-error");
    }
    if (span) span.textContent = "⚠ " + message;
  },

  clearFieldError(champ) {
    const input = document.getElementById(champ);
    const span  = document.getElementById("err-" + champ);
    if (input) {
      input.classList.remove("field-error");
      input.classList.add("field-success");
    }
    if (span) span.textContent = "✓";
  },

  /** Applique toutes les erreurs d'une validation */
  afficherErreurs(erreurs, champsConnus) {
    champsConnus.forEach(c => {
      if (erreurs[c]) this.setFieldError(c, erreurs[c]);
      else            this.clearFieldError(c);
    });
  },

  /** Efface tous les états de validation d'un formulaire */
  resetErreurs(champsConnus) {
    champsConnus.forEach(c => {
      const input = document.getElementById(c);
      const span  = document.getElementById("err-" + c);
      if (input) input.classList.remove("field-error", "field-success");
      if (span)  span.textContent = "";
    });
  },

  /**
   * Affiche un toast (notification temporaire).
   * Le Lead crée <div id="toast"></div> dans index.html.
   * Le Designer style #toast, #toast.show, #toast.error dans style.css.
   */
  toast(message, type = "success") {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = message;
    t.className   = "show " + type;       // classes gérées par Team A
    clearTimeout(UI._toastTimer);
    UI._toastTimer = setTimeout(() => { t.className = ""; }, 3500);
  },

  /**
   * Ouvre / ferme une modale.
   * Le Lead crée <div id="modal-ID" class="modal">…</div>.
   * Le Designer style .modal, .modal.open dans style.css.
   */
  ouvrirModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("open");
  },

  fermerModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("open");
  },

  /** Remplit un formulaire avec les données d'un produit existant (édition) */
  remplirFormulaire(prefixe, data) {
    Object.entries(data).forEach(([k, v]) => {
      const el = document.getElementById(prefixe + "-" + k);
      if (!el) return;
      if (el.type === "range") {
        el.value = v;
        const valEl = document.getElementById(prefixe + "-" + k + "-val");
        if (valEl) valEl.textContent = v;
      } else {
        el.value = v;
      }
    });
  },

  /** Vide un formulaire */
  viderFormulaire(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
  },

  /** Lit tous les champs d'un formulaire et retourne un objet data */
  lireFormulaire(prefixe, champs) {
    const data = {};
    champs.forEach(c => {
      const el = document.getElementById(prefixe + "-" + c);
      if (!el) return;
      data[c] = el.value.trim();
    });
    return data;
  },
};


/* =============================================================
   5. RENDU DES CARTES (render)
   Génère le HTML d'une carte produit.
   Le Designer applique les classes dans style.css.
   Convention de classes attendues par Team A :
     .card             → carte générique
     .card--jeu        → bordure couleur jeu    (ex: rouge)
     .card--console    → bordure couleur console (ex: violet)
     .card--accessoire → bordure couleur accessoire (ex: or)
     .card__img        → image du produit
     .card__body       → contenu texte
     .card__titre      → titre du produit
     .card__prix       → prix mis en avant
     .card__badge      → badge PEGI / type
     .card__actions    → boutons Modifier / Supprimer
     .btn-edit         → bouton édition
     .btn-delete       → bouton suppression
============================================================= */

const Render = {

  /** Formate un prix en FCFA */
  fcfa(n) {
    return Number(n).toLocaleString("fr-FR") + " FCFA";
  },

  /** Image de remplacement si aucune URL fournie */
  imgFallback(type) {
    const icons = { jeu: "🕹️", console: "🖥️", accessoire: "🎧" };
    return icons[type] || "📦";
  },

  carteJeu(jeu) {
    const img = jeu.image
      ? `<img class="card__img" src="${jeu.image}" alt="${jeu.titre}" onerror="this.replaceWith(document.createTextNode('🕹️'))">`
      : `<div class="card__img card__img--placeholder">🕹️</div>`;

    return `
      <article class="card card--jeu" data-id="${jeu.id}">
        ${img}
        <div class="card__body">
          <h3 class="card__titre">${jeu.titre}</h3>
          <p class="card__editeur">${jeu.editeur} · ${jeu.plateforme}</p>
          <span class="card__badge card__badge--genre">${jeu.genre}</span>
          <span class="card__badge card__badge--pegi">PEGI ${jeu.pegi}</span>
          <p class="card__prix">${this.fcfa(jeu.prix)}</p>
          <p class="card__stock">Stock : ${jeu.stock} ex.</p>
          ${jeu.description ? `<p class="card__desc">${jeu.description}</p>` : ""}
        </div>
        <div class="card__actions">
          <button class="btn-edit"   onclick="App.editerJeu('${jeu.id}')">✏️ Modifier</button>
          <button class="btn-delete" onclick="App.supprimerJeu('${jeu.id}')">🗑️ Supprimer</button>
        </div>
      </article>`;
  },

  carteConsole(console_) {
    const img = console_.image
      ? `<img class="card__img" src="${console_.image}" alt="${console_.nom}" onerror="this.replaceWith(document.createTextNode('🖥️'))">`
      : `<div class="card__img card__img--placeholder">🖥️</div>`;

    return `
      <article class="card card--console" data-id="${console_.id}">
        ${img}
        <div class="card__body">
          <h3 class="card__titre">${console_.nom}</h3>
          <p class="card__editeur">${console_.marque} · ${console_.type}</p>
          ${console_.couleur ? `<span class="card__badge">${console_.couleur}</span>` : ""}
          ${console_.stockage ? `<span class="card__badge">${console_.stockage}</span>` : ""}
          <p class="card__prix">${this.fcfa(console_.prix)}</p>
          <p class="card__stock">Stock : ${console_.stock} unité(s) · ${console_.manettes} manette(s) incluse(s)</p>
          ${console_.description ? `<p class="card__desc">${console_.description}</p>` : ""}
        </div>
        <div class="card__actions">
          <button class="btn-edit"   onclick="App.editerConsole('${console_.id}')">✏️ Modifier</button>
          <button class="btn-delete" onclick="App.supprimerConsole('${console_.id}')">🗑️ Supprimer</button>
        </div>
      </article>`;
  },

  carteAccessoire(acc) {
    const img = acc.image
      ? `<img class="card__img" src="${acc.image}" alt="${acc.nom}" onerror="this.replaceWith(document.createTextNode('🎧'))">`
      : `<div class="card__img card__img--placeholder">🎧</div>`;

    return `
      <article class="card card--accessoire" data-id="${acc.id}">
        ${img}
        <div class="card__body">
          <h3 class="card__titre">${acc.nom}</h3>
          <p class="card__editeur">${acc.type}</p>
          <span class="card__badge">${acc.compatible}</span>
          <p class="card__prix">${this.fcfa(acc.prix)}</p>
          <p class="card__stock">Stock : ${acc.stock} ex.</p>
          ${acc.description ? `<p class="card__desc">${acc.description}</p>` : ""}
        </div>
        <div class="card__actions">
          <button class="btn-edit"   onclick="App.editerAccessoire('${acc.id}')">✏️ Modifier</button>
          <button class="btn-delete" onclick="App.supprimerAccessoire('${acc.id}')">🗑️ Supprimer</button>
        </div>
      </article>`;
  },

  /** Affiche toutes les cartes dans le conteneur correspondant */
  afficherJeux() {
    const c = document.getElementById("liste-jeux");
    if (!c) return;
    c.innerHTML = Store.jeux.length
      ? Store.jeux.map(j => this.carteJeu(j)).join("")
      : `<p class="empty-msg">Aucun jeu en catalogue.</p>`;
  },

  afficherConsoles() {
    const c = document.getElementById("liste-consoles");
    if (!c) return;
    c.innerHTML = Store.consoles.length
      ? Store.consoles.map(cs => this.carteConsole(cs)).join("")
      : `<p class="empty-msg">Aucune console en catalogue.</p>`;
  },

  afficherAccessoires() {
    const c = document.getElementById("liste-accessoires");
    if (!c) return;
    c.innerHTML = Store.accessoires.length
      ? Store.accessoires.map(a => this.carteAccessoire(a)).join("")
      : `<p class="empty-msg">Aucun accessoire en catalogue.</p>`;
  },
};


/* =============================================================
   6. APP — contrôleur principal
   Méthodes appelées depuis index.html via onclick="App.xxx()"
   ou depuis les écouteurs d'événements en bas de fichier.
============================================================= */

const App = {

  // ── Champs de chaque formulaire ──────────────────────────
  CHAMPS_JEU:        ["titre", "editeur", "genre", "plateforme", "prix", "date", "pegi", "stock", "image", "description"],
  CHAMPS_CONSOLE:    ["nom", "marque", "type", "prix", "couleur", "stockage", "manettes", "stock", "image", "description"],
  CHAMPS_ACCESSOIRE: ["nom", "type", "compatible", "marque", "prix", "stock", "image", "description"],

  // ── État interne (id du produit en cours d'édition) ──────
  _editJeuId:        null,
  _editConsoleId:    null,
  _editAccessoireId: null,

  /* ----------------------------------------------------------
     JEUX
  ---------------------------------------------------------- */

  /** Soumet le formulaire jeu (ajout OU modification) */
  soumettreJeu() {
    const data = UI.lireFormulaire("jeu", this.CHAMPS_JEU);
    const { ok, erreurs } = Validate.jeu(data);
    UI.afficherErreurs(erreurs, this.CHAMPS_JEU);

    if (!ok) {
      UI.toast("⚠ Corrige les erreurs avant de continuer.", "error");
      return;
    }

    if (this._editJeuId) {
      // MODE MODIFICATION
      Store.modifierJeu(this._editJeuId, data);
      UI.toast("✅ Jeu modifié avec succès !");
      this._editJeuId = null;
      // Remettre le bouton submit en mode "Ajouter"
      const btn = document.getElementById("btn-submit-jeu");
      if (btn) btn.textContent = "Ajouter le jeu";
    } else {
      // MODE AJOUT
      Store.ajouterJeu(data);
      UI.toast("✅ Jeu ajouté avec succès !");
    }

    UI.viderFormulaire("form-jeu");
    UI.resetErreurs(this.CHAMPS_JEU);
    UI.fermerModal("modal-jeu");
    Render.afficherJeux();
  },

  /** Prépare le formulaire jeu en mode édition */
  editerJeu(id) {
    const jeu = Store.trouverJeu(id);
    if (!jeu) return;
    this._editJeuId = id;
    UI.remplirFormulaire("jeu", jeu);
    UI.resetErreurs(this.CHAMPS_JEU);
    // Change le texte du bouton submit
    const btn = document.getElementById("btn-submit-jeu");
    if (btn) btn.textContent = "💾 Enregistrer les modifications";
    UI.ouvrirModal("modal-jeu");
  },

  /** Supprime un jeu après confirmation */
  supprimerJeu(id) {
    const jeu = Store.trouverJeu(id);
    if (!jeu) return;
    if (!confirm(`Supprimer "${jeu.titre}" ? Cette action est irréversible.`)) return;
    Store.supprimerJeu(id);
    Render.afficherJeux();
    UI.toast("🗑️ Jeu supprimé.");
  },

  /** Annule l'édition jeu et vide le formulaire */
  annulerJeu() {
    this._editJeuId = null;
    UI.viderFormulaire("form-jeu");
    UI.resetErreurs(this.CHAMPS_JEU);
    const btn = document.getElementById("btn-submit-jeu");
    if (btn) btn.textContent = "Ajouter le jeu";
    UI.fermerModal("modal-jeu");
  },

  /* ----------------------------------------------------------
     CONSOLES
  ---------------------------------------------------------- */

  soumettreConsole() {
    const data = UI.lireFormulaire("console", this.CHAMPS_CONSOLE);
    const { ok, erreurs } = Validate.console(data);
    UI.afficherErreurs(erreurs, this.CHAMPS_CONSOLE);

    if (!ok) {
      UI.toast("⚠ Corrige 
