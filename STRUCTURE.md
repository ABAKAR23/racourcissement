# 📁 Structure du projet - URL Shortener

## Structure requise

Votre dossier doit avoir cette structure EXACTE :

```
url-shortener/
├── server.js           ← Serveur Express principal
├── package.json        ← Configuration et dépendances
├── .gitignore         ← Fichiers à ignorer par Git
├── README.md          ← Documentation complète
├── views/             ← DOSSIER pour les vues HTML
│   └── index.html    ← Page d'accueil
└── public/            ← DOSSIER pour les fichiers statiques
    ├── style.css     ← Feuille de style
    └── script.js     ← JavaScript côté client
```

## ✅ Checklist de vérification

### 1. Vérifier que les dossiers existent

Dans votre terminal, naviguez vers le dossier du projet :

**Windows :**
```cmd
cd C:\dev\url-shortener
dir
```

**Mac/Linux :**
```bash
cd ~/dev/url-shortener
ls -la
```

Vous devriez voir :
- ✅ `server.js`
- ✅ `package.json`
- ✅ `README.md`
- ✅ Dossier `views/`
- ✅ Dossier `public/`

### 2. Créer les dossiers si nécessaire

**Windows :**
```cmd
mkdir views
mkdir public
```

**Mac/Linux :**
```bash
mkdir views
mkdir public
```

### 3. Placer les fichiers aux bons endroits

**Déplacer les fichiers (Windows) :**
```cmd
move index.html views\index.html
move style.css public\style.css
move script.js public\script.js
```

**Déplacer les fichiers (Mac/Linux) :**
```bash
mv index.html views/index.html
mv style.css public/style.css
mv script.js public/script.js
```

### 4. Vérifier la structure finale

**Windows :**
```cmd
tree /F
```

**Mac/Linux :**
```bash
tree
# ou si tree n'est pas installé :
find . -type f -not -path "*/node_modules/*"
```

## 🚀 Démarrage

Une fois la structure en place :

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm start
```

## 🌐 Tester l'application

1. **Interface web :**
   - Ouvrez `http://localhost:3000` dans votre navigateur

2. **Test API avec curl :**
   ```bash
   # Créer une URL courte
   curl -X POST http://localhost:3000/api/shorturl \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "url=https://www.freecodecamp.org"
   ```

3. **Test de redirection :**
   ```bash
   curl -L http://localhost:3000/api/shorturl/1
   ```

## ❌ Erreurs courantes

### Erreur : "ENOENT: no such file or directory"

**Cause :** Les dossiers `views/` ou `public/` n'existent pas

**Solution :**
```bash
mkdir views
mkdir public
# Puis déplacer les fichiers comme indiqué ci-dessus
```

### Erreur : "Cannot find module 'express'"

**Cause :** Les dépendances ne sont pas installées

**Solution :**
```bash
npm install
```

### Erreur : "Port 3000 is already in use"

**Cause :** Un autre service utilise le port 3000

**Solution :**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [numéro_du_processus] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## 💡 Conseil

Si vous préférez tout créer automatiquement, vous pouvez utiliser ce script :

**Windows (PowerShell) :**
```powershell
# Créer la structure
New-Item -ItemType Directory -Force -Path views, public
```

**Mac/Linux (Bash) :**
```bash
# Script complet
mkdir -p views public
npm install
npm start
```

## 📦 Prêt pour le déploiement

Une fois que tout fonctionne localement :

1. **GitHub :**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [votre-repo]
   git push -u origin main
   ```

2. **Heroku / Render / Railway :**
   - Connectez votre dépôt GitHub
   - Le déploiement sera automatique !

## 🎯 Vérification finale

Avant de soumettre à freeCodeCamp, vérifiez que :

- [ ] `POST /api/shorturl` retourne `{ original_url, short_url }`
- [ ] `GET /api/shorturl/1` redirige vers l'URL originale
- [ ] Les URLs invalides retournent `{ error: 'invalid url' }`
- [ ] L'interface web fonctionne correctement

Bon courage ! 🚀
