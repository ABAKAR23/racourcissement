const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Base de données en mémoire pour stocker les URLs
// Dans une vraie application, utilisez une base de données (MongoDB, PostgreSQL, etc.)
const urlDatabase = [];
let currentId = 1;

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Fonction pour valider une URL
function isValidUrl(urlString) {
  try {
    const parsedUrl = new URL(urlString);
    // Vérifier que le protocole est http ou https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    return parsedUrl;
  } catch (err) {
    return false;
  }
}

// POST endpoint pour créer une URL courte
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  console.log('Nouvelle URL reçue:', originalUrl);

  // Validation de base de l'URL
  const parsedUrl = isValidUrl(originalUrl);
  
  if (!parsedUrl) {
    console.log('URL invalide (format)');
    return res.json({ error: 'invalid url' });
  }

  // Vérification DNS pour s'assurer que le domaine existe
  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (err) {
      console.log('URL invalide (DNS):', err.message);
      return res.json({ error: 'invalid url' });
    }

    console.log('DNS validé:', parsedUrl.hostname, '->', address);

    // Vérifier si l'URL existe déjà dans la base de données
    const existingUrl = urlDatabase.find(item => item.original_url === originalUrl);
    
    if (existingUrl) {
      // L'URL existe déjà, retourner l'ID existant
      console.log('URL existante trouvée:', existingUrl);
      return res.json({
        original_url: existingUrl.original_url,
        short_url: existingUrl.short_url
      });
    }

    // Créer une nouvelle entrée
    const newUrl = {
      original_url: originalUrl,
      short_url: currentId
    };

    urlDatabase.push(newUrl);
    console.log('Nouvelle URL créée:', newUrl);
    console.log('Base de données:', urlDatabase);
    currentId++;

    res.json({
      original_url: newUrl.original_url,
      short_url: newUrl.short_url
    });
  });
});

// GET endpoint pour rediriger vers l'URL originale
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  
  console.log('Redirection demandée pour:', req.params.short_url);
  console.log('Converti en nombre:', shortUrl);
  console.log('Base de données actuelle:', urlDatabase);

  // Vérifier si c'est un nombre valide
  if (isNaN(shortUrl)) {
    console.log('Erreur: format invalide');
    return res.json({ error: 'Wrong format' });
  }

  // Chercher l'URL dans la base de données
  const urlEntry = urlDatabase.find(item => item.short_url === shortUrl);

  if (!urlEntry) {
    console.log('Erreur: URL non trouvée');
    return res.json({ error: 'No short URL found for the given input' });
  }

  console.log('Redirection vers:', urlEntry.original_url);
  // Rediriger vers l'URL originale avec code 302
  return res.redirect(302, urlEntry.original_url);
});

// Route pour afficher toutes les URLs (utile pour le débogage)
app.get('/api/urls', (req, res) => {
  res.json({
    count: urlDatabase.length,
    urls: urlDatabase
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Le serveur écoute sur le port ${PORT}`);
  console.log(`📍 Visitez http://localhost:${PORT}`);
});