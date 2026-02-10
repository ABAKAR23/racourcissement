// Éléments du DOM
const shortenForm = document.getElementById('shortenForm');
const urlInput = document.getElementById('urlInput');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const originalUrlDiv = document.getElementById('originalUrl');
const shortUrlDiv = document.getElementById('shortUrl');
const shortIdSpan = document.getElementById('shortId');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');
const testBtn = document.getElementById('testBtn');
const testId = document.getElementById('testId');

// Fonction pour masquer les résultats et erreurs
function hideResults() {
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
}

// Gestionnaire de soumission du formulaire
shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideResults();

    const url = urlInput.value.trim();

    // Validation côté client
    if (!url) {
        showError('Veuillez entrer une URL');
        return;
    }

    try {
        // Envoyer la requête POST
        const response = await fetch('/api/shorturl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(url)}`
        });

        const data = await response.json();

        if (data.error) {
            showError(data.error === 'invalid url' 
                ? '❌ URL invalide. Assurez-vous qu\'elle commence par http:// ou https://' 
                : data.error);
        } else {
            showSuccess(data);
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
        console.error('Erreur:', error);
    }
});

// Afficher le succès
function showSuccess(data) {
    const baseUrl = window.location.origin;
    const shortUrl = `${baseUrl}/api/shorturl/${data.short_url}`;

    originalUrlDiv.textContent = data.original_url;
    shortUrlDiv.textContent = shortUrl;
    shortIdSpan.textContent = data.short_url;

    // Stocker l'URL courte pour la copie
    shortUrlDiv.dataset.url = shortUrl;

    resultDiv.classList.remove('hidden');

    // Animation
    resultDiv.style.opacity = '0';
    setTimeout(() => {
        resultDiv.style.transition = 'opacity 0.5s ease';
        resultDiv.style.opacity = '1';
    }, 10);
}

// Afficher l'erreur
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');

    // Animation
    errorDiv.style.opacity = '0';
    setTimeout(() => {
        errorDiv.style.transition = 'opacity 0.5s ease';
        errorDiv.style.opacity = '1';
    }, 10);
}

// Copier l'URL courte
copyBtn.addEventListener('click', async () => {
    const shortUrl = shortUrlDiv.dataset.url;

    try {
        await navigator.clipboard.writeText(shortUrl);
        
        // Feedback visuel
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copié !';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#3b82f6';
        }, 2000);
    } catch (err) {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = shortUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            copyBtn.textContent = '✅ Copié !';
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.textContent = '📋 Copier';
                copyBtn.style.background = '#3b82f6';
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
        
        document.body.removeChild(textArea);
    }
});

// Tester une URL courte
testBtn.addEventListener('click', () => {
    const id = testId.value.trim();

    if (!id) {
        alert('Veuillez entrer un ID');
        return;
    }

    // Ouvrir l'URL dans un nouvel onglet
    const testUrl = `${window.location.origin}/api/shorturl/${id}`;
    window.open(testUrl, '_blank');
});

// Permettre de tester en appuyant sur Entrée
testId.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        testBtn.click();
    }
});

// Effacer les messages d'erreur lors de la saisie
urlInput.addEventListener('input', () => {
    hideResults();
});

// Message de bienvenue dans la console
console.log('%c🔗 Raccourcisseur d\'URL', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cAPI disponible:', 'font-weight: bold;');
console.log('POST /api/shorturl - Créer une URL courte');
console.log('GET /api/shorturl/:id - Rediriger vers l\'URL originale');
console.log('GET /api/urls - Voir toutes les URLs');
