# 🔗 Microservice de raccourcissement d'URL

Un microservice Node.js/Express qui permet de créer des URLs courtes et de rediriger vers les URLs originales.

## 🎯 Objectif

Ce projet implémente un raccourcisseur d'URL conforme aux spécifications de freeCodeCamp qui permet de :
- Créer des URLs courtes à partir d'URLs longues
- Valider les URLs avec vérification DNS
- Rediriger automatiquement vers l'URL originale
- Éviter les doublons

## 🚀 Installation

### 1. Structure du projet

Assurez-vous d'avoir cette structure :

```
url-shortener/
├── server.js
├── package.json
├── views/
│   └── index.html
└── public/
    ├── style.css
    └── script.js
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer le serveur

```bash
npm start
```

Ou en mode développement :
```bash
npm run dev
```

### 4. Accéder à l'application

Ouvrez votre navigateur à `http://localhost:3000`

## 📋 API Documentation

### POST /api/shorturl

Créer une URL courte.

**Requête :**
```bash
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "url=https://www.freecodecamp.org"
```

**Réponse (succès) :**
```json
{
  "original_url": "https://www.freecodecamp.org",
  "short_url": 1
}
```

**Réponse (erreur) :**
```json
{
  "error": "invalid url"
}
```

### GET /api/shorturl/:short_url

Rediriger vers l'URL originale.

**Requête :**
```bash
curl -L http://localhost:3000/api/shorturl/1
```

**Résultat :** Redirection HTTP 302 vers l'URL originale

### GET /api/urls

Voir toutes les URLs enregistrées (utile pour le débogage).

**Requête :**
```bash
curl http://localhost:3000/api/urls
```

**Réponse :**
```json
{
  "count": 2,
  "urls": [
    {
      "original_url": "https://www.freecodecamp.org",
      "short_url": 1
    },
    {
      "original_url": "https://www.google.com",
      "short_url": 2
    }
  ]
}
```

## ✅ Tests de conformité freeCodeCamp

Le projet répond aux exigences suivantes :

1. ✅ Fournit une application personnalisée (pas l'URL d'exemple)
2. ✅ POST à `/api/shorturl` retourne un JSON avec `original_url` et `short_url`
3. ✅ GET à `/api/shorturl/<short_url>` redirige vers l'URL originale
4. ✅ Les URLs invalides retournent `{ error: 'invalid url' }`

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **CORS** - Middleware pour les requêtes cross-origin
- **Body-Parser** - Parsing des données POST
- **DNS (module natif)** - Validation des domaines

## 🔒 Validation des URLs

Le service effectue plusieurs validations :

1. **Format de l'URL** : Vérification que l'URL commence par `http://` ou `https://`
2. **Parsing de l'URL** : Utilisation de la classe `URL` native de Node.js
3. **Vérification DNS** : Utilisation de `dns.lookup()` pour vérifier que le domaine existe

### Exemples d'URLs valides :
- ✅ `https://www.freecodecamp.org`
- ✅ `http://www.google.com`
- ✅ `https://example.com/page?param=value`

### Exemples d'URLs invalides :
- ❌ `www.google.com` (pas de protocole)
- ❌ `ftp://example.com` (protocole non supporté)
- ❌ `https://invalid-domain-that-does-not-exist-123456.com` (DNS échoue)

## 💾 Stockage des données

**Mode actuel :** Stockage en mémoire (tableau JavaScript)
- Les données sont perdues au redémarrage du serveur
- Parfait pour le développement et les tests

**Pour la production :** Utilisez une base de données :
- MongoDB (avec Mongoose)
- PostgreSQL (avec Sequelize)
- Redis (pour les performances)

### Exemple de migration vers MongoDB :

```javascript
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

const Url = mongoose.model('Url', urlSchema);

// Remplacer urlDatabase.push() par :
const newUrl = new Url({
  original_url: originalUrl,
  short_url: currentId
});
await newUrl.save();
```

## 🌐 Déploiement

### Heroku

```bash
heroku create mon-url-shortener
git push heroku main
```

### Render / Railway

1. Connectez votre dépôt GitHub
2. Configurez le build command : `npm install`
3. Configurez le start command : `npm start`
4. Le port est automatiquement configuré via `process.env.PORT`

## 🧪 Tests

### Test manuel avec curl :

```bash
# Créer une URL courte
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "url=https://www.freecodecamp.org"

# Tester la redirection
curl -L http://localhost:3000/api/shorturl/1

# Tester une URL invalide
curl -X POST http://localhost:3000/api/shorturl \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "url=invalid-url"
```

### Test avec l'interface web :

1. Ouvrez `http://localhost:3000`
2. Entrez une URL valide (ex: `https://www.google.com`)
3. Cliquez sur "Raccourcir"
4. Copiez l'URL courte et testez-la dans votre navigateur

## 📊 Fonctionnalités supplémentaires

- **Détection des doublons** : Si une URL existe déjà, l'ID existant est retourné
- **Copie automatique** : Bouton pour copier l'URL courte dans le presse-papiers
- **Interface intuitive** : Design moderne et responsive
- **Documentation API intégrée** : Exemples de code directement dans l'interface

## 🔧 Améliorations possibles

- [ ] Ajouter une base de données persistante
- [ ] Implémenter une durée d'expiration pour les URLs
- [ ] Ajouter des statistiques (nombre de clics)
- [ ] Créer des URLs personnalisées (slugs)
- [ ] Ajouter l'authentification utilisateur
- [ ] Implémenter un système de QR codes
- [ ] Ajouter une API de recherche d'URLs

## 📄 Licence

MIT - Libre d'utilisation pour l'apprentissage et les projets personnels.

## 🎓 Crédits

Projet créé pour le défi freeCodeCamp : APIs and Microservices Certification - URL Shortener Microservice
