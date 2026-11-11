// Service Worker: App offline verfügbar machen. Bei jeder Änderung VERSION erhöhen.
const VERSION = 'lernapp-v1.0.0';
const CORE = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'js/app.js', 'js/nav.js', 'js/ui.js', 'js/db.js', 'js/store.js', 'js/io.js', 'js/ocr.js', 'js/speech.js',
  'js/pages/area.js', 'js/pages/quiz.js', 'js/pages/notes.js', 'js/pages/grammar.js', 'js/pages/speak.js',
  'js/engines/latin.js', 'js/engines/french.js', 'js/engines/english.js', 'js/engines/med.js',
  'js/content/grammar-en.js', 'js/content/grammar-fr.js', 'js/content/grammar-la.js', 'js/content/grammar-med.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)));
});
self.addEventListener('message', (e) => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== 'lernapp-cdn').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Texterkennung (Bibliothek + Sprachdaten) nach dem ersten Laden offline vorhalten
  if (url.hostname === 'cdn.jsdelivr.net' || url.hostname.endsWith('tessdata.projectnaptha.com')) {
    e.respondWith(caches.open('lernapp-cdn').then(async (c) => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok) c.put(e.request, res.clone());
      return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // App-Dateien: Cache zuerst, sonst Netz
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('index.html'))));
});
