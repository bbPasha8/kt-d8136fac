/* Servis calisani: uygulamanin dosyalarini cihazda saklar; internet yokken de acilir. Verilere dokunmaz (veri kasasi ayri). */
const SURUM = "kalori-20261018113700";
const OZ = ["./", "index.html", "app.css", "veri.js", "app.js", "ikon.svg", "ikon-180.png", "ikon-192.png", "ikon-512.png", "manifest.webmanifest", "veri/cekirdek.json", "veri/pdfjs/pdf.min.js", "veri/pdfjs/pdf.worker.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(OZ)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.includes("/api/") || u.pathname.endsWith(".apk") || u.pathname.endsWith("sw.js")) return;   // sunucu istekleri hep aga gider
  e.respondWith(caches.open(SURUM).then(async c => {
    const m = await c.match(e.request, {ignoreSearch: true});
    const ag = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => m || c.match("index.html"));
    return m || ag;       // once onbellek (hizli/cevrimdisi), arkada guncelle
  }));
});
