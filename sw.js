// Nom du cache : changer v1 en v2 pour forcer une mise à jour chez les utilisateurs
const CACHE_NAME = 'annuaire-v1';

// Liste des fichiers à mettre en cache pour le mode hors ligne
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Étape 1 : Installation - on télécharge et on stocke les fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force le nouveau service worker à s'activer de suite
});

// Étape 2 : Activation - on supprime les anciens caches inutiles
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Étape 3 : Interception des requêtes - on sert les fichiers du cache en priorité
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Si le fichier est en cache, on le donne. Sinon, on va sur le réseau.
      return response || fetch(e.request);
    })
  );
});
