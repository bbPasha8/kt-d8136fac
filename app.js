"use strict";
/* Kalori Takip: yerel-oncelikli uygulama. Veri once cihazda (localStorage) tutulur; sunucu esitleme istege baglidir. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const kac = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const ms = () => Date.now();
const tarihStr = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const BUGUN = () => tarihStr(new Date());
const gunEkle = (t, n) => { const d = new Date(t + "T12:00:00"); d.setDate(d.getDate() + n); return tarihStr(d); };
const GUN_AD = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const tarihYaz = t => { const d = new Date(t + "T12:00:00"), b = BUGUN(); return t === b ? "Bugün" : t === gunEkle(b, -1) ? "Dün" : t === gunEkle(b, 1) ? "Yarın" : d.toLocaleDateString("tr-TR", {day: "numeric", month: "long", weekday: "short"}); };
const yuvarla = (x, n = 0) => { const k = 10 ** n; return Math.round(x * k) / k; };

/* ---------- ikonlar (24x24 cizgi) ---------- */
const IC = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
  leaf: '<path d="M20 4C9 4 4 9 4 16c0 2 .5 3 .5 3S6 20 8 20c7 0 12-5 12-16z"/><path d="M4 20c2-6 6-10 11-12"/>',
  heart: '<path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 10-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 000-7.8z"/><path d="M3 12h4l2-3 3 6 2-3h7"/>',
  pill: '<path d="M10.5 20.5a5 5 0 01-7-7l10-10a5 5 0 017 7z"/><path d="M8.5 8.5l7 7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  flame: '<path d="M12 2s5 4.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" fill="currentColor" stroke="none"/>',
  check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  chevL: '<path d="M15 5l-7 7 7 7"/>', chevR: '<path d="M9 5l7 7-7 7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>', cloud: '<path d="M7 18a5 5 0 010-10 6 6 0 0111.5 2A4 4 0 0118 18z"/>',
  cloudoff: '<path d="M3 3l18 18M7 18a5 5 0 01-1-9.8M10 6a6 6 0 018.5 4.5A4 4 0 0118 18H9"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>', scale: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 9a5 5 0 018 0M12 13l2-3"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 19a2 2 0 001.7 3h11.6a2 2 0 001.7-3L14 9V3"/><path d="M7 15h10"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 00-2.3-1.3L14 3h-4l-.3 2.4a7 7 0 00-2.3 1.3l-2.3-.9-2 3.4 2 1.5a7 7 0 000 2.6l-2 1.5 2 3.4 2.3-.9a7 7 0 002.3 1.3L10 21h4l.3-2.4a7 7 0 002.3-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/>',
  down: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16"/>', up: '<path d="M12 21V9m0 0l-4 4m4-4l4 4M4 4h16"/>',
  fire: '<path d="M12 2c1 4 6 6 6 12a6 6 0 01-12 0c0-3 2-4 2-7 2 1 3 3 3 3 1-3 0-5 1-8z"/>', trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>'
};
const ic = (n, c = "") => `<svg class="i ${c}" viewBox="0 0 24 24">${IC[n] || ""}</svg>`;

/* ---------- durum ---------- */
const VARSAYILAN_AYAR = {id: "ayar", u: 0, ad: "", cins: "e", yas: 30, boy: 175, kilo: 75, kcal: 2200, protein: 180, yag: 40, karb: 250,
  p_oto: 0, y_oto: 0, k_oto: 1, p_pct: 34, y_pct: 33, k_pct: 33, devir: 1, su: 2500, mikroCarpan: {}, kanOtomatik: 1};
const KOLS = ["girisler", "kilolar", "kanlar", "sular", "ozel", "takviyeler"];
const S = {kul: null, sun: null, profil: null, vkey: null, vtuz: null, sunucuUrl: "", sunucuVar: false, ilk: false, veri: null, sek: "bugun", gun: BUGUN(), esit: false, since: 0, pushU: 0,
  yon: 30, yemekler: [], onizleme: null, aralik: "bugun", kayitta: false, sonEsit: null, esitHata: ""};
const LS = {get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }, del: k => { try { localStorage.removeItem(k); } catch (e) {} }};
const bosVeri = () => ({girisler: [], kilolar: [], kanlar: [], sular: [], ozel: [], takviyeler: [], ayar: {...VARSAYILAN_AYAR}});
const A = () => S.veri.ayar;
const liste = k => S.veri[k].filter(x => !x.d);

/* ---- sifreli kasa: veri bu cihazda AES-GCM-256 ile saklanir; anahtar parolandan PBKDF2 (250k) ile turetilir, yalniz bellekte durur ---- */
const KRIPTO = !!(window.crypto && crypto.subtle);
const b64 = u => { let t = ""; for (let i = 0; i < u.length; i += 0x8000) t += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(t); };
const unb64 = t => Uint8Array.from(atob(t), c => c.charCodeAt(0));
async function turetAnahtar(parola, tuz) {
  const m = await crypto.subtle.importKey("raw", new TextEncoder().encode(parola), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({name: "PBKDF2", salt: tuz, iterations: 250000, hash: "SHA-256"}, m, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
}
async function sifrele(anahtar, nesne) {
  const iv = crypto.getRandomValues(new Uint8Array(12)), ct = await crypto.subtle.encrypt({name: "AES-GCM", iv}, anahtar, new TextEncoder().encode(JSON.stringify(nesne)));
  return {iv: b64(iv), ct: b64(new Uint8Array(ct))};
}
async function sifreCoz(anahtar, iv, ct) { return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name: "AES-GCM", iv: unb64(iv)}, anahtar, unb64(ct)))); }
const profiller = () => { try { return JSON.parse(LS.get("kt.profiller") || "[]"); } catch (e) { return []; } };
const profilKaydetListe = l => LS.set("kt.profiller", JSON.stringify(l));
const taban = () => (S.sun && S.sun.url) || S.sunucuUrl || "";
function veriDuzelt(v) {
  const o = Object.assign(bosVeri(), v || {}); o.ayar = Object.assign({}, VARSAYILAN_AYAR, o.ayar); S.veri = o; S.since = o._since || 0; S.pushU = o._pushU || 0;
}
function baglantiKur() { S.kul = S.sun && S.sun.jeton ? S.sun : null; S.esit = !!(S.kul && S.sun.esit !== false); }
let kayitZaman = 0, kayitKuyruk = Promise.resolve();
function kaydet() { clearTimeout(kayitZaman); kayitZaman = setTimeout(vaultKaydet, 250); }
function vaultKaydet() {
  if (!S.profil || !S.veri) return Promise.resolve();
  S.veri._since = S.since; S.veri._pushU = S.pushU; const yuk = {veri: JSON.parse(JSON.stringify(S.veri)), sun: S.sun ? {...S.sun} : null}, key = S.vkey, ad = S.profil, tuz = S.vtuz;
  kayitKuyruk = kayitKuyruk.then(async () => {
    if (key) { const {iv, ct} = await sifrele(key, yuk); LS.set("kt.v." + ad, JSON.stringify({s: 1, tuz: b64(tuz), iv, ct})); } else LS.set("kt.v." + ad, JSON.stringify({s: 0, yuk}));
  }).catch(() => {});
  return kayitKuyruk;
}
async function profilOlustur(ad, parola, ilkVeri, sun) {
  ad = (ad || "").trim(); if (!/^[^<>\/\\]{1,32}$/.test(ad)) throw new Error("Profil adı 1-32 karakter olmalı");
  if (profiller().some(p => p.ad.toLowerCase() === ad.toLowerCase())) throw new Error("Bu adla profil var");
  if (KRIPTO && (parola || "").length < 6) throw new Error("Parola en az 6 karakter olmalı");
  S.profil = ad; veriDuzelt(ilkVeri); S.sun = sun || null; baglantiKur();
  if (KRIPTO) { S.vtuz = crypto.getRandomValues(new Uint8Array(16)); S.vkey = await turetAnahtar(parola, S.vtuz); } else { S.vkey = null; S.vtuz = null; }
  const l = profiller(); l.push({ad, sifreli: !!KRIPTO, tarih: BUGUN()}); profilKaydetListe(l); await vaultKaydet(); LS.set("kt.sonProfil", ad);
}
async function profilAc(ad, parola) {
  const ham = LS.get("kt.v." + ad); if (!ham) throw new Error("Profil bulunamadı"); const k = JSON.parse(ham); let yuk;
  if (k.s === 1) {
    if (!KRIPTO) throw new Error("Bu tarayıcı şifre çözmeyi desteklemiyor (HTTPS gerekir)");
    const tuz = unb64(k.tuz), key = await turetAnahtar(parola, tuz);
    try { yuk = await sifreCoz(key, k.iv, k.ct); } catch (e) { throw new Error("Parola yanlış"); }
    S.vkey = key; S.vtuz = tuz;
  } else { yuk = k.yuk; S.vkey = null; S.vtuz = null; }
  S.profil = ad; veriDuzelt(yuk.veri); S.sun = yuk.sun || null; baglantiKur(); LS.set("kt.sonProfil", ad);
  if (S.sun && S.sun.url) { S.sunucuUrl = S.sun.url; S.sunucuVar = true; }
}
function kilitle() {
  vaultKaydet().then(() => { S.vkey = null; S.veri = null; S.kul = null; S.sun = null; S.esit = false; S.profil = null; sheetKapat(); $("#sesPanel")?.remove(); karsilama("kilit"); });
}
function eskiKayitlar() { const l = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("kt.veri.")) l.push(k); } } catch (e) {} return l; }
let esitZaman = 0;
function degisti() { kaydet(); clearTimeout(esitZaman); if (S.kul && S.esit) esitZaman = setTimeout(() => esitle(), 1500); }
function ekle(kol, o) { o.id = o.id || uid(); o.u = ms(); S.veri[kol].push(o); degisti(); return o; }
function yama(kol, id, p) { const o = S.veri[kol].find(x => x.id === id); if (!o) return; Object.assign(o, p, {u: ms()}); degisti(); }
function sil(kol, id) { yama(kol, id, {d: 1}); }
function ayarYama(p) { S.veri.ayar = Object.assign({}, A(), p, {u: ms()}); degisti(); }
function upsert(kol, id, o) { const m = S.veri[kol].find(x => x.id === id); m ? yama(kol, id, Object.assign({d: 0}, o)) : ekle(kol, Object.assign({id}, o)); }

/* ---------- sunucu ---------- */
async function api(yontem, yol, govde, ham) {
  const h = {"X-Kalori": "1"}; if (S.kul) h.Authorization = "Bearer " + S.kul.jeton;
  if (!ham) h["Content-Type"] = "application/json";
  const r = await fetch(taban() + yol, {method: yontem, headers: h, body: ham ? govde : govde ? JSON.stringify(govde) : undefined});
  let j = {}; try { j = await r.json(); } catch (e) {}
  if (!r.ok) { const e = new Error(j.hata || "hata"); e.durum = r.status; throw e; }
  return j;
}
let esitSurer = false;
async function esitle() {
  if (!S.kul || !S.esit || esitSurer) return; esitSurer = true;
  const degisen = {}; for (const k of KOLS) { const l = S.veri[k].filter(x => x.u > S.pushU); if (l.length) degisen[k] = l; }
  if (A().u > S.pushU) degisen.ayar = [A()];
  const t0 = ms();
  try {
    const r = await api("POST", "/api/esitle", {since: S.since, degisen});
    for (const [kol, belgeler] of Object.entries(r.gelen || {})) for (const d of belgeler) {
      if (kol === "ayar") { if (d.u > A().u) S.veri.ayar = Object.assign({}, VARSAYILAN_AYAR, d); continue; }
      const i = S.veri[kol].findIndex(x => x.id === d.id);
      if (i < 0) S.veri[kol].push(d); else if (d.u > S.veri[kol][i].u) S.veri[kol][i] = d;
    }
    S.since = r.sv; S.pushU = t0; S.sonEsit = new Date(); S.esitHata = ""; kaydet(); simgeGuncelle();
    if (Object.keys(r.gelen || {}).length) ciz();
  } catch (e) {
    S.esitHata = e.durum === 401 ? "Sunucu oturumu bitti; Profil'den yeniden bağlan" : "Çevrimdışı (değişiklikler cihazda, bağlanınca gönderilir)";
    if (e.durum === 401 && S.sun) { S.sun.jeton = null; baglantiKur(); vaultKaydet(); ciz(); }
    simgeGuncelle();
  } finally { esitSurer = false; }
}

/* ---------- hesaplar ---------- */
const cins = () => A().cins === "k" ? 1 : 0;
function girisGun(t) { return liste("girisler").filter(g => g.tarih === t); }
function gunToplam(t) {
  const o = {kcal: 0, protein: 0, yag: 0, karb: 0, mikro: {}};
  for (const g of girisGun(t)) {
    o.kcal += g.kcal || 0; o.protein += g.protein || 0; o.yag += g.yag || 0; o.karb += g.karb || 0;
    for (const [k, v] of Object.entries(g.mikro || {})) o.mikro[k] = (o.mikro[k] || 0) + v;
  }
  return o;
}
function makroHedef(kcal) {
  const a = A(), kat = {protein: 4, yag: 9, karb: 4}, oto = [["protein", "p_oto"], ["yag", "y_oto"], ["karb", "k_oto"]].filter(([, f]) => +a[f]).map(x => x[0]);
  const pct = {protein: +a.p_pct, yag: +a.y_pct, karb: +a.k_pct};
  const kalan = Math.max(0, kcal - Object.keys(kat).filter(k => !oto.includes(k)).reduce((t, k) => t + a[k] * kat[k], 0));
  const h = {kcal: Math.round(kcal), protein: Math.round(a.protein), yag: Math.round(a.yag), karb: Math.round(a.karb)};
  if (oto.length === 1) h[oto[0]] = Math.round(kalan / kat[oto[0]]);
  else if (oto.length > 1) { const top = oto.reduce((t, k) => t + pct[k], 0) || 1; oto.forEach(k => h[k] = Math.round(kalan * pct[k] / top / kat[k])); }
  return h;
}
function etkinKcal(t) {
  const taban = +A().kcal; if (!+A().devir) return {kcal: taban, asim: 0};
  const onceki = gunEkle(t, -1); if (!girisGun(onceki).length) return {kcal: taban, asim: 0};
  const asim = Math.max(0, gunToplam(onceki).kcal - taban);
  return {kcal: Math.max(1200, taban - asim), asim: Math.round(asim)};
}
function seriHesapla() {
  const gunler = new Set(liste("girisler").filter(g => !g.takviye).map(g => g.tarih));
  let t = BUGUN(); const bugunVar = gunler.has(t); if (!bugunVar) t = gunEkle(t, -1);
  let n = 0; while (gunler.has(t)) { n++; t = gunEkle(t, -1); }
  const sirali = [...gunler].sort(); let en = 0, c = 0, onc = null;
  for (const g of sirali) { c = onc && gunEkle(onc, 1) === g ? c + 1 : 1; en = Math.max(en, c); onc = g; }
  return {suan: n, enIyi: Math.max(en, n), bugunVar, gunler, toplam: gunler.size};
}
function kanSon() { const m = {}; for (const k of liste("kanlar")) if (!m[k.test] || k.tarih > m[k.test].tarih || (k.tarih === m[k.test].tarih && k.u > m[k.test].u)) m[k.test] = k; return m; }
function kanOneriler() {
  const o = {}; if (!+A().kanOtomatik) return o;
  for (const [k, kayit] of Object.entries(kanSon())) {
    const t = KAN_HARITA[k]; if (!t || !t.mikro) continue;
    const d = kanDurum(t, kayit.deger, A().cins), c = t.carpan[d];
    if (c && (!o[t.mikro] || c > o[t.mikro].carpan)) o[t.mikro] = {carpan: c, neden: `${t.ad} ${DURUM_AD[d].toLowerCase()} (${kayit.deger} ${t.br})`};
  }
  return o;
}
function mikroHedef(k) {
  const m = MIKRO_HARITA[k], taban = m.rda[cins()], el = A().mikroCarpan[k], oto = kanOneriler()[k];
  const carpan = el != null ? +el : oto ? oto.carpan : 1;
  return {hedef: taban * carpan, taban, carpan, kaynak: el != null ? "elle" : oto ? oto.neden : ""};
}
function aralikToplam(gunSayisi) {
  const bugun = BUGUN(), top = {}; let gunler = 0;
  for (let i = 0; i < gunSayisi; i++) {
    const t = gunEkle(bugun, -i), x = gunToplam(t); if (!girisGun(t).length) continue; gunler++;
    for (const [k, v] of Object.entries(x.mikro)) top[k] = (top[k] || 0) + v;
  }
  for (const k of Object.keys(top)) top[k] /= Math.max(1, gunler);
  return {top, gunler};
}

/* ---------- yemek listesi ---------- */
async function yemekleriYukle() {
  let cek = window.CEKIRDEK;
  if (!cek) { try { cek = await (await fetch("veri/cekirdek.json")).json(); } catch (e) { cek = []; } }
  S.cekirdek = cek; yemekIndeksiYenile();
}
function yemekIndeksiYenile() {
  const ozel = liste("ozel").map(o => ({ad: o.ad, kcal: o.kcal, protein: o.protein, yag: o.yag, karb: o.karb, birim: o.birim || {}, takma: [], mikro: o.mikro || null, ozel: 1}));
  S.yemekler = yiyecekIndeksle(ozel.concat(S.cekirdek || []).map(y => ({...y})));
}

/* ---------- arayuz yardimcilari ---------- */
function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3300); if (navigator.vibrate) navigator.vibrate(12); }
function sheetAc(html) {
  sheetKapat();
  const p = document.createElement("div"); p.className = "perde"; p.id = "perde"; p.onclick = sheetKapat;
  const s = document.createElement("div"); s.className = "sheet"; s.id = "sheet"; s.innerHTML = html;
  document.body.append(p, s); setTimeout(dolum, 30);
}
function sheetKapat() { $("#perde")?.remove(); $("#sheet")?.remove(); }
document.addEventListener("pointerdown", e => {
  const b = e.target.closest("button.btn,button.ikbtn,button.fab"); if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement("span"); s.className = "ripple";
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`; b.appendChild(s); setTimeout(() => s.remove(), 650);
});
function halka(boyut, kal, oran, renk, ic) {
  const r = (boyut - kal) / 2, c = 2 * Math.PI * r;
  return `<div class="halka" style="width:${boyut}px;height:${boyut}px"><svg width="${boyut}" height="${boyut}"><circle class="iz" cx="${boyut / 2}" cy="${boyut / 2}" r="${r}" stroke-width="${kal}"/>
  <circle class="ds" cx="${boyut / 2}" cy="${boyut / 2}" r="${r}" stroke="${renk}" stroke-width="${kal}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-c="${c}" data-o="${oran}"/></svg><div class="orta">${ic}</div></div>`;
}
function dolum() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$("[data-o]").forEach(e => e.style.strokeDashoffset = (+e.dataset.c * (1 - Math.min(1, Math.max(0, +e.dataset.o)))).toFixed(1));
    $$("[data-w]").forEach(e => e.style.width = Math.min(100, +e.dataset.w) + "%");
    $$("[data-say]").forEach(e => { if (e.dataset.bitti) return; e.dataset.bitti = 1; const h = +e.dataset.say, t0 = performance.now();
      (function f(t) { const p = Math.max(0, Math.min(1, (t - t0) / 900)), k = 1 - Math.pow(1 - p, 3); e.textContent = Math.round(h * k); if (p < 1) requestAnimationFrame(f); })(t0); });
  }));
}
function konfeti() {
  const c = $("#konfeti"), x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
  const renk = ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#ef4444"], p = Array.from({length: 120}, () => ({x: innerWidth / 2, y: innerHeight * .4, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 3, c: renk[Math.random() * 6 | 0], a: Math.random() * 6}));
  let n = 0; (function f() { x.clearRect(0, 0, c.width, c.height); p.forEach(q => { q.x += q.vx; q.y += q.vy; q.vy += .35; q.a += .2; x.fillStyle = q.c; x.save(); x.translate(q.x, q.y); x.rotate(q.a); x.fillRect(-q.r, -q.r / 2, q.r * 2, q.r); x.restore(); });
    if (++n < 110) requestAnimationFrame(f); else x.clearRect(0, 0, c.width, c.height); })();
}

/* ---------- sayfalar ---------- */
const SEKMELER = [["bugun", "Bugün", "home"], ["besin", "Besin", "leaf"], ["saglik", "Sağlık", "heart"], ["takviye", "Takviye", "pill"], ["profil", "Profil", "user"]];
function altMenuKur() {
  const c = $("#cubuk2"); c.innerHTML = '<span class="kayar" id="kayar"></span>' + SEKMELER.map(([k, ad, i]) => `<button data-s="${k}" onclick="git('${k}')">${ic(i)}<span>${ad}</span></button>`).join("");
  $("#alt").classList.remove("gizli"); menuIsaret();
}
function menuIsaret() {
  $$("#cubuk2 button").forEach(b => b.classList.toggle("a", b.dataset.s === S.sek));
  const a = $(`#cubuk2 button[data-s="${S.sek}"]`), k = $("#kayar"); if (a && k) { k.style.left = a.offsetLeft + "px"; k.style.width = a.offsetWidth + "px"; }
}
function git(s) { const sira = SEKMELER.map(x => x[0]); S.yon = sira.indexOf(s) >= sira.indexOf(S.sek) ? 30 : -30; S.sek = s; menuIsaret(); ciz(); scrollTo({top: 0}); }
function ustCubuk() {
  const sr = seriHesapla(), ad = A().ad || (S.kul && S.kul.ad) || "Ben";
  return `<div class="ust"><div class="avatar">${kac(ad[0].toUpperCase())}</div><div class="ad"><b>${kac(ad)}</b><div class="sol">${tarihYaz(BUGUN())}${S.kul ? ` · ${ic("cloud", "s")}` : ""}</div></div>
  <button class="ikbtn" onclick="kilitle()" title="Kilitle">${ic("lock")}</button><button class="ikbtn" id="esitSimge" onclick="esitleEl()" title="Eşitle">${ic(S.kul && S.esit ? "cloud" : "cloudoff")}</button>
  <div class="seri ${sr.bugunVar ? "" : "sonuk"}" onclick="seriSheet()">${ic("flame", "alev")}<span>${sr.suan}</span></div></div>`;
}
function simgeGuncelle() { const b = $("#esitSimge"); if (b) b.innerHTML = ic(S.kul && S.esit && !S.esitHata ? "cloud" : "cloudoff"); }
function ciz() {
  const m = $("#ana"); m.style.setProperty("--yon", S.yon + "px");
  const f = {bugun: sayfaBugun, besin: sayfaBesin, saglik: sayfaSaglik, takviye: sayfaTakviye, profil: sayfaProfil}[S.sek];
  m.innerHTML = ustCubuk() + `<div class="sayfa" id="sayfa">${f()}</div>` + (S.sek === "bugun" ? `<button class="fab ${S.kayitta ? "kayit" : ""}" id="fabMik" onclick="mikToggle()">${ic(S.kayitta ? "stop" : "mic", "b")}</button>` : "");
  dolum();
}

function gunSeridi() {
  const sr = seriHesapla(), bugun = BUGUN(), d = new Date(bugun + "T12:00:00"), pazartesi = gunEkle(bugun, -((d.getDay() + 6) % 7));
  return `<div class="hafta">${Array.from({length: 7}, (_, i) => { const t = gunEkle(pazartesi, i), dd = new Date(t + "T12:00:00");
    return `<div class="gun ${sr.gunler.has(t) ? "var" : ""} ${t === S.gun ? "sec" : ""}" onclick="gunSec('${t}')">${GUN_AD[dd.getDay()]}<div class="nokta">${sr.gunler.has(t) ? ic("check", "s") : dd.getDate()}</div></div>`; }).join("")}</div>`;
}
function gunSec(t) { S.yon = t >= S.gun ? 30 : -30; S.gun = t; ciz(); }
function gunKay(n) { S.yon = n > 0 ? 30 : -30; S.gun = gunEkle(S.gun, n); ciz(); }

function sayfaBugun() {
  const t = gunToplam(S.gun), ek = etkinKcal(S.gun), h = makroHedef(ek.kcal), kalan = h.kcal - Math.round(t.kcal), sr = seriHesapla();
  const kRenk = kalan < 0 ? "#ef4444" : "#10b981";
  const mk = (ad, v, hd, renk) => `<div class="makro">${halka(78, 9, hd ? v / hd : 0, renk, `<b>${Math.round(v)}</b><span>/ ${hd} g</span>`)}<div class="ad">${ad}</div></div>`;
  const ogunler = {kahvalti: "Kahvaltı", ogle: "Öğle", aksam: "Akşam", ara: "Ara öğün", takviye: "Takviye"};
  const su = (liste("sular").find(x => x.id === S.gun) || {ml: 0}).ml, hedefSu = +A().su || 2500, damla = Math.ceil(hedefSu / 250);
  let html = `<div class="kart cam"><div class="sat h" style="justify-content:space-between"><button class="ikbtn" onclick="gunKay(-1)">${ic("chevL")}</button>
    <b style="font-size:17px">${tarihYaz(S.gun)}</b><button class="ikbtn" onclick="gunKay(1)">${ic("chevR")}</button></div>${gunSeridi()}</div>`;
  html += `<div class="kart"><div class="sat h" style="justify-content:center">${halka(200, 16, h.kcal ? t.kcal / h.kcal : 0, kRenk,
    `<b data-say="${kalan}" style="color:${kRenk}">${kalan}</b><span>kcal kalan</span>`)}</div>
    <div class="sol" style="text-align:center;margin-top:6px">${Math.round(t.kcal)} / ${h.kcal} kcal${ek.asim ? ` · <span style="color:var(--kotu)">dünden ${ek.asim} kcal aşım düşüldü</span>` : ""}</div>
    <div class="makrolar">${mk("Protein", t.protein, h.protein, "#ef4444")}${mk("Yağ", t.yag, h.yag, "#f59e0b")}${mk("Karbonhidrat", t.karb, h.karb, "#3b82f6")}</div></div>`;
  if (S.gun === BUGUN()) html += `<div class="kart" style="background:${sr.bugunVar ? "linear-gradient(135deg,#fbbf24,#f97316)" : ""};color:${sr.bugunVar ? "#fff" : "inherit"}">
    <div class="sat h">${ic("flame", "b alev")}<div style="flex:1"><b style="font-size:18px">${sr.suan} günlük seri</b><div style="opacity:.85;font-size:13px">${sr.bugunVar ? "Bugünün serisi tamam! Yarın da devam." : sr.suan ? "Seriyi korumak için bugün bir şey kaydet." : "İlk kaydını ekle, seri başlasın."}</div></div></div></div>`;
  html += `<div class="kart"><h2>${ic("spark")}Ne yedin?</h2><div class="sat h"><input id="metin" placeholder="kahvaltıda iki yumurta ve 2 dilim ekmek" onkeydown="if(event.key=='Enter')coz()">
    <button class="btn ana" onclick="coz()">${ic("check")}</button></div><div class="sat" style="margin-top:10px"><button class="btn sade kucuk" onclick="aramaSheet()">${ic("search", "s")}Besin ara</button><button class="btn sade kucuk" onclick="elleSheet()">${ic("plus", "s")}Elle ekle</button></div><div id="on"></div>${sikKullanilan().length ? `<div class="sol" style="margin-top:12px">Sık yediklerin</div><div class="chipler" style="margin-top:6px">${sikKullanilan().map((e, i) => `<span class="chip" onclick="hizliEkle(${i})">${kac(e.ad)} · ${Math.round(e.son.gram)} g</span>`).join("")}</div>` : ""}</div>`;
  html += `<div class="kart"><h2>${ic("drop")}Su <span class="sol" style="margin-left:auto">${su} / ${hedefSu} ml</span></h2><div>${Array.from({length: damla}, (_, i) => `<span class="damla ${(i + 1) * 250 <= su ? "dolu" : ""}" onclick="suSec(${i + 1})"><i></i></span>`).join("")}</div></div>`;
  let bos = true;
  for (const [k, ad] of Object.entries(ogunler)) {
    const l = girisGun(S.gun).filter(g => (g.takviye ? "takviye" : g.ogun) === k); if (!l.length) continue; bos = false;
    html += `<div class="kart"><h2>${ic(k === "takviye" ? "pill" : "leaf")}${ad}<span class="sol" style="margin-left:auto">${Math.round(l.reduce((s, g) => s + (g.kcal || 0), 0))} kcal</span></h2>${l.map(g => `<div class="og"><div class="ik">${ic(g.takviye ? "pill" : "leaf", "s")}</div>
      <div class="ic" onclick="girisSheet('${g.id}')"><b>${kac(g.ad)}</b><span class="sol">${g.takviye ? "takviye" : Math.round(g.gram) + " g · P" + yuvarla(g.protein, 1) + " Y" + yuvarla(g.yag, 1) + " K" + yuvarla(g.karb, 1)}</span></div>
      <div class="sag">${Math.round(g.kcal)}<div><button class="ikbtn" style="width:30px;height:30px;border-radius:10px" onclick="girisSil('${g.id}')">${ic("trash", "s")}</button></div></div></div>`).join("")}</div>`;
  }
  if (bos) html += `<div class="kart bos">${ic("leaf")}<div>Henüz kayıt yok.<br>Aşağıdaki mikrofona bas ya da yaz.</div></div>`;
  return html;
}
function suSec(n) { const ml = n * 250, mev = (liste("sular").find(x => x.id === S.gun) || {ml: 0}).ml; upsert("sular", S.gun, {tarih: S.gun, ml: ml === mev ? (n - 1) * 250 : ml}); ciz(); }
function girisSil(id) { sil("girisler", id); ciz(); }

/* --- besin ekleme --- */
function onizlemeCiz() {
  const o = S.onizleme; if (!o) { $("#on").innerHTML = ""; return; }
  const ogunler = {kahvalti: "Kahvaltı", ogle: "Öğle", aksam: "Akşam", ara: "Ara öğün"}, sec = o.ogun || varsayilanOgun();
  $("#on").innerHTML = (o.ogeler.length ? `<div style="margin-top:12px">${o.ogeler.map((x, i) => `<div class="og"><div class="ic"><b>${kac(x.ad)}</b><span class="sol">"${kac(x.soz)}"</span></div>
    <div class="sat h" style="gap:4px"><input type="number" value="${x.gram}" style="width:78px;padding:8px" oninput="gramDegis(${i},this.value)"><span class="sol">g</span></div><div class="sag" id="pk${i}">${x.kcal}<div class="sol" style="font-weight:400">kcal</div></div><button class="ikbtn" style="width:34px;height:34px;border-radius:11px" onclick="onizlemeSil(${i})" title="Çıkar">${ic("x", "s")}</button></div>`).join("")}
    <div class="sat h" style="margin-top:10px"><select id="oo">${Object.entries(ogunler).map(([k, a]) => `<option value="${k}" ${k === sec ? "selected" : ""}>${a}</option>`).join("")}</select><button class="btn ana" onclick="onayla()">${ic("check")}Ekle</button></div></div>` : "")
    + (o.yok.length ? `<div class="uy">Bulunamadı: <b>${o.yok.map(kac).join(", ")}</b> — "Besin ara" ya da "Elle ekle" kullan.</div>` : "");
}
function onizlemeSil(i) { S.onizleme.ogeler.splice(i, 1); if (!S.onizleme.ogeler.length && !S.onizleme.yok.length) S.onizleme = null; onizlemeCiz(); }
function sikKullanilan() {
  const esik = gunEkle(BUGUN(), -45), m = new Map();
  for (const g of liste("girisler")) { if (g.takviye || g.tarih < esik) continue; const e = m.get(g.ad) || {ad: g.ad, n: 0, son: g}; e.n++; if (g.tarih >= e.son.tarih) e.son = g; m.set(g.ad, e); }
  return [...m.values()].sort((a, b) => b.n - a.n).slice(0, 6);
}
function hizliEkle(i) { const e = sikKullanilan()[i]; if (!e) return; const g = e.son; girisEkle({ad: g.ad, gram: g.gram, kcal: g.kcal, protein: g.protein, yag: g.yag, karb: g.karb, mikro: g.mikro}, varsayilanOgun()); ciz(); toast(`${g.ad} eklendi`); }
const varsayilanOgun = () => { const h = new Date().getHours(); return h < 11 ? "kahvalti" : h < 16 ? "ogle" : "aksam"; };
async function coz() {
  const m = ($("#metin") || {}).value; if (!m || !m.trim()) return;
  if (easterKontrol(m)) { $("#metin").value = ""; return; }
  const r = cozCumle(m, S.yemekler);
  if (r.yok.length && S.sunucuVar) {  // yerelde bulunamayanlari sunucudaki buyuk veri tabaninda ara
    for (const p of [...r.yok]) {
      try { const q = sade(p).replace(/\b\d+([.,]\d+)?\b/g, "").replace(/\b(gram|gr|adet|tane|dilim|bardak|kasik|kase|tabak|porsiyon)\b/g, "").trim();
        const l = await api("GET", "/api/yiyecek?q=" + encodeURIComponent(q)); if (l.length) { const y = yiyecekIndeksle([{...l[0]}])[0], mm = parseFloat(p) || 1;
          const o = olcekle(y, gramHesapla(y, mm, null)); o.soz = p; r.ogeler.push(o); r.yok.splice(r.yok.indexOf(p), 1); } } catch (e) {}
    }
  }
  S.onizleme = r; onizlemeCiz();
}
function gramDegis(i, g) {
  const x = S.onizleme.ogeler[i], f = (+g || 0) / (x.gram || 1);
  ["kcal", "protein", "yag", "karb"].forEach(k => x[k] = yuvarla(x[k] * f, 1)); if (x.mikro) for (const k in x.mikro) x.mikro[k] = yuvarla(x.mikro[k] * f, 3);
  x.gram = +g || 0; const p = $("#pk" + i); if (p) p.innerHTML = `${Math.round(x.kcal)}<div class="sol" style="font-weight:400">kcal</div>`;
}
function girisEkle(o, ogun, takviye) {
  const once = seriHesapla();
  ekle("girisler", {tarih: S.gun, ogun: ogun || varsayilanOgun(), ad: o.ad, gram: o.gram || 0, kcal: o.kcal || 0, protein: o.protein || 0, yag: o.yag || 0, karb: o.karb || 0, mikro: o.mikro || null, takviye: takviye ? 1 : 0});
  if (!takviye) seriKontrol(once);
}
function seriKontrol(once) {
  const son = seriHesapla(); if (son.suan > once.suan && !once.bugunVar) {
    if ([3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365].includes(son.suan)) { konfeti(); toast(`🔥 ${son.suan} günlük seri! Harikasın`); } else toast(`🔥 Seri: ${son.suan} gün`);
  }
}
function onayla() {
  const o = S.onizleme; if (!o) return; const og = $("#oo").value;
  o.ogeler.forEach(x => girisEkle(x, og)); S.onizleme = null; ciz();
}
function elleSheet(duzenle) {
  const ogunler = {kahvalti: "Kahvaltı", ogle: "Öğle", aksam: "Akşam", ara: "Ara öğün"};
  sheetAc(`<h2 style="margin:0 0 4px">${ic("plus")} Elle ekle</h2><label class="l">Ad</label><input id="ea" placeholder="Örn. annemin mercimek çorbası">
    <div class="sat h"><div style="flex:1"><label class="l">Gram</label><input id="eg" type="number" inputmode="decimal"></div><div style="flex:1"><label class="l">Kalori</label><input id="ek" type="number" inputmode="decimal"></div></div>
    <div class="sat h"><div style="flex:1"><label class="l">Protein g</label><input id="ep" type="number" inputmode="decimal"></div><div style="flex:1"><label class="l">Yağ g</label><input id="ey" type="number" inputmode="decimal"></div><div style="flex:1"><label class="l">Karb g</label><input id="eb" type="number" inputmode="decimal"></div></div>
    <label class="l">Öğün</label><select id="eo">${Object.entries(ogunler).map(([k, a]) => `<option value="${k}" ${k === varsayilanOgun() ? "selected" : ""}>${a}</option>`).join("")}</select>
    <label class="s sat" style="margin-top:12px"><span class="sw"><input type="checkbox" id="ekay"><i></i></span><span>Bu yemeği sık kullandıklarıma kaydet (100 g değeri olarak)</span></label>
    <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="elleKaydet()">${ic("check")}Ekle</button><button class="btn sade" onclick="sheetKapat()">Vazgeç</button></div>`);
}
function elleKaydet() {
  const n = id => +($(id).value) || 0, ad = $("#ea").value.trim(); if (!ad) { toast("Ad gerekli"); return; }
  if (easterKontrol(ad)) { sheetKapat(); return; }
  const o = {ad, gram: n("#eg"), kcal: n("#ek"), protein: n("#ep"), yag: n("#ey"), karb: n("#eb")};
  if ($("#ekay").checked && o.gram > 0) { const f = 100 / o.gram; ekle("ozel", {ad, kcal: o.kcal * f, protein: o.protein * f, yag: o.yag * f, karb: o.karb * f, birim: {porsiyon: o.gram}}); yemekIndeksiYenile(); }
  girisEkle(o, $("#eo").value); sheetKapat(); ciz();
}
let aramaZaman = 0;
function aramaSheet() { sheetAc(`<h2 style="margin:0 0 8px">${ic("search")} Besin ara</h2><input id="aq" placeholder="Örn. yoğurt, lahmacun, somon…" oninput="aramaYap(this.value)"><div id="asonuc" style="margin-top:8px"></div>`); setTimeout(() => $("#aq")?.focus(), 350); }
function aramaYap(q) {
  clearTimeout(aramaZaman); const s = sade(q); if (s.length < 2) { $("#asonuc").innerHTML = ""; return; }
  const yerel = S.yemekler.filter(y => y._ara.some(a => a.includes(s))).slice(0, 20);
  aramaGoster(yerel);
  if (S.sunucuVar) aramaZaman = setTimeout(async () => { try { const u = await api("GET", "/api/yiyecek?q=" + encodeURIComponent(s)); const ad = new Set(yerel.map(y => y.ad));
    aramaGoster(yerel.concat(yiyecekIndeksle(u.filter(x => !ad.has(x.ad)).map(x => ({...x}))))); } catch (e) {} }, 350);
}
let aramaListe = [];
function aramaGoster(l) {
  aramaListe = l; const e = $("#asonuc"); if (!e) return;
  e.innerHTML = l.length ? l.map((y, i) => `<div class="og" onclick="aramaSec(${i})"><div class="ic"><b>${kac(y.ad)}</b><span class="sol">100 g: ${Math.round(y.kcal)} kcal · P${yuvarla(y.protein, 1)} Y${yuvarla(y.yag, 1)} K${yuvarla(y.karb, 1)}${y.mikro ? " · mikro ✓" : ""}${y.kaynak === "ek" ? " · ek veri" : ""}</span></div>${ic("chevR", "s")}</div>`).join("") : '<div class="bos">Sonuç yok — "Elle ekle" ile kendin girebilirsin.</div>';
}
function aramaSec(i) {
  const y = aramaListe[i], b = y._birim || {}, ilk = b.porsiyon ?? b.adet ?? Object.values(b)[0] ?? 100;
  sheetAc(`<h2 style="margin:0 0 4px">${kac(y.ad)}</h2><div class="sol">100 g: ${Math.round(y.kcal)} kcal</div><label class="l">Miktar (gram)</label><input id="ag" type="number" inputmode="decimal" value="${ilk}">
    <div class="chipler" style="margin-top:10px">${Object.entries(y.birim || {}).map(([k, v]) => `<span class="chip" onclick="$('#ag').value=${v}">1 ${kac(k)} = ${v} g</span>`).join("")}</div>
    <div class="sat" style="margin-top:14px"><select id="aoo" style="flex:1">${[["kahvalti", "Kahvaltı"], ["ogle", "Öğle"], ["aksam", "Akşam"], ["ara", "Ara öğün"]].map(([k, a]) => `<option value="${k}" ${k === varsayilanOgun() ? "selected" : ""}>${a}</option>`).join("")}</select>
    <button class="btn ana" onclick="aramaEkle(${i})">${ic("check")}Ekle</button></div>`);
}
function aramaEkle(i) { const y = aramaListe[i], g = +$("#ag").value || 100; girisEkle(olcekle(y, g), $("#aoo").value); sheetKapat(); ciz(); }
function girisSheet(id) {
  const g = S.veri.girisler.find(x => x.id === id); if (!g || g.takviye) return;
  sheetAc(`<h2 style="margin:0 0 4px">${kac(g.ad)}</h2><label class="l">Gram</label><input id="dg" type="number" value="${Math.round(g.gram)}" inputmode="decimal">
    <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="girisGram('${id}')">${ic("check")}Güncelle</button><button class="btn kotu" onclick="girisSil('${id}');sheetKapat()">${ic("trash")}</button></div>`);
}
function girisGram(id) {
  const g = S.veri.girisler.find(x => x.id === id), n = +$("#dg").value || 0, f = n / (g.gram || 1), p = {gram: n, kcal: g.kcal * f, protein: g.protein * f, yag: g.yag * f, karb: g.karb * f};
  if (g.mikro) p.mikro = Object.fromEntries(Object.entries(g.mikro).map(([k, v]) => [k, v * f])); yama("girisler", id, p); sheetKapat(); ciz();
}

/* --- ses --- */
let kaydedici = null, parcalar = [], yerelKayit = false, sesCtx = null, seviyeFn = null, sesDongu = 0, sesGecmis = [], kayitBas = 0;
function yuvarlakDikdortgen(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); x.fill(); }
function sesPanelAc(mod) {
  let p = $("#sesPanel"); if (!p) { p = document.createElement("div"); p.id = "sesPanel"; document.body.appendChild(p); }
  p.className = "sespanel " + mod;
  p.innerHTML = mod === "kayit" ? `<canvas id="sesCv" width="520" height="96"></canvas><span class="sure" id="sesSure">0:00</span>` : `<span>Ses çevriliyor</span><span class="uc"><i></i><i></i><i></i></span>`;
  if (mod === "kayit") { sesGecmis = Array(38).fill(0); kayitBas = performance.now(); cancelAnimationFrame(sesDongu); cizSes(); } else cancelAnimationFrame(sesDongu);
}
function sesPanelKapat() {
  cancelAnimationFrame(sesDongu); seviyeFn = null; $("#sesPanel")?.remove(); const f = $("#fabMik"); if (f) f.style.transform = "";
  if (sesCtx) { try { sesCtx.close(); } catch (e) {} sesCtx = null; }
}
function cizSes() {
  const cv = $("#sesCv"); if (!cv) return; const x = cv.getContext("2d");
  const lv = Math.min(1, seviyeFn ? seviyeFn() : 0.12 + 0.08 * Math.random()); sesGecmis.push(lv); sesGecmis.shift(); x.clearRect(0, 0, cv.width, cv.height);
  const n = sesGecmis.length, w = cv.width / n;
  sesGecmis.forEach((v, i) => { const h = Math.max(7, v * cv.height * .96); x.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * i / n})`; yuvarlakDikdortgen(x, i * w + w * .18, (cv.height - h) / 2, w * .64, h, w * .32); });
  const sn = Math.floor((performance.now() - kayitBas) / 1000), e = $("#sesSure"); if (e) e.textContent = Math.floor(sn / 60) + ":" + String(sn % 60).padStart(2, "0");
  const f = $("#fabMik"); if (f) f.style.transform = `scale(${1 + lv * .24})`;
  sesDongu = requestAnimationFrame(cizSes);
}
function analizKur(ak) {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  try { sesCtx = new AC(); const an = sesCtx.createAnalyser(); an.fftSize = 1024; sesCtx.createMediaStreamSource(ak).connect(an); const buf = new Uint8Array(an.fftSize); let yum = 0;
    seviyeFn = () => { an.getByteTimeDomainData(buf); let t = 0; for (const v of buf) { const d = (v - 128) / 128; t += d * d; } yum = yum * .55 + Math.min(1, Math.sqrt(t / buf.length) * 4.2) * .45; return yum; }; } catch (e) {}
}
function fabGuncelle() { const f = $("#fabMik"); if (!f) return; f.className = "fab" + (S.kayitta ? " kayit" : ""); f.innerHTML = ic(S.kayitta ? "stop" : "mic", "b"); }   // yalniz dugmeyi guncelle: yazilan metin ve onizleme silinmesin
let tanir = null;
const IOS_ANA_EKRAN = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && (navigator.standalone === true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches));
async function mikToggle() {
  if (S.kayitta) {
    S.kayitta = false;
    if (tanir) { const r = tanir; tanir = null; try { r.stop(); } catch (e) {} sesPanelKapat(); fabGuncelle(); return; }
    if (window.Mik && yerelKayit) { yerelKayit = false; sesPanelAc("cozum"); const b64 = Mik.durdur(); fabGuncelle(); if (!b64) { sesPanelKapat(); toast("Kayıt alınamadı"); return; }
      const ik = atob(b64), by = new Uint8Array(ik.length); for (let i = 0; i < ik.length; i++) by[i] = ik.charCodeAt(i); sesGonder(new Blob([by], {type: "audio/mp4"})); }
    else if (kaydedici) kaydedici.stop(); else { sesPanelKapat(); fabGuncelle(); }
    return;
  }
  const tani = window.SpeechRecognition || window.webkitSpeechRecognition, kaynakTercih = A().sesKaynagi || "oto", ulasilabilir = navigator.onLine !== false && !(S.esitHata && /Çevrimdışı/.test(S.esitHata) && kaynakTercih === "oto"),
    sunucuSes = S.kul && S.sunucuVar && kaynakTercih !== "cihaz" && ulasilabilir;
  if (kaynakTercih === "sunucu" && !sunucuSes) { toast("Sunucu bağlı değil; Profil'den bağlan ya da kaynağı değiştir"); return; }
  if (window.Mik && sunucuSes) {
    const r = Mik.baslat(); if (r !== "ok") { toast(r === "izin" ? "İzin ver, sonra 🎤'ya tekrar bas" : "Mikrofon başlatılamadı"); return; }
    yerelKayit = true; S.kayitta = true; let yum = 0; seviyeFn = () => { let a = 0; try { a = Mik.seviye ? Mik.seviye() : 0; } catch (e) {} yum = yum * .5 + Math.min(1, Math.sqrt(a / 32767) * 1.5) * .5; return yum; }; fabGuncelle(); sesPanelAc("kayit"); return;
  }
  if (sunucuSes && navigator.mediaDevices && window.MediaRecorder && window.isSecureContext) {
    try { const ak = await navigator.mediaDevices.getUserMedia({audio: true}); parcalar = []; kaydedici = new MediaRecorder(ak);
      kaydedici.ondataavailable = e => parcalar.push(e.data);
      kaydedici.onstop = () => { ak.getTracks().forEach(t => t.stop()); const m = kaydedici; kaydedici = null; S.kayitta = false; fabGuncelle(); sesPanelAc("cozum"); if (sesCtx) { try { sesCtx.close(); } catch (e) {} sesCtx = null; } sesGonder(new Blob(parcalar, {type: m.mimeType})); };
      kaydedici.start(); S.kayitta = true; analizKur(ak); fabGuncelle(); sesPanelAc("kayit"); return; } catch (e) { /* izin yok: asagidaki yedek */ }
  }
  if (tani && !IOS_ANA_EKRAN()) {
    const r = new tani(); tanir = r; r.lang = "tr-TR"; r.interimResults = false; r.continuous = false; r.maxAlternatives = 1;
    r.onresult = e => { const m = $("#metin"); if (m) m.value = e.results[0][0].transcript; coz(); };
    r.onerror = e => { const h = {"not-allowed": "Mikrofon/konuşma izni verilmedi: tarayıcı ayarlarından izin ver", "service-not-allowed": "Konuşma tanıma kapalı: iPhone Ayarlar → Genel → Klavye → Dikteyi Etkinleştir", "no-speech": "Ses duyulmadı, tekrar dene", "audio-capture": "Mikrofon bulunamadı", "network": "Konuşma tanıma için internet gerekli"}[e.error]; toast(h || ("Ses anlaşılamadı (" + e.error + ")")); };
    r.onend = () => { tanir = null; S.kayitta = false; sesPanelKapat(); fabGuncelle(); };
    try { r.start(); S.kayitta = true; fabGuncelle(); sesPanelAc("kayit"); return; } catch (e) { tanir = null; } }
  toast(IOS_ANA_EKRAN() ? "iPhone ana ekran uygulamasında tarayıcı dikteşi yok: klavyedeki 🎤 simgesine bas" : "Bu cihazda kayıt yok: klavyendeki 🎤 ile yaz"); $("#metin")?.focus();
}
async function sesGonder(blob) {
  try { const r = await api("POST", "/api/ses", blob, true); sesPanelKapat(); if (r.metin) { const m = $("#metin"); if (m) m.value = r.metin; coz(); } else toast("Ses anlaşılamadı"); }
  catch (e) { sesPanelKapat(); toast("Ses çevrilemedi (" + e.message + "). Çevrimdışıysan klavyedeki 🎤'yu kullan."); }
}

/* --- besin / mikro sayfasi --- */
function mikroSatir(m, deger, hd) {
  const oran = hd.hedef ? deger / hd.hedef : 0, limit = m.tip === "sinir", asim = m.ust && deger > m.ust;
  const renk = limit ? (oran > 1 ? "#ef4444" : "#10b981") : asim ? "#8b5cf6" : oran < .5 ? "#ef4444" : oran < .9 ? "#f59e0b" : "#10b981";
  return `<div class="mik"><span class="ad">${kac(m.ad)}${hd.carpan !== 1 ? `<span class="etiket e-sinir" title="${kac(hd.kaynak)}">×${yuvarla(hd.carpan, 2)}</span>` : ""}${asim ? '<span class="etiket e-yuksek">üst sınır!</span>' : ""}</span>
  <span class="de"><b>${yuvarla(deger, deger < 10 ? 1 : 0)}</b> / ${limit ? "≤ " : ""}${yuvarla(hd.hedef, hd.hedef < 10 ? 1 : 0)} ${m.br}</span><div class="cubuk"><i style="background:${renk}" data-w="${Math.round(oran * 100)}"></i></div></div>`;
}
function sayfaBesin() {
  const bir = S.aralik === "bugun", {top, gunler} = bir ? {top: gunToplam(S.gun).mikro, gunler: girisGun(S.gun).length ? 1 : 0} : aralikToplam(7);
  const olcu = MIKRO.filter(m => m.tip !== "sinir"), skor = olcu.length ? olcu.reduce((t, m) => t + Math.min(1, (top[m.k] || 0) / mikroHedef(m.k).hedef), 0) / olcu.length : 0;
  let html = `<div class="kart"><div class="chipler" style="margin-bottom:12px"><span class="chip ${bir ? "a" : ""}" onclick="S.aralik='bugun';ciz()">${tarihYaz(S.gun)}</span><span class="chip ${!bir ? "a" : ""}" onclick="S.aralik='hafta';ciz()">Son 7 gün ort.</span></div>
    <div class="sat h" style="gap:16px">${halka(112, 12, gunler ? skor : 0, "#10b981", `<b data-say="${Math.round(gunler ? skor * 100 : 0)}">0</b><span>mikro skoru</span>`)}
    <div style="flex:1"><b>${gunler ? (skor > .85 ? "Çok iyi dengelenmiş" : skor > .6 ? "Fena değil, bazı eksikler var" : "Belirgin eksikler var") : "Henüz veri yok"}</b>
    <div class="sol">Hedefler yetişkin referans değerleridir; kan testin varsa otomatik uyarlanır (Sağlık sekmesi).</div></div></div></div>`;
  const eksik = olcu.map(m => ({m, o: (top[m.k] || 0) / mikroHedef(m.k).hedef})).filter(x => gunler && x.o < .6).sort((a, b) => a.o - b.o).slice(0, 4);
  if (eksik.length) html += `<div class="kart"><h2>${ic("spark")}Eksikler ve öneriler</h2>${eksik.map(({m, o}) => {
    const oner = S.yemekler.filter(y => y.mikro && y.mikro[m.k]).map(y => ({y, d: y.mikro[m.k] / mikroHedef(m.k).hedef})).sort((a, b) => b.d - a.d).slice(0, 4);
    return `<div style="margin-bottom:12px"><b>${kac(m.ad)}</b> <span class="sol">%${Math.round(o * 100)} karşılandı</span><div class="chipler" style="margin-top:6px">${oner.map(x => `<span class="chip">${kac(x.y.ad)} · 100 g'da %${Math.round(x.d * 100)}</span>`).join("")}</div></div>`; }).join("")}</div>`;
  for (const grup of ["Vitaminler", "Mineraller", "Lif & yağ asitleri"]) html += `<div class="kart"><h2>${ic(grup === "Vitaminler" ? "spark" : grup === "Mineraller" ? "flask" : "drop")}${grup}</h2>${MIKRO.filter(m => m.grup === grup).map(m => mikroSatir(m, top[m.k] || 0, mikroHedef(m.k))).join("")}</div>`;
  html += `<div class="uy">Mikro besin değerleri çoğunlukla USDA verisine dayanır; pişirme ve ürün farkları nedeniyle yaklaşıktır. Veri bulunmayan yemekler (örn. hazır yemekler) mikro toplamına girmez, bu yüzden eksikler olduğundan fazla görünebilir.</div>`;
  return html;
}

/* --- saglik sayfasi --- */
function sparkline(noktalar) {
  if (noktalar.length < 2) return '<div class="sol">Grafik için en az 2 kayıt gerekli.</div>';
  const w = 300, h = 70, ys = noktalar.map(n => n.kg), mn = Math.min(...ys) - .5, mx = Math.max(...ys) + .5;
  const p = noktalar.map((n, i) => [(i / (noktalar.length - 1)) * w, h - ((n.kg - mn) / (mx - mn)) * (h - 10) - 5]);
  const yol = p.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10b981" stop-opacity=".35"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs>
  <path d="${yol} L${w} ${h} L0 ${h}Z" fill="url(#sg)"/><path d="${yol}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${p[p.length - 1][0]}" cy="${p[p.length - 1][1]}" r="4.5" fill="#10b981"/></svg>`;
}
function sayfaSaglik() {
  const kilolar = liste("kilolar").sort((a, b) => a.tarih < b.tarih ? -1 : 1).slice(-30), son = kilolar[kilolar.length - 1], onc = kilolar[kilolar.length - 2];
  const fark = son && onc ? son.kg - onc.kg : 0, sonK = kanSon(), oner = kanOneriler();
  let html = `<div class="kart"><h2>${ic("scale")}Kilo <span class="sol" style="margin-left:auto">${son ? son.kg + " kg" : "—"}${onc ? ` <b style="color:${fark > 0 ? "var(--kotu)" : "var(--ana2)"}">${fark > 0 ? "+" : ""}${yuvarla(fark, 1)}</b>` : ""}</span></h2>${sparkline(kilolar)}
    <div class="sat h" style="margin-top:10px"><input id="kg" type="number" step="0.1" inputmode="decimal" placeholder="Bugünkü kilo (kg)"><button class="btn ana" onclick="kiloKaydet()">${ic("check")}</button></div></div>`;
  html += `<div class="kart"><h2>${ic("flask")}Kan tahlilleri</h2><div class="sat"><button class="btn ana kucuk" onclick="kanSheet()">${ic("plus", "s")}Sonuç ekle</button><button class="btn sade kucuk" onclick="kanYapistirSheet()">${ic("down", "s")}e-Nabız metninden aktar</button></div>`;
  html += Object.keys(sonK).length ? `<div class="liste2" style="margin-top:10px">${KAN.filter(t => sonK[t.k]).map(t => { const k = sonK[t.k], d = kanDurum(t, k.deger, A().cins);
    return `<div class="kanSat"><span onclick="kanGecmis('${t.k}')" style="cursor:pointer;flex:1">${kac(t.ad)}<br><span class="sol">${k.tarih} · geçmiş ›</span></span><span onclick="kanGecmis('${t.k}')" style="cursor:pointer"><b>${k.deger}</b> <span class="sol">${t.br}</span><span class="etiket e-${d}">${DURUM_AD[d]}</span></span>
    <button class="ikbtn" style="width:34px;height:34px;border-radius:11px;flex:none" onclick="kanSilSor('${k.id}','${t.k}')" title="Sil">${ic("trash", "s")}</button></div>`; }).join("")}</div>` : `<div class="bos">${ic("flask")}<div>Henüz sonuç yok. e-Nabız'dan baktığın değerleri ekle.</div></div>`;
  html += `</div>`;
  const mikL = Object.keys(oner).concat(Object.keys(A().mikroCarpan)).filter((k, i, a) => a.indexOf(k) === i);
  html += `<div class="kart"><h2>${ic("spark")}İhtiyaca etkisi</h2><label class="sat" style="margin-bottom:8px"><span class="sw"><input type="checkbox" ${+A().kanOtomatik ? "checked" : ""} onchange="ayarYama({kanOtomatik:this.checked?1:0});ciz()"><i></i></span><span>Kan sonuçlarına göre hedefleri otomatik uyarla</span></label>`;
  html += mikL.length ? mikL.map(k => { const m = MIKRO_HARITA[k], h = mikroHedef(k); return `<div class="sat h" style="padding:8px 0;border-bottom:1px solid var(--cizgi)"><div style="flex:1"><b>${kac(m.ad)}</b><div class="sol">${h.kaynak ? kac(h.kaynak) : ""} → hedef ${yuvarla(h.hedef, 1)} ${m.br}${m.ust ? ` (üst sınır ${m.ust})` : ""}</div></div>
    <input type="number" step="0.05" value="${yuvarla(h.carpan, 2)}" style="width:76px;padding:8px" onchange="carpanKaydet('${k}',this.value)"><span class="sol">×</span></div>`; }).join("")
    : `<div class="sol">Şu an otomatik bir uyarlama yok. Düşük/sınırda bir değer girersen ilgili mikro hedef artar.</div>`;
  html += `<div class="uy">Bu uygulama tıbbi tavsiye vermez. Hedef çarpanları yalnızca <b>yiyecek planlaması</b> içindir ve elle değiştirebilirsin. Takviye dozu için hekimine/diyetisyenine danış; üst sınırlar Besin sekmesinde işaretlenir.</div></div>`;
  return html;
}
function kiloKaydet() { const kg = parseFloat($("#kg").value); if (!(kg > 20 && kg < 400)) { toast("Geçerli bir kilo gir"); return; } const onceki = liste("kilolar").find(x => x.id === S.gun), n = (onceki && onceki.n || 0) + 1; upsert("kilolar", S.gun, {tarih: S.gun, kg, n}); ayarYama({kilo: kg}); ciz();
  if (n >= 3) { kavgaKediler(n); toast("Hepsi kavgaya tutuştu! 🙀"); } else if (n === 2) { kizginKediler(); toast("Bir günde bir tartı yeter! 😾"); } else toast("Kilo kaydedildi"); }
function carpanKaydet(k, v) { const c = A().mikroCarpan, n = parseFloat(v); const yeni = {...c}; if (!(n > 0)) delete yeni[k]; else yeni[k] = n; ayarYama({mikroCarpan: yeni}); ciz(); }
function kanSheet(sec) {
  sheetAc(`<h2 style="margin:0 0 4px">${ic("flask")} Tahlil sonucu</h2><label class="l">Test</label><select id="kt" onchange="$('#kbr').textContent=KAN_HARITA[this.value].br">${KAN.map(t => `<option value="${t.k}" ${t.k === sec ? "selected" : ""}>${kac(t.ad)}</option>`).join("")}</select>
    <div class="sat h"><div style="flex:1"><label class="l">Değer</label><input id="kd" type="number" step="0.01" inputmode="decimal"></div><div style="width:90px"><label class="l">Birim</label><div id="kbr" style="padding:13px 4px">${(KAN_HARITA[sec] || KAN[0]).br}</div></div></div>
    <label class="l">Tarih</label><input id="kta" type="date" value="${BUGUN()}"><div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="kanKaydet()">${ic("check")}Kaydet</button></div>`);
}
function kanKaydet() { const d = parseFloat(($("#kd").value || "").replace(",", ".")); if (isNaN(d)) { toast("Değer gir"); return; } ekle("kanlar", {test: $("#kt").value, deger: d, tarih: $("#kta").value || BUGUN()}); sheetKapat(); ciz(); toast("Sonuç kaydedildi"); }
function kanRef(t) { const lo = kanSinir(t.lo, A().cins), hi = kanSinir(t.hi, A().cins); return t.sinirLo ? `${lo}–${hi} (≥${t.sinirLo} ideal)` : t.hiSinir ? `< ${t.hiSinir} ideal` : `${lo}–${hi}`; }
function kanGecmis(k) {
  const t = KAN_HARITA[k], l = liste("kanlar").filter(x => x.test === k).sort((a, b) => a.tarih < b.tarih ? 1 : a.tarih > b.tarih ? -1 : b.u - a.u);
  if (!l.length) { sheetKapat(); return; }
  sheetAc(`<h2 style="margin:0 0 2px">${kac(t.ad)}</h2><div class="sol">Referans: ${kanRef(t)} ${t.br}</div><div style="margin-top:10px">${l.map(x => { const d = kanDurum(t, x.deger, A().cins);
    return `<div class="og"><div class="ic"><b>${x.deger} ${t.br}</b><span class="sol">${x.tarih}</span></div><span class="etiket e-${d}" style="margin:0">${DURUM_AD[d]}</span>
    <button class="ikbtn" style="width:36px;height:36px;border-radius:11px" onclick="kanSil('${x.id}','${k}')" title="Sil">${ic("trash", "s")}</button></div>`; }).join("")}</div>
    <div class="sat" style="margin-top:12px"><button class="btn sade kucuk" onclick="kanSheet('${k}')">${ic("plus", "s")}Yeni değer</button></div>`);
}
function kanSil(id, k) { sil("kanlar", id); liste("kanlar").some(x => x.test === k) ? kanGecmis(k) : sheetKapat(); ciz(); toast("Sonuç silindi"); }
function kanSilSor(id, k) {
  const t = KAN_HARITA[k], x = S.veri.kanlar.find(y => y.id === id);
  sheetAc(`<h2 style="margin:0 0 6px">${ic("trash")} Silinsin mi?</h2><div class="sol">${kac(t.ad)} · ${x.deger} ${t.br} · ${x.tarih}</div>
    <div class="sat" style="margin-top:14px"><button class="btn kotu" style="flex:1" onclick="sil('kanlar','${id}');sheetKapat();ciz();toast('Silindi')">${ic("trash")}Sil</button><button class="btn sade" onclick="sheetKapat()">Vazgeç</button></div>`);
}
function kanYapistirSheet() {
  sheetAc(`<h2 style="margin:0 0 4px">${ic("down")} e-Nabız'dan aktar</h2><div class="sol">e-Nabız'dan indirdiğin <b>PDF'i seç</b> ya da sonuç sayfasının metnini yapıştır. Dosya yalnızca tarayıcında okunur, hiçbir yere yüklenmez.</div>
    <div class="sat" style="margin:10px 0"><label class="btn ana" style="cursor:pointer;flex:1">${ic("up", "s")}PDF seç<input type="file" accept="application/pdf,.pdf" class="gizli" onchange="pdfSec(this)"></label></div>
    <textarea id="kyt" rows="5" placeholder="…ya da tahlil metnini buraya yapıştır"></textarea><label class="l">Tarih</label><input id="kta2" type="date" value="${BUGUN()}">
    <div class="sat" style="margin-top:12px"><button class="btn sade" style="flex:1" onclick="kanAyikla()">${ic("search")}Ayıkla</button></div><div id="kso"></div>`);
}
async function pdfJsYukle() {
  if (window.pdfjsLib) return;
  const kaynak = ad => window.PDFJS_B64 ? URL.createObjectURL(new Blob([Uint8Array.from(atob(window.PDFJS_B64[ad]), c => c.charCodeAt(0))], {type: "text/javascript"})) : "veri/pdfjs/" + ad;
  await new Promise((ok, hata) => { const s = document.createElement("script"); s.src = kaynak("pdf.min.js"); s.onload = ok; s.onerror = hata; document.head.appendChild(s); });
  pdfjsLib.GlobalWorkerOptions.workerSrc = kaynak("pdf.worker.min.js");
}
async function pdfMetni(dosya) {
  await pdfJsYukle(); const pdf = await pdfjsLib.getDocument({data: await dosya.arrayBuffer()}).promise, out = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const ic2 = await (await pdf.getPage(p)).getTextContent(), satirlar = new Map();
    for (const it of ic2.items) { if (!it.str.trim()) continue; const y = Math.round(it.transform[5] / 3); if (!satirlar.has(y)) satirlar.set(y, []); satirlar.get(y).push(it); }
    [...satirlar.entries()].sort((a, b) => b[0] - a[0]).forEach(([, l]) => out.push(l.sort((a, b) => a.transform[4] - b.transform[4]).map(i => i.str.trim()).join("  ")));
  }
  return out.join("\n");
}
async function pdfSec(inp) {
  const f = inp.files[0]; if (!f) return; const so = $("#kso"); so.innerHTML = '<div class="sol" style="margin-top:12px">PDF okunuyor…</div>';
  try { const m = await pdfMetni(f);
    if (m.replace(/\s/g, "").length < 20) { so.innerHTML = '<div class="uy k">Bu PDF\'te okunabilir metin yok (taranmış resim olabilir). Metni elle yapıştır ya da "Sonuç ekle" kullan.</div>'; return; }
    $("#kyt").value = m; const t = m.match(/(\d{2})[./-](\d{2})[./-](20\d{2})/); if (t) $("#kta2").value = `${t[3]}-${t[2]}-${t[1]}`;
    kanAyikla(); } catch (e) { so.innerHTML = '<div class="uy k">PDF okunamadı. Metni yapıştırmayı dene.</div>'; }
  inp.value = "";
}
let ayiklanan = [];
const TARIH_RE = /(\d{2})[./-](\d{2})[./-](20\d{2})/;
function belgeTarihi(metin) {
  // 'sonuc/tahlil/rapor tarihi' yanindaki tarih oncelikli; yoksa en cok gecen (dogum tarihi baglamlari haric) tarih
  const anahtar = /(sonu[cç]|tahlil|rapor|numune|[iİ]şlem|kabul)\s*tarih[iı]?[^\d]{0,14}(\d{2})[./-](\d{2})[./-](20\d{2})/i.exec(metin);
  if (anahtar) return `${anahtar[4]}-${anahtar[3]}-${anahtar[2]}`;
  const say = {}, bugun = BUGUN();
  for (const m of metin.matchAll(/(\d{2})[./-](\d{2})[./-](20\d{2})/g)) {
    const once = sade(metin.slice(Math.max(0, m.index - 24), m.index)); if (/dogum|d\.?t\.?\b/.test(once)) continue;
    const t = `${m[3]}-${m[2]}-${m[1]}`; if (t > bugun || +m[2] > 12 || +m[1] > 31) continue; say[t] = (say[t] || 0) + 1;
  }
  const k = Object.entries(say).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? 1 : -1))[0]; return k ? k[0] : null;
}
function kanAyikla() {
  ayiklanan = []; const metin = $("#kyt").value || "", varsayilan = belgeTarihi(metin) || $("#kta2").value || BUGUN(); let gecerli = varsayilan;
  for (const sat of metin.split(/\n|;/)) {
    const dm = TARIH_RE.exec(sat), satirT = dm && +dm[2] <= 12 ? `${dm[3]}-${dm[2]}-${dm[1]}` : null, s = sade(sat).replace(/(\d),(\d)/g, "$1.$2").replace(TARIH_RE, " ");
    let bulundu = false;
    for (const t of KAN) { if (ayiklanan.some(a => a.test === t.k && a.tarih === (satirT || gecerli))) continue; if (t.haric && t.haric.some(h => s.includes(h))) continue;
      const a = t.takma.map(sade).find(x => s.includes(x)); if (!a) continue;
      const kalan = s.slice(s.indexOf(a) + a.length), m = kalan.match(/(?<![a-z])(-?\d+(\.\d+)?)/); if (m) { ayiklanan.push({test: t.k, deger: parseFloat(m[1]), tarih: satirT || gecerli}); bulundu = true; } }
    if (!bulundu && satirT && s.replace(/[^a-z]/g, "").length < 6) gecerli = satirT;   // yalniz tarih iceren baslik satiri: sonraki satirlar bu tarihe aittir
  }
  if ($("#kta2")) $("#kta2").value = varsayilan;
  kanAyiklaGoster();
}
function kanAyiklaGoster() {
  const mevcut = (a) => liste("kanlar").find(x => x.test === a.test && x.tarih === a.tarih);
  $("#kso").innerHTML = ayiklanan.length ? `<div style="margin-top:12px"><div class="sol">${ayiklanan.length} test bulundu. Tarihi ve değeri düzeltebilir, yanlışı ✕ ile çıkarabilirsin.</div>${ayiklanan.map((a, i) => `<div class="og" style="flex-wrap:wrap"><div class="ic" style="min-width:120px"><b>${kac(KAN_HARITA[a.test].ad)}</b>${mevcut(a) ? `<span class="sol" style="color:var(--vurgu)">aynı gün kayıtlı (${mevcut(a).deger}) → güncellenecek</span>` : ""}</div>
    <div class="sat h" style="gap:4px"><input type="number" step="0.01" value="${a.deger}" style="width:84px;padding:8px" onchange="ayiklanan[${i}].deger=parseFloat(this.value);kanAyiklaGoster()"><span class="sol" style="width:44px">${KAN_HARITA[a.test].br}</span></div>
    <input type="date" value="${a.tarih}" style="width:150px;padding:8px" onchange="ayiklanan[${i}].tarih=this.value;kanAyiklaGoster()">
    <button class="ikbtn" style="width:34px;height:34px;border-radius:11px" onclick="ayiklanan.splice(${i},1);kanAyiklaGoster()">${ic("x", "s")}</button></div>`).join("")}
    <button class="btn ana" style="width:100%;margin-top:12px" onclick="kanAyiklaKaydet()">${ic("check")}${ayiklanan.length} sonucu kaydet</button></div>` : '<div class="uy">Tanıdığım bir test bulamadım. Elle "Sonuç ekle" ile girebilirsin.</div>';
}
function kanAyiklaKaydet() {
  let yeni = 0, guncel = 0;
  ayiklanan.forEach(a => { const m = liste("kanlar").find(x => x.test === a.test && x.tarih === a.tarih); if (m) { yama("kanlar", m.id, {deger: a.deger}); guncel++; } else { ekle("kanlar", {test: a.test, deger: a.deger, tarih: a.tarih || BUGUN()}); yeni++; } });
  sheetKapat(); ciz(); toast(`${yeni} yeni, ${guncel} güncellenen sonuç`);
}

/* --- takviye --- */
function sayfaTakviye() {
  const bugun = girisGun(S.gun).filter(g => g.takviye), ozel = liste("takviyeler"), tum = ozel.map(o => ({...o, ozel: 1})).concat(TAKVIYE_SABLON);
  let html = `<div class="kart"><h2>${ic("pill")}Bugün alınanlar <span class="sol" style="margin-left:auto">${tarihYaz(S.gun)}</span></h2>${bugun.length ? bugun.map(g => `<div class="og"><div class="ik">${ic("pill", "s")}</div><div class="ic"><b>${kac(g.ad)}</b><span class="sol">${Object.entries(g.mikro || {}).map(([k, v]) => `${MIKRO_HARITA[k]?.ad.split(" ")[0] || k} ${v}`).join(" · ")}</span></div><button class="ikbtn" style="width:34px;height:34px" onclick="girisSil('${g.id}')">${ic("minus", "s")}</button></div>`).join("") : `<div class="bos">${ic("pill")}<div>Bugün takviye eklenmedi.</div></div>`}</div>`;
  html += `<div class="kart"><h2>${ic("plus")}Takviye ekle</h2><div class="sol" style="margin-bottom:8px">Tipik etiket değerleridir; kendi ürününün etiketine göre "Yeni takviye" oluşturmanı öneririm.</div>
    ${tum.map((t, i) => `<div class="og"><div class="ic"><b>${kac(t.ad)}</b>${t.ozel ? '<span class="rozet">kendim</span>' : ""}</div><button class="btn ana kucuk" onclick="takviyeAl(${i})">${ic("plus", "s")}Aldım</button></div>`).join("")}
    <button class="btn sade" style="width:100%;margin-top:10px" onclick="takviyeYeniSheet()">${ic("plus", "s")}Yeni takviye oluştur</button></div>`;
  window._tum = tum;
  html += `<div class="uy">Takviyelerin üst sınırları aşılırsa Besin sekmesinde "üst sınır!" uyarısı görürsün. Doz için hekimine danış.</div>`;
  return html;
}
function takviyeAl(i) { const t = window._tum[i]; girisEkle({ad: t.ad, mikro: t.mikro}, "takviye", true); ciz(); toast("Eklendi"); }
function takviyeYeniSheet() {
  sheetAc(`<h2 style="margin:0 0 4px">${ic("pill")} Yeni takviye</h2><label class="l">Ürün adı</label><input id="tn" placeholder="Örn. Solgar D3 1000 IU">
    <div class="sol" style="margin-top:8px">Etikette 1 birim (tablet/kapsül) başına yazan miktarları gir; boş bırakılanlar sayılmaz.</div>
    <div class="sat h" style="flex-wrap:wrap">${MIKRO.filter(m => m.tip !== "sinir").map(m => `<div style="flex:1 1 44%"><label class="l">${kac(m.ad)} (${m.br})</label><input class="tm" data-k="${m.k}" type="number" step="any" inputmode="decimal"></div>`).join("")}</div>
    <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="takviyeKaydet()">${ic("check")}Kaydet</button></div>`);
}
function takviyeKaydet() {
  const ad = $("#tn").value.trim(); if (!ad) { toast("Ad gerekli"); return; } const mikro = {};
  $$(".tm").forEach(e => { const v = parseFloat(e.value); if (v > 0) mikro[e.dataset.k] = v; });
  if (mikro.EPADHA_mg && !mikro.Omega3_g) mikro.Omega3_g = mikro.EPADHA_mg / 1000;
  ekle("takviyeler", {ad, mikro}); sheetKapat(); ciz(); toast("Takviye kaydedildi");
}

/* --- profil / ayarlar --- */
function sayfaProfil() {
  const a = A(), sr = seriHesapla(), h = makroHedef(+a.kcal);
  const alan = (id, ad, v, tip = "number") => `<div style="flex:1"><label class="l">${ad}</label><input id="${id}" type="${tip}" inputmode="decimal" value="${kac(v)}"></div>`;
  const makro = (k, ad, f, p) => `<div class="mk"><div class="mk-ust"><b>${ad}</b><label class="mk-oto"><span class="sw"><input type="checkbox" id="${f}" ${+a[f] ? "checked" : ""} onchange="ayarOnizle()"><i></i></span><span>kaloriye göre</span></label></div>
    <div class="mk-alt"><input id="m_${k}" type="number" inputmode="decimal" value="${a[k]}" oninput="ayarOnizle()"><span class="mk-pct" id="${p}w"><input id="${p}" type="number" inputmode="decimal" value="${a[p]}" oninput="ayarOnizle()"><span>%</span></span></div></div>`;
  let html = `<div class="kart"><div class="sat h"><div class="avatar" style="width:56px;height:56px;font-size:24px">${kac((a.ad || (S.kul && S.kul.ad) || "B")[0].toUpperCase())}</div><div style="flex:1"><b style="font-size:18px">${kac(a.ad || (S.kul && S.kul.ad) || "Ben")}</b>
    <div class="sol">${S.kul ? `Sunucu profili${S.kul.admin ? " · yönetici" : ""}` : "Bu cihazda (sunucusuz)"}</div></div></div>
    <div class="sat" style="margin-top:12px"><span class="rozet">${ic("flame", "s")}Seri ${sr.suan}</span><span class="rozet">${ic("trophy", "s")}En iyi ${sr.enIyi}</span><span class="rozet">${ic("check", "s")}${sr.toplam} gün kayıt</span></div></div>`;
  html += `<div class="kart"><h2>${ic("user")}Vücut bilgileri</h2><div class="sat h">${alan("pad", "Ad", a.ad, "text")}<div style="width:110px"><label class="l">Cinsiyet</label><select id="pcins"><option value="e" ${a.cins === "e" ? "selected" : ""}>Erkek</option><option value="k" ${a.cins === "k" ? "selected" : ""}>Kadın</option></select></div></div>
    <div class="sat h">${alan("pyas", "Yaş", a.yas)}${alan("pboy", "Boy (cm)", a.boy)}${alan("pkilo", "Kilo (kg)", a.kilo)}</div>
    <div class="sat" style="margin-top:10px"><select id="pakt" style="flex:1"><option value="1.2">Hareketsiz</option><option value="1.375">Hafif aktif (haftada 1-3 spor)</option><option value="1.55" selected>Orta (3-5 spor)</option><option value="1.725">Çok aktif</option></select>
    <button class="btn sade kucuk" onclick="kaloriOner()">${ic("spark", "s")}Kalori öner</button></div></div>`;
  html += `<div class="kart"><h2>${ic("fire")}Günlük hedefler</h2><div class="sat h"><div style="flex:1"><b>Kalori (kcal)</b></div><input id="pk" type="number" inputmode="decimal" value="${a.kcal}" style="width:110px" oninput="ayarOnizle()"></div>
    ${makro("protein", "Protein (g)", "p_oto", "p_pct")}${makro("yag", "Yağ (g)", "y_oto", "y_pct")}${makro("karb", "Karbonhidrat (g)", "k_oto", "k_pct")}
    <div id="pcu" class="mk-uy"></div>
    <div class="sol" style="margin-top:6px">"Kaloriye göre" seçilen makro, elle girilenlerden artan kaloriyi alır. Birden fazlasını seçersen kutular yüzde olarak çıkar.</div>
    <label class="sat" style="margin-top:12px"><span class="sw"><input type="checkbox" id="pdev" ${+a.devir ? "checked" : ""}><i></i></span><span>Hedef aşımını ertesi günün hedefinden düş</span></label>
    <div class="sat h" style="margin-top:10px"><div style="flex:1"><b>Su hedefi (ml)</b></div><input id="psu" type="number" value="${a.su}" style="width:110px"></div>
    <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="profilKaydet()">${ic("check")}Kaydet</button></div></div>`;
  html += `<div class="kart"><h2>${ic("lock")}Gizlilik ve kasa</h2><div class="sol">"${kac(S.profil)}" profilinin verisi bu cihazda ${S.vkey ? "<b>AES-256 ile şifreli</b>" : "<b style='color:var(--kotu)'>şifresiz</b> (bu tarayıcıda şifreleme yok; HTTPS adresinden aç)"}. Parola yalnızca bellekte durur; uygulama 10 dk arka planda kalırsa kasa kilitlenir.</div>
    <div class="sat" style="margin-top:10px"><button class="btn sade kucuk" onclick="kilitle()">${ic("lock", "s")}Şimdi kilitle</button><button class="btn sade kucuk" onclick="kasaParolaSheet()">Parolayı değiştir</button><button class="btn sade kucuk" style="color:var(--kotu)" onclick="profilSilSor()">Profili sil</button></div></div>`;
  const durumSat = (S.sonEsit ? `<br>Son eşitleme: ${S.sonEsit.toLocaleTimeString("tr-TR")}` : "") + (S.esitHata ? `<br><span class="hata">${kac(S.esitHata)}</span>` : "");
  html += `<div class="kart"><h2>${ic("cloud")}Sunucu bağlantısı</h2>` + (S.sun && S.sun.jeton ? `<div class="sol">${kac(S.sun.url || location.origin)} · kullanıcı <b>${kac(S.sun.ad)}</b>${S.sun.admin ? " · yönetici" : ""}</div>
    <label class="sat" style="margin-top:10px"><span class="sw"><input type="checkbox" ${S.esit ? "checked" : ""} onchange="esitToggle(this.checked)"><i></i></span><span><b>${S.esit ? "Çevrimiçi: sunucuyla eşitleniyor" : "Çevrimdışı: yalnızca bu cihaz"}</b></span></label>
    <div class="sol" style="margin-top:6px">${S.esit ? "Değişiklikler sunucuya da gider; cihazdaki şifreli kopya da güncel kalır. İnternet kesilirse değişiklikler bekler, bağlanınca gönderilir." : "Her şey yalnızca bu cihazda kalır. Açtığında bekleyen değişiklikler sunucuya gönderilir."}${durumSat}</div>
    <div class="sat" style="margin-top:10px"><button class="btn sade kucuk" onclick="esitleEl()">${ic("cloud", "s")}Şimdi eşitle</button><button class="btn sade kucuk" onclick="parolaSheet()">Sunucu parolası</button>${S.sun.admin ? `<button class="btn sade kucuk" onclick="profilYonetSheet()">Kullanıcıları yönet</button>` : ""}<button class="btn sade kucuk" onclick="sunucuKopar()">Bağlantıyı kaldır</button></div>`
    : `<div class="sol">${S.sun ? "Sunucu oturumun bitti; yeniden giriş yap." : "Şu an tamamen çevrimdışı çalışıyor."} Sunucuna bağlanırsan verilerin sunucuya aktarılır; bu cihazdaki şifreli kopya da kalmaya devam eder.</div>
    <label class="l">Sunucu adresi</label><input id="sba" placeholder="https://sunucu-adresin" value="${kac((S.sun && S.sun.url) || LS.get("kt.sunucuUrl") || (S.sunucuVar ? location.origin : ""))}">
    <label class="l">Kullanıcı adı</label><input id="sbk" autocomplete="username" value="${kac(S.sun ? S.sun.ad : "")}"><label class="l">Parola</label><input id="sbp" type="password" autocomplete="current-password" onkeydown="if(event.key=='Enter')sunucuBagla()">
    <button class="btn ana" style="width:100%;margin-top:12px" onclick="sunucuBagla()">${ic("cloud")}Bağlan ve verileri aktar</button><div id="sbh" class="hata"></div>`) + `</div>`;
  html += `<div class="kart"><h2>${ic("mic")}Sesli giriş</h2><select onchange="ayarYama({sesKaynagi:this.value});toast('Kaydedildi')"><option value="oto" ${(a.sesKaynagi || "oto") === "oto" ? "selected" : ""}>Otomatik (sunucu varsa Whisper, yoksa cihaz)</option><option value="sunucu" ${a.sesKaynagi === "sunucu" ? "selected" : ""}>Yalnızca sunucu (Whisper, sesin sunucuda işlenir)</option><option value="cihaz" ${a.sesKaynagi === "cihaz" ? "selected" : ""}>Yalnızca cihaz (Apple/Google dikteşi)</option></select>
    <div class="sol" style="margin-top:8px">Cihaz seçeneği sunucusuz çalışır ama sesi Apple/Google işler. iPhone'da ana ekran uygulamasında tarayıcı dikteşi çalışmaz; klavyedeki 🎤 simgesini kullan.</div></div>`;
  html += `<div class="kart"><h2>${ic("down")}Yedek</h2><div class="sat"><button class="btn sade kucuk" onclick="disaAktar()">${ic("down", "s")}Dışa aktar (JSON)</button><label class="btn sade kucuk" style="cursor:pointer">${ic("up", "s")}İçe aktar<input type="file" accept=".json" class="gizli" onchange="iceAktar(this)"></label></div></div>
    <div class="kart"><h2>${ic("spark")}iPhone / telefona ekle</h2><div class="sol"><b>iPhone:</b> Safari'de aç → Paylaş → "Ana Ekrana Ekle" (internetsiz de açılır). <b>Android:</b> Chrome menüsü → "Uygulamayı yükle".</div><button class="btn sade kucuk" style="margin-top:8px" onclick="lisansSheet()">Kaynaklar ve lisanslar</button></div>`;
  setTimeout(ayarOnizle, 0);
  return html;
}
function ayarOnizle() {
  const g = id => $("#" + id); if (!g("pk")) return;
  const kcal = +g("pk").value || 0, kat = {protein: 4, yag: 9, karb: 4}, anah = [["protein", "p"], ["yag", "y"], ["karb", "k"]];
  const oto = {}, man = {}, pct = {}; anah.forEach(([k, o]) => { oto[k] = g(o + "_oto").checked; man[k] = +g("m_" + k).value || 0; pct[k] = +g(o + "_pct").value || 0; });
  const sec = anah.map(x => x[0]).filter(k => oto[k]), kalan = Math.max(0, kcal - anah.map(x => x[0]).filter(k => !oto[k]).reduce((t, k) => t + man[k] * kat[k], 0)), hes = {};
  if (sec.length === 1) hes[sec[0]] = Math.round(kalan / kat[sec[0]]);
  else if (sec.length > 1) { const top = sec.reduce((t, k) => t + pct[k], 0) || 1; sec.forEach(k => hes[k] = Math.round(kalan * pct[k] / top / kat[k])); }
  anah.forEach(([k, o]) => { const i = g("m_" + k); i.disabled = oto[k]; if (oto[k]) i.value = hes[k]; g(o + "_pctw").style.visibility = oto[k] && sec.length > 1 ? "visible" : "hidden"; });
  const ps = sec.reduce((t, k) => t + pct[k], 0), top = anah.reduce((t, [k]) => t + (oto[k] ? hes[k] : man[k]) * kat[k], 0);
  g("pcu").innerHTML = (sec.length > 1 && ps !== 100 ? `<span style="color:var(--vurgu)">Yüzdeler toplamı ${ps}; oran olarak normalize edilir.</span><br>` : "") + `<span class="sol">Makrolardan gelen kalori: ${Math.round(top)} kcal${Math.abs(top - kcal) > 30 ? ` (hedefe göre ${top > kcal ? "+" : ""}${Math.round(top - kcal)})` : " ✓"}</span>`;
}
function profilKaydet() {
  const v = id => $("#" + id), n = id => parseFloat(v(id).value) || 0;
  ayarYama({ad: v("pad").value.trim(), cins: v("pcins").value, yas: n("pyas"), boy: n("pboy"), kilo: n("pkilo"), kcal: n("pk"), su: n("psu") || 2500, devir: v("pdev").checked ? 1 : 0,
    p_oto: v("p_oto").checked ? 1 : 0, y_oto: v("y_oto").checked ? 1 : 0, k_oto: v("k_oto").checked ? 1 : 0, p_pct: n("p_pct"), y_pct: n("y_pct"), k_pct: n("k_pct"),
    protein: v("m_protein").disabled ? A().protein : n("m_protein"), yag: v("m_yag").disabled ? A().yag : n("m_yag"), karb: v("m_karb").disabled ? A().karb : n("m_karb")});
  toast("Kaydedildi"); ciz();
}
const AKT = [[1.2, "Hareketsiz", "Masa başı, az hareket"], [1.375, "Hafif", "Haftada 1-3 hafif spor"], [1.55, "Orta", "Haftada 3-5 spor"], [1.725, "Çok aktif", "Haftada 6-7 yoğun spor"], [1.9, "Sporcu", "Günde iki antrenman / ağır iş"]];
let ON = null;
function kaloriOner() {
  const n = id => parseFloat(($("#" + id) || {}).value);
  ON = {k: n("pkilo") || A().kilo || 75, b: n("pboy") || A().boy || 175, y: n("pyas") || A().yas || 30, e: (($("#pcins") || {}).value || A().cins) === "e", akt: 1.55, hedef: "ver", hiz: 0.5, pg: 2.0, hk: ""};
  sheetAc(""); onerCiz();
}
function onerCiz() {
  const o = ON, hedefler = [["ver", "Kilo ver", "down"], ["koru", "Koru", "scale"], ["al", "Kas / kilo al", "up"]];
  $("#sheet").innerHTML = `<h2 style="margin:0 0 2px">${ic("spark")} Kalori & makro planı</h2><div class="sol">Mifflin-St Jeor formülüyle ${o.e ? "erkek" : "kadın"}, ${o.y} yaş, ${o.b} cm, ${o.k} kg için tahmin.</div>
    <label class="l">Hedefin</label><div class="chipler">${hedefler.map(([k, ad, i]) => `<span class="chip ${o.hedef === k ? "a" : ""}" onclick="ON.hedef='${k}';ON.hiz=Math.min(ON.hiz,${k === "al" ? .5 : 1});ON.pg=${k === "ver" ? 2.2 : 2.0};onerCiz()">${ad}</span>`).join("")}</div>
    <label class="l">Aktivite düzeyi</label><div class="chipler">${AKT.map(([v, ad]) => `<span class="chip ${o.akt === v ? "a" : ""}" onclick="ON.akt=${v};onerCiz()">${ad}</span>`).join("")}</div>
    <div class="sol" style="margin-top:4px">${AKT.find(x => x[0] === o.akt)[2]}</div>
    ${o.hedef !== "koru" ? `<label class="l">Hız: <span id="onerHiz"></span></label><input type="range" min="0.1" max="${o.hedef === "al" ? .5 : 1}" step="0.05" value="${o.hiz}" oninput="ON.hiz=+this.value;onerSonuc()" style="padding:0;height:34px;accent-color:var(--ana)">
    <label class="l">Hedef kilo (isteğe bağlı)</label><input type="number" inputmode="decimal" placeholder="${o.k} kg" value="${o.hk}" oninput="ON.hk=this.value;onerSonuc()">` : ""}
    <label class="l">Protein (kg başına gram)</label><div class="chipler">${[1.6, 2.0, 2.2, 2.4].map(v => `<span class="chip ${o.pg === v ? "a" : ""}" onclick="ON.pg=${v};onerCiz()">${v} g/kg</span>`).join("")}</div>
    <div id="onerSonuc"></div>`;
  onerSonuc();
}
function onerSonuc() {
  const o = ON, bmr = 10 * o.k + 6.25 * o.b - 5 * o.y + (o.e ? 5 : -161), tdee = bmr * o.akt, gunluk = Math.round(o.hiz * 7700 / 7);
  const ham = o.hedef === "ver" ? tdee - gunluk : o.hedef === "al" ? tdee + gunluk : tdee, alt = Math.max(o.e ? 1500 : 1200, Math.round(bmr));
  const kcal = Math.round(Math.max(o.hedef === "ver" ? alt : 0, ham) / 10) * 10, altaCekildi = o.hedef === "ver" && ham < alt;
  const prot = Math.round(o.pg * o.k), yag = Math.round(Math.max(.8 * o.k, .2 * kcal / 9)), karb = Math.max(0, Math.round((kcal - prot * 4 - yag * 9) / 4));
  const bm = o.b / 100, bmi = o.k / (bm * bm), bAd = bmi < 18.5 ? "Zayıf" : bmi < 25 ? "Normal" : bmi < 30 ? "Fazla kilolu" : "Obez", bRenk = bmi < 18.5 ? "#38bdf8" : bmi < 25 ? "#10b981" : bmi < 30 ? "#f59e0b" : "#ef4444";
  const sag = [18.5 * bm * bm, 24.9 * bm * bm], hk = parseFloat(o.hk), haftaYuz = o.hiz / o.k * 100;
  const hafta = hk && o.hedef !== "koru" && ((o.hedef === "ver" && hk < o.k) || (o.hedef === "al" && hk > o.k)) ? Math.ceil(Math.abs(hk - o.k) / o.hiz) : 0;
  const tar = hafta ? new Date(Date.now() + hafta * 7 * 864e5).toLocaleDateString("tr-TR", {day: "numeric", month: "long", year: "numeric"}) : "";
  const kc = [prot * 4, yag * 9, karb * 4], top = kc.reduce((a, b) => a + b, 0) || 1, uy = [];
  if (altaCekildi) uy.push(`Bu hızda kalori ${Math.round(ham)} kcal'ye düşerdi; güvenli alt sınır olan <b>${alt} kcal</b>'de tuttum.`);
  if (o.hedef !== "koru" && haftaYuz > 1) uy.push(`Haftada vücut ağırlığının %1'inden (${(o.k * .01).toFixed(2)} kg) hızlı değişim önerilmez; hızı düşürmeyi düşün.`);
  if (karb < 60) uy.push("Karbonhidrat çok düşük kaldı; protein g/kg'ı azaltmak ya da kaloriyi artırmak daha dengeli olur.");
  if (o.hedef === "ver" && bmi < 20) uy.push("BMI zaten düşük; kilo vermek yerine korumayı düşün.");
  const hizEl = $("#onerHiz"); if (hizEl) hizEl.innerHTML = `${o.hiz.toFixed(2)} kg/hafta · ${o.hedef === "ver" ? "−" : "+"}${gunluk} kcal/gün`;
  $("#onerSonuc").innerHTML = `<div class="kart" style="margin:14px 0 10px;background:linear-gradient(135deg,color-mix(in srgb,var(--ana) 20%,var(--kart)),var(--kart))"><div class="sat h" style="gap:14px">
    ${halka(124, 12, Math.min(1, kcal / (tdee * 1.35)), "#10b981", `<b id="onerKcal" style="font-size:26px">${kcal}</b><span>kcal / gün</span>`)}
    <div class="liste2" style="flex:1;font-size:13px"><div><span>Bazal (BMR)</span><b>${Math.round(bmr)}</b></div><div><span>Harcanan (TDEE)</span><b>${Math.round(tdee)}</b></div><div><span>Fark</span><b style="color:${kcal - tdee < 0 ? "var(--ana2)" : kcal - tdee > 0 ? "var(--vurgu)" : "inherit"}">${kcal - Math.round(tdee) > 0 ? "+" : ""}${kcal - Math.round(tdee)}</b></div></div></div>
    <div style="display:flex;height:14px;border-radius:99px;overflow:hidden;margin-top:14px"><i style="width:${kc[0] / top * 100}%;background:#ef4444"></i><i style="width:${kc[1] / top * 100}%;background:#f59e0b"></i><i style="width:${kc[2] / top * 100}%;background:#3b82f6"></i></div>
    <div class="sat" style="justify-content:space-between;margin-top:8px;font-size:13px"><span><b style="color:#ef4444">●</b> Protein <b>${prot} g</b></span><span><b style="color:#f59e0b">●</b> Yağ <b>${yag} g</b></span><span><b style="color:#3b82f6">●</b> Karb <b>${karb} g</b></span></div></div>
    <div class="sat h" style="gap:12px;margin-bottom:10px"><div class="kart" style="flex:1;margin:0;padding:12px"><div class="sol">BMI</div><b style="font-size:22px;color:${bRenk}">${bmi.toFixed(1)}</b> <span class="etiket" style="background:${bRenk}">${bAd}</span></div>
    <div class="kart" style="flex:1;margin:0;padding:12px"><div class="sol">Sağlıklı aralık</div><b>${sag[0].toFixed(0)}–${sag[1].toFixed(0)} kg</b><div class="sol">${o.k < sag[0] ? "altındasın" : o.k > sag[1] ? `${(o.k - sag[1]).toFixed(1)} kg üstü` : "içindesin ✓"}</div></div></div>
    ${hafta ? `<div class="uy" style="background:color-mix(in srgb,var(--ana) 14%,transparent)">🎯 ${hk} kg hedefine yaklaşık <b>${hafta} hafta</b> (${tar}).</div>` : ""}
    ${uy.map(u => `<div class="uy">${u}</div>`).join("")}
    <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="onerUygula(true)">${ic("check")}Kalori + makroları uygula</button></div>
    <div class="sat" style="margin-top:8px"><button class="btn sade" style="flex:1" onclick="onerUygula(false)">Yalnızca kaloriyi uygula</button></div>
    <div class="sol" style="margin-top:10px">Genel bir tahmindir, tıbbi tavsiye değil. Haftalık kilo trendine göre ±100-150 kcal ayar yap.</div>`;
  ON.sonuc = {kcal, prot, yag, karb};
}
function onerUygula(makro) {
  const r = ON.sonuc; $("#pk").value = r.kcal;
  if (makro) { $("#m_protein").value = r.prot; $("#m_yag").value = r.yag; $("#p_oto").checked = false; $("#y_oto").checked = false; $("#k_oto").checked = true; }
  sheetKapat(); ayarOnizle(); profilKaydet(); toast("Hedefler güncellendi: " + r.kcal + " kcal");
}
async function esitToggle(a) {
  if (!S.sun) return; S.sun.esit = a; baglantiKur(); await vaultKaydet(); if (a) await esitle(); ciz();
}
async function esitleEl() { if (!S.kul) { toast("Sunucu bağlantısı yok"); return; } if (!S.esit) { toast("Çevrimdışı moddasın (Profil'den çevrimiçi yap)"); return; } await esitle(); ciz(); toast(S.esitHata || "Eşitlendi ✓"); }
function seriSheet() {
  const sr = seriHesapla(); sheetAc(`<div style="text-align:center">${ic("flame", "b alev")}<h1 style="margin:0;font-size:44px">${sr.suan}</h1><div class="sol">günlük seri</div>
    <div class="sat" style="justify-content:center;margin:14px 0"><span class="rozet">${ic("trophy", "s")}En iyi ${sr.enIyi}</span><span class="rozet">${ic("check", "s")}${sr.toplam} gün kayıt</span></div>
    <div class="sol">Her gün en az bir yemek kaydedersen seri sürer. Bir gün atlarsan sıfırlanır — bugünü kaydetmek serini güvende tutar.</div></div>`);
}
function disaAktar() { if (window.Mik && Mik.kaydet) { Mik.kaydet(`kalori-yedek-${BUGUN()}.json`, JSON.stringify(S.veri)); toast("Kaydedilecek yeri seç"); return; } const b = new Blob([JSON.stringify(S.veri)], {type: "application/json"}), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `kalori-yedek-${BUGUN()}.json`; a.click(); }
function iceAktar(inp) {
  const f = inp.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { try { const v = JSON.parse(r.result); let n = 0;
    for (const k of KOLS) for (const d of v[k] || []) { const i = S.veri[k].findIndex(x => x.id === d.id); if (i < 0) { S.veri[k].push(d); n++; } else if (d.u > S.veri[k][i].u) { S.veri[k][i] = d; n++; } }
    if (v.ayar && v.ayar.u > A().u) S.veri.ayar = Object.assign({}, VARSAYILAN_AYAR, v.ayar); degisti(); yemekIndeksiYenile(); ciz(); toast(n + " kayıt içe aktarıldı"); } catch (e) { toast("Geçersiz dosya"); } };
  r.readAsText(f);
}
/* hesap */
function parolaSheet() { sheetAc(`<h2 style="margin:0 0 4px">${ic("lock")} Parolayı değiştir</h2><label class="l">Eski parola</label><input id="pe" type="password"><label class="l">Yeni parola (en az 6)</label><input id="pn" type="password">
  <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="parolaDegis()">${ic("check")}Değiştir</button></div><div id="ph" class="hata"></div>`); }
async function parolaDegis() { try { await api("POST", "/api/parola", {eski: $("#pe").value, yeni: $("#pn").value}); sheetKapat(); toast("Parola değişti"); } catch (e) { $("#ph").textContent = e.message; } }
async function profilYonetSheet() {
  let l = []; try { l = await api("GET", "/api/profiller"); } catch (e) {}
  sheetAc(`<h2 style="margin:0 0 6px">${ic("user")} Profiller</h2>${l.map(a => `<div class="og"><div class="ik">${ic("user", "s")}</div><div class="ic"><b>${kac(a)}</b></div>${a !== S.kul.ad ? `<button class="ikbtn" style="width:34px;height:34px" onclick="profilSil('${kac(a)}')">${ic("trash", "s")}</button>` : '<span class="rozet">sen</span>'}</div>`).join("")}
    <label class="l">Yeni profil adı</label><input id="npa"><label class="l">Parola (en az 6)</label><input id="npp" type="password"><div class="sat" style="margin-top:12px"><button class="btn ana" style="flex:1" onclick="profilEkle()">${ic("plus")}Profil ekle</button></div><div id="ph" class="hata"></div>
    <div class="sol" style="margin-top:8px">Her profilin verisi ayrıdır; kimse diğerinin verisini göremez.</div>`);
}
async function profilEkle() { try { await api("POST", "/api/profil-ekle", {ad: $("#npa").value, parola: $("#npp").value}); toast("Profil eklendi"); profilYonetSheet(); } catch (e) { $("#ph").textContent = e.message; } }
async function profilSil(ad) { if (!confirm(ad + " profili ve tüm verisi silinsin mi?")) return; try { await api("POST", "/api/profil-sil", {ad}); profilYonetSheet(); } catch (e) { toast(e.message); } }

/* ---------- profil / kasa / sunucu baglantisi ---------- */
async function sunucuyaGir(url, ad, parola, kur) {
  url = (url || "").trim().replace(/\/+$/, ""); if (url && !/^https?:\/\//.test(url)) url = "https://" + url;
  const eski = S.sunucuUrl; S.sunucuUrl = url;
  try { await api("GET", "/api/durum"); } catch (e) { S.sunucuUrl = eski; throw new Error("Sunucuya ulaşılamadı. Adres doğru mu, Tailscale açık mı? Chrome kullanıyorsan adres çubuğundaki izin simgesinden 'Yerel ağ' erişimine izin ver; olmazsa uygulamayı doğrudan sunucu adresinden aç."); }
  let r; try { r = await api("POST", kur ? "/api/kur" : "/api/giris", {ad, parola}); } catch (e) { S.sunucuUrl = eski; throw e; }
  return {url, ad: r.ad, admin: r.admin, jeton: r.jeton, esit: true};
}
async function sunucuBagla() {   // acik kasaya sunucu hesabi bagla (Profil sekmesi)
  const g = id => $("#" + id).value; $("#sbh").textContent = "";
  try { const sun = await sunucuyaGir(g("sba"), g("sbk"), g("sbp"), false); S.sun = sun; S.sunucuUrl = sun.url; S.sunucuVar = true; baglantiKur(); S.pushU = 0; S.since = 0; LS.set("kt.sunucuUrl", sun.url);
    await vaultKaydet(); ciz(); toast("Bağlandı, veriler aktarılıyor…"); await esitle(); ciz(); toast(S.esitHata || "Veriler sunucuya aktarıldı, cihazdaki kopya da duruyor ✓"); }
  catch (e) { $("#sbh").textContent = e.message; }
}
function sunucuKopar() { if (!confirm("Sunucu bağlantısı kaldırılsın mı? Cihazdaki veriler kalır, sunucudaki kopya silinmez.")) return;
  const j = S.sun && S.sun.jeton; if (j) fetch(taban() + "/api/cikis", {method: "POST", headers: {"X-Kalori": "1", Authorization: "Bearer " + j, "Content-Type": "application/json"}, body: "{}"}).catch(() => {});
  S.sun = null; baglantiKur(); vaultKaydet(); ciz(); toast("Bağlantı kaldırıldı"); }
async function kasaParolaDegis() {
  const eski = $("#kpe").value, yeni = $("#kpn").value; $("#kph").textContent = "";
  try { if (!KRIPTO) throw new Error("Bu tarayıcıda şifreleme yok"); if (yeni.length < 6) throw new Error("Yeni parola en az 6 karakter");
    const k = JSON.parse(LS.get("kt.v." + S.profil)); try { await sifreCoz(await turetAnahtar(eski, unb64(k.tuz)), k.iv, k.ct); } catch (e) { throw new Error("Eski parola yanlış"); }
    S.vtuz = crypto.getRandomValues(new Uint8Array(16)); S.vkey = await turetAnahtar(yeni, S.vtuz); await vaultKaydet(); sheetKapat(); toast("Kasa parolası değişti"); }
  catch (e) { $("#kph").textContent = e.message; }
}
function kasaParolaSheet() { sheetAc(`<h2 style="margin:0 0 4px">${ic("lock")} Kasa parolasını değiştir</h2><div class="sol">Bu cihazdaki şifreli veriyi açan parola.</div><label class="l">Eski parola</label><input id="kpe" type="password"><label class="l">Yeni parola (en az 6)</label><input id="kpn" type="password">
  <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="kasaParolaDegis()">${ic("check")}Değiştir</button></div><div id="kph" class="hata"></div>`); }
function profilSilSor() { sheetAc(`<h2 style="margin:0 0 6px">${ic("trash")} Bu cihazdaki profil silinsin mi?</h2><div class="sol">"${kac(S.profil)}" profilinin cihazdaki şifreli verisi kalıcı silinir. Sunucuya eşitlendiyse sunucudaki kopya durur.</div>
  <div class="sat" style="margin-top:14px"><button class="btn kotu" style="flex:1" onclick="profilSil2()">${ic("trash")}Sil</button><button class="btn sade" onclick="sheetKapat()">Vazgeç</button></div>`); }
function profilSil2() { const ad = S.profil; LS.del("kt.v." + ad); profilKaydetListe(profiller().filter(p => p.ad !== ad)); S.vkey = null; S.veri = null; S.kul = null; S.sun = null; S.profil = null; sheetKapat(); karsilama("liste"); }
function lisansSheet() {
  sheetAc(`<h2 style="margin:0 0 6px">${ic("spark")} Kaynaklar ve lisanslar</h2><div class="sol" style="line-height:1.6">
  <b>USDA FoodData Central</b> (SR Legacy): kamu malı, vitamin/mineral/omega-3 değerleri buradan.<br>
  <b>Open Food Facts</b>: ODbL lisansı, © Open Food Facts katkıcıları (openfoodfacts.org); yalnızca sunucu sürümünde markalı ürün araması.<br>
  <b>Türk yemekleri listesi</b>: TürKomp, USDA ve etiket ortalamalarından elle derlenmiş yaklaşık değerler; tarifine göre değişir.<br>
  <b>PDF.js</b> © Mozilla, Apache-2.0: tahlil PDF'lerini tarayıcında okumak için.<br>
  <b>Ek veri</b>: internetten derlenmiş markalı ürün/yiyecek tablosu (kaynak belirtilmemiş, değerler doğrulanmadı).<br><b>Whisper</b> (OpenAI, MIT): yalnızca sunucuya bağlıyken ses tanıma.<br><br>
  Besin değerleri bilgilendirme amaçlıdır, tıbbi tavsiye değildir.</div>`);
}

/* ---------- giris / karsilama ---------- */
function karsilama(mod, hata = "", sec = "") {
  $("#alt").classList.add("gizli"); S.sek = "bugun";
  const pl = profiller(), eski = eskiKayitlar(), sonP = LS.get("kt.sonProfil");
  mod = mod || (pl.length ? "liste" : "yeni"); if (mod === "kilit") mod = "liste";
  const hataH = hata ? `<div class="hata">${kac(hata)}</div>` : "";
  const baslik = `<img class="logo" src="ikon.svg" alt=""><h1>Kalori Takip</h1>`;
  let ic_ = "";
  if (mod === "liste") ic_ = `<p class="sol">Profilini seç, parolanla aç. Veriler bu cihazda şifreli.</p><div class="kart">${pl.map(p => `<div class="og" onclick="karsilama('ac',\'\',${JSON.stringify(p.ad).replace(/"/g, "&quot;")})" style="cursor:pointer"><div class="ik">${ic("lock", "s")}</div><div class="ic"><b>${kac(p.ad)}</b><span class="sol">${p.sifreli ? "şifreli profil" : "şifresiz (bu tarayıcı şifrelemeyi desteklemiyor)"}</span></div>${ic("chevR", "s")}</div>`).join("")}</div>
    <button class="btn ana" style="width:100%" onclick="karsilama('yeni')">${ic("plus")}Yeni profil</button>${S.sunucuVar || LS.get("kt.sunucuUrl") ? `<button class="btn sade" style="width:100%;margin-top:10px" onclick="karsilama('sunucu')">${ic("cloud")}Sunucu hesabıyla giriş</button>` : `<button class="btn sade" style="width:100%;margin-top:10px" onclick="karsilama('sunucu')">${ic("cloud")}Sunucuya bağlan</button>`}${hataH}`;
  else if (mod === "ac") ic_ = `<div class="kart"><h2>${ic("lock")}${kac(sec)}</h2><label class="l">Parola</label><input id="ap" type="password" autocomplete="current-password" onkeydown="if(event.key=='Enter')profilAcUI(${JSON.stringify(sec).replace(/"/g, "&quot;")})">
    <button class="btn ana" style="width:100%;margin-top:14px" onclick="profilAcUI(${JSON.stringify(sec).replace(/"/g, "&quot;")})">${ic("check")}Aç</button>${hataH}<div class="sol" style="margin-top:10px">Parolayı unutursan veriyi kurtarmanın yolu yok (şifreli). Sunucuya eşitlediysen oradan geri yükleyebilirsin.</div></div><button class="btn sade" style="width:100%" onclick="karsilama('liste')">← Geri</button>`;
  else if (mod === "yeni") ic_ = `<p class="sol">${KRIPTO ? "Verilerin bu cihazda parolanla şifrelenir (AES-256)." : "⚠ Bu tarayıcı şifrelemeyi desteklemiyor; veri şifresiz saklanır. HTTPS adresinden aç."}</p>
    <div class="kart"><label class="l">Profil adı</label><input id="pn1" autocomplete="username"><label class="l">Parola (en az 6)</label><input id="pp1" type="password" autocomplete="new-password"><label class="l">Parola tekrar</label><input id="pp2" type="password" autocomplete="new-password">
    ${eski.length ? `<label class="l">Eski şifresiz verini aktar</label><select id="pes"><option value="">Aktarma</option>${eski.map(k => `<option value="${kac(k)}">${kac(k.replace("kt.veri.", ""))}</option>`).join("")}</select><div class="sol" style="margin-top:4px">Aktarılan eski şifresiz kopya silinir.</div>` : ""}
    <button class="btn ana" style="width:100%;margin-top:14px" onclick="yeniProfilUI()">${ic("check")}Oluştur</button>${hataH}</div>${pl.length ? `<button class="btn sade" style="width:100%" onclick="karsilama('liste')">← Geri</button>` : ""}`;
  else if (mod === "sunucu") ic_ = `<p class="sol">Sunucu hesabınla giriş yap. Bu cihazda aynı parolayla şifreli bir kopya tutulur; çevrimdışı da çalışır.</p><div class="kart"><label class="l">Sunucu adresi</label><input id="su" placeholder="https://sunucu-adresin" value="${kac(taban() || LS.get("kt.sunucuUrl") || (S.sunucuVar ? location.origin : ""))}">
    <label class="l">Kullanıcı adı</label><input id="sk" autocomplete="username"><label class="l">Parola</label><input id="sp" type="password" autocomplete="current-password" onkeydown="if(event.key=='Enter')sunucuGirisUI(false)">
    <button class="btn ana" style="width:100%;margin-top:14px" onclick="sunucuGirisUI(false)">${ic("cloud")}Giriş yap</button>${S.ilk ? `<button class="btn sade" style="width:100%;margin-top:8px" onclick="sunucuGirisUI(true)">İlk yönetici hesabını oluştur</button>` : ""}${hataH}</div><button class="btn sade" style="width:100%" onclick="karsilama('liste')">← Geri</button>`;
  $("#ana").innerHTML = `<div class="kars">${baslik}${ic_}<div class="sol" style="text-align:center;margin-top:16px"><a href="#" onclick="lisansSheet();return false" style="color:var(--sol)">Kaynaklar ve lisanslar</a></div></div>`;
  setTimeout(() => { const f = $("#ap") || $("#pn1") || $("#sk"); f && f.focus(); }, 50);
}
async function profilAcUI(ad) { try { await profilAc(ad, $("#ap").value); sonrasi(); } catch (e) { karsilama("ac", e.message, ad); } }
async function yeniProfilUI() {
  try { const ad = $("#pn1").value, p1 = $("#pp1").value, p2 = $("#pp2").value; if (p1 !== p2) throw new Error("Parolalar uyuşmuyor");
    const eskiK = $("#pes") && $("#pes").value; let v = null; if (eskiK) { try { v = JSON.parse(LS.get(eskiK)); } catch (e) {} }
    await profilOlustur(ad, p1, v); if (eskiK) LS.del(eskiK); sonrasi(); } catch (e) { karsilama("yeni", e.message); }
}
async function sunucuGirisUI(kur) {
  try { const sun = await sunucuyaGir($("#su").value, $("#sk").value, $("#sp").value, kur), parola = $("#sp").value;
    const var_ = profiller().find(p => p.ad.toLowerCase() === sun.ad.toLowerCase());
    if (var_) { try { await profilAc(var_.ad, parola); } catch (e) { throw new Error(`Bu cihazdaki "${var_.ad}" profilinin parolası farklı; önce o profili aç ve Profil sekmesinden sunucuyu bağla`); } }
    else await profilOlustur(sun.ad, parola, null);
    S.sun = sun; S.sunucuUrl = sun.url; S.sunucuVar = true; baglantiKur(); S.pushU = 0; S.since = 0; LS.set("kt.sunucuUrl", sun.url); await vaultKaydet(); sonrasi(); }
  catch (e) { karsilama("sunucu", e.message); }
}
async function sonrasi() {
  await yemekleriYukle(); altMenuKur(); S.gun = BUGUN(); S.sek = SEKMELER.some(x => x[0] === location.hash.slice(1)) ? location.hash.slice(1) : "bugun"; menuIsaret();
  if (S.kul && S.esit) await esitle();
  yemekIndeksiYenile();
  if (!A().u && !A().ad) { ciz(); setTimeout(ilkProfilSheet, 400); } else ciz();
  addEventListener("resize", menuIsaret);
}
function ilkProfilSheet() {
  sheetAc(`<h2 style="margin:0 0 4px">${ic("spark")} Seni tanıyalım</h2><div class="sol">Vitamin/mineral hedeflerini ve kalori önerisini kişiselleştirmek için.</div>
    <label class="l">Adın</label><input id="oa" value="${kac(S.kul ? S.kul.ad : (S.profil || ""))}"><div class="sat h"><div style="flex:1"><label class="l">Cinsiyet</label><select id="oc"><option value="e">Erkek</option><option value="k">Kadın</option></select></div><div style="flex:1"><label class="l">Yaş</label><input id="oy" type="number" value="30"></div></div>
    <div class="sat h"><div style="flex:1"><label class="l">Boy (cm)</label><input id="ob" type="number" value="175"></div><div style="flex:1"><label class="l">Kilo (kg)</label><input id="ok" type="number" value="75"></div></div>
    <div class="sat" style="margin-top:14px"><button class="btn ana" style="flex:1" onclick="ilkProfilKaydet()">${ic("check")}Devam</button></div>`);
}
function ilkProfilKaydet() { ayarYama({ad: $("#oa").value.trim(), cins: $("#oc").value, yas: +$("#oy").value || 30, boy: +$("#ob").value || 175, kilo: +$("#ok").value || 75}); sheetKapat(); ciz(); }

/* ---------- baslangic ---------- */
(async function basla() {
  S.sunucuUrl = LS.get("kt.sunucuUrl") || "";
  try { const r = await fetch(taban() + "/api/durum", {headers: {"X-Kalori": "1"}, signal: AbortSignal.timeout ? AbortSignal.timeout(2500) : undefined});
    if (r.ok && location.protocol.startsWith("http")) { const j = await r.json(); S.sunucuVar = !!j.sunucu; S.ilk = !!j.ilk_kurulum; } } catch (e) {}
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) navigator.serviceWorker.register("sw.js").catch(() => {});
  karsilama(profiller().length ? "liste" : "yeni");
})();
let gizlendi = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { gizlendi = Date.now(); vaultKaydet(); return; }
  if (S.vkey && gizlendi && Date.now() - gizlendi > 10 * 60 * 1000) { kilitle(); return; }   // 10 dk arka planda kalirsa kasa kilitlenir
  if (S.kul && S.esit) esitle();
});
addEventListener("online", () => { if (S.kul && S.esit) esitle(); });
setInterval(() => { if (S.kul && S.esit && S.esitHata && !document.hidden) esitle(); }, 60000);
addEventListener("pagehide", () => { vaultKaydet(); });

/* ---------- sürpriz: yürüyen piksel kediler ---------- */
const KEDI_RENK = {
  bw: {f: "#3a3a46", o: "#aab2c5", s: "#f4f4f4", g: "#ffe066", k: "#101015"},
  turuncu: {f: "#ef7d57", o: "#1a1c2c", s: "#ffcd75", g: "#1a1c2c", k: "#1a1c2c"}
};
const KALP = [".RR.RR.", "RRRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."];
function kediCiz(x, px, py, s, pal, kare, kizgin, bw) {
  const bacak = kare % 2 ? [3, 2, 2, 3] : [2, 3, 3, 2], bx = [4, 7, 10, 13];
  const kuyruk = kare % 2 ? [[1, 5, 2, 2], [0, 4, 2, 2], [1, 2, 2, 2]] : [[1, 5, 2, 2], [0, 3, 2, 2], [0, 1, 2, 2]];
  const parcalar = [[3, 4, 10, 5, "f"], [11, 2, 6, 6, "f"], [11, 0, 2, 2, "f"], [15, 0, 2, 2, "f"]];
  kuyruk.forEach(k => parcalar.push([k[0], k[1], k[2], k[3], "f"]));
  bx.forEach((b, i) => parcalar.push([b, 9, 2, kizgin ? 3 : bacak[i], "f"]));
  const R = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(px + a * s, py + b * s, w * s, h * s); };
  parcalar.forEach(p => R(p[0] - 1, p[1] - 1, p[2] + 2, p[3] + 2, pal.o));
  parcalar.forEach(p => R(p[0], p[1], p[2], p[3], pal.f));
  R(5, 7, 6, 2, pal.s);                              // gogus/karin
  if (bw) { R(13, 4, 3, 4, pal.s); bx.forEach((b, i) => R(b, 9 + (kizgin ? 3 : bacak[i]) - 1, 2, 1, pal.s)); } // beyaz yuz ve pati
  R(15, 0, 1, 1, "#e86a92"); R(11, 0, 1, 1, "#e86a92");
  if (kizgin) {
    R(14, 4, 2, 1, "#ff3b3b"); R(13, 3, 1, 1, pal.k); R(14, 3, 2, 1, pal.k); R(15, 2, 1, 1, pal.k);   // kizgin kas + kirmizi goz
    R(14, 6, 2, 1, pal.k); R(14, 7, 1, 1, pal.k);                                                      // somurtkan agiz
    R(17, 0, 1, 3, "#ff3b3b"); R(16, 1, 3, 1, "#ff3b3b");                                              // kizgin isareti
  } else { R(14, 4, 1, 2, pal.g); R(16, 5, 1, 1, "#e86a92"); }
}
let kediAkis = 0;
function kediKatman() {
  let c = $("#kediCv"); if (!c) { c = document.createElement("canvas"); c.id = "kediCv"; c.style.cssText = "position:fixed;left:0;right:0;bottom:74px;width:100%;height:170px;pointer-events:none;z-index:75"; document.body.appendChild(c); }
  const d = window.devicePixelRatio || 1; c.width = Math.round(innerWidth * d); c.height = Math.round(170 * d);
  const x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0); x.imageSmoothingEnabled = false; return [c, x];
}
function kediOynat(kediler, kalpAc) {
  cancelAnimationFrame(kediAkis); const [c, x] = kediKatman(), W = innerWidth, ayak = 170 - 28, kalpler = [];
  const t0 = performance.now(); let son = t0, kalpZ = -9;
  kediler.forEach(k => { k.x = -(k.olcek || 5) * 20; });
  (function f(t) {
    const dt = Math.min(.05, (t - son) / 1000), gec = (t - t0) / 1000; son = t; x.clearRect(0, 0, W, 170); let canli = 0;
    for (const k of kediler) {
      const s = k.olcek || 5, hiz = k.hiz || 150, kareHz = k.kareHz || 7, py = ayak - 12 * s;
      if (gec < k.gecikme) { canli++; continue; }
      let yuruyor = true;
      if (k.durak != null && !k.gecti) { if (k.x < k.durak) k.x += hiz * dt; else { yuruyor = false; k.bekBas = k.bekBas || gec; if (gec - k.bekBas > k.bekle) k.gecti = true; } } else k.x += (k.hizCik || hiz * 1.15) * dt;
      if (k.x < W + s * 22) canli++;
      const kare = Math.floor(gec * kareHz), sars = !yuruyor ? Math.sin(gec * 40) * 2 : 0, zip = k.agir && yuruyor && kare % 2 ? 0 : 0;
      kediCiz(x, k.x + sars, py + zip, s, KEDI_RENK[k.renk], yuruyor ? kare : 0, k.kizginHep || (k.kizgin && k.bekBas != null), k.renk === "bw");
      if (k.agir && yuruyor && kare % 2 === 0 && Math.floor((gec - dt) * kareHz) % 2) { const m = $("#ana"); if (m) { m.style.transform = "translateY(3px)"; setTimeout(() => m.style.transform = "", 70); } }  // agir adim: ekran hafif sarsilir
      if (kalpAc && !k.kizginHep && yuruyor && gec - (k.kalpZ || -9) > .55 && k.x > 0) { k.kalpZ = gec; kalpler.push({x: k.x + 12 * s, y: py - 6, t: 0}); }
    }
    for (let i = kalpler.length - 1; i >= 0; i--) {
      const h = kalpler[i]; h.t += dt; h.y -= 55 * dt; h.x += Math.sin(h.t * 6) * .6; if (h.t > 1.6) { kalpler.splice(i, 1); continue; }
      x.globalAlpha = Math.max(0, 1 - h.t / 1.6); KALP.forEach((r, ry) => [...r].forEach((ch, rx) => { if (ch === "R") { x.fillStyle = ry < 2 ? "#ff6b8b" : "#e63e66"; x.fillRect(h.x + rx * 3, h.y + ry * 3, 3, 3); } })); x.globalAlpha = 1;
    }
    if (canli || kalpler.length) kediAkis = requestAnimationFrame(f); else { x.clearRect(0, 0, W, 170); c.remove(); }
  })(t0);
}
const SAYI_SOZ = {bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10};
function easterKontrol(metin) {
  const t = sade(metin).replace(/[^a-z0-9 ]/g, " ").replace(/\btane\b/g, " ").replace(/\s+/g, " ").trim();
  const m = t.match(/^(\d+|bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz|on)? ?(ada|barbaros)$/); if (!m) return false;
  const adet = m[1] ? (SAYI_SOZ[m[1]] || parseInt(m[1], 10)) : 1, renk = m[2] === "ada" ? "bw" : "turuncu", W = innerWidth;
  if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
  if (adet >= 4) { kediOynat([{renk, gecikme: 0, olcek: 9, hiz: 70, kareHz: 2.4, kizginHep: 1, agir: 1, hizCik: 70}], false); toast("Yeter artık! 😾"); return true; }   // yavas, buyuk adimlarla, kizgin
  kediOynat(Array.from({length: Math.max(1, adet)}, (_, i) => ({renk, gecikme: i * .9})), true); return true;
}
function kizginKediler() {
  const W = innerWidth; kediOynat([{renk: "bw", gecikme: 0, durak: W * .2, bekle: 2.4, kizgin: 1}, {renk: "turuncu", gecikme: .5, durak: W * .45, bekle: 2.2, kizgin: 1}, {renk: "bw", gecikme: 1, durak: W * .7, bekle: 2, kizgin: 1}], false);
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
}

/* ---------- cizgi film kavgasi: kediler siralanir, kizar, toz bulutu icinde dovusur, sersemleyip tek tek gider ---------- */
function kavgaKediler(sayi) {
  const n = Math.max(3, Math.min(5, sayi)), W = innerWidth, S5 = 5, ayak = 170 - 28, py = ayak - 12 * S5, renkler = ["bw", "turuncu", "bw", "turuncu", "bw"];
  const kediler = Array.from({length: n}, (_, i) => ({renk: renkler[i], x: -110, hx: W * (i + 1) / (n + 1) - 42, gecikme: i * .55, vardi: false, cikis: 0}));
  const [c, x] = kediKatman(); x.textAlign = "center"; cancelAnimationFrame(kediAkis);
  const t0 = performance.now(); let son = t0, gelis = null, titreK = 0; const orta = kediler.reduce((a, k) => a + k.hx, 0) / n + 42;
  const rnd = (tohum, k) => { const v = Math.sin(tohum * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  const daire = (cx, cy, r, renk) => { x.fillStyle = renk; x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.fill(); };
  function bulut(t) {
    const tohum = Math.floor(t * 12), ox = (rnd(tohum, 1) - .5) * 14, cx = orta + ox + Math.sin(t * 5) * 18, cy = ayak - 40 + (rnd(tohum, 2) - .5) * 8;
    for (let pas = 0; pas < 2; pas++) for (let k = 0; k < 18; k++) {
      const a = rnd(tohum, k) * 6.2832, d = rnd(tohum, k + 50) * 58, px = cx + Math.cos(a) * d * 1.5, pyy = cy + Math.sin(a) * d * .75, r = 15 + rnd(tohum, k + 90) * 17;
      daire(px, pyy, pas ? r : r + 4, pas ? (k % 3 ? "#eceff7" : "#d6dae6") : "#6f768d");
    }
    for (let k = 0; k < 8; k++) {   // bulutun icinden sarkan pati / kuyruk / kulak
      const a = rnd(tohum, k + 200) * 6.2832, px = cx + Math.cos(a) * 92, pyy = cy + Math.sin(a) * 52, kd = kediler[k % n], pal = KEDI_RENK[kd.renk], tur = k % 3;
      x.save(); x.translate(px, pyy); x.rotate(a + Math.PI / 2);
      x.fillStyle = pal.o; if (tur === 0) { x.fillRect(-10, -10, 20, 20); x.fillStyle = pal.f; x.fillRect(-8, -8, 16, 16); x.fillStyle = pal.s; x.fillRect(-6, 2, 4, 4); x.fillRect(2, 2, 4, 4); }
      else if (tur === 1) { x.fillRect(-6, -4, 12, 36); x.fillStyle = pal.f; x.fillRect(-4, -2, 8, 32); }
      else { x.beginPath(); x.moveTo(-10, 10); x.lineTo(0, -14); x.lineTo(10, 10); x.closePath(); x.fill(); x.fillStyle = pal.f; x.beginPath(); x.moveTo(-6, 8); x.lineTo(0, -8); x.lineTo(6, 8); x.closePath(); x.fill(); }
      x.restore();
    }
    x.strokeStyle = "#ffffff"; x.lineWidth = 3; for (let k = 0; k < 10; k++) { const a = rnd(tohum, k + 300) * 6.2832; x.beginPath(); x.moveTo(cx + Math.cos(a) * 110, cy + Math.sin(a) * 62); x.lineTo(cx + Math.cos(a) * 140, cy + Math.sin(a) * 78); x.stroke(); }
    const kelimeler = ["POW!", "BAM!", "ZAP!", "BOP!", "MIYAV!"], w = Math.floor(t * 3);
    for (let k = 0; k < 2; k++) {
      const tx = cx + (rnd(w, k + 400) - .5) * 260, ty = cy - 38 + (rnd(w, k + 410) - .5) * 40; x.save(); x.translate(tx, ty); x.rotate((rnd(w, k + 420) - .5) * .6);
      x.font = "900 30px Impact, 'Arial Black', sans-serif"; x.lineWidth = 7; x.strokeStyle = "#1a1c2c"; x.strokeText(kelimeler[Math.floor(rnd(w, k + 430) * kelimeler.length)], 0, 0); x.fillStyle = k ? "#ff5a5f" : "#ffcd75"; x.fillText(kelimeler[Math.floor(rnd(w, k + 430) * kelimeler.length)], 0, 0); x.restore();
    }
  }
  function yildizlar(cx, cy, t) { for (let k = 0; k < 3; k++) { const a = t * 5 + k * 2.1; x.fillStyle = "#ffcd75"; x.fillRect(cx + Math.cos(a) * 30, cy + Math.sin(a) * 8, 6, 6); x.fillRect(cx + Math.cos(a) * 30 + 2, cy + Math.sin(a) * 8 - 2, 2, 10); } }
  (function f(t) {
    const dt = Math.min(.05, (t - son) / 1000), gec = (t - t0) / 1000; son = t; x.clearRect(0, 0, W, 170);
    if (gelis === null && kediler.every(k => k.vardi)) gelis = gec;
    const e = gelis === null ? -1 : gec - gelis;    // -1 yuruyor | 0-1.4 kizar | 1.4-4.6 kavga | 4.6-6 sersem | 6+ tek tek gider
    let canli = 0;
    kediler.forEach((k, i) => {
      if (gec < k.gecikme) { canli++; return; }
      let yuruyor = false;
      if (!k.vardi) { k.x += 150 * dt; yuruyor = true; if (k.x >= k.hx) k.vardi = true; }
      else if (e >= 6 + i * 1.0) { k.x += 190 * dt; yuruyor = true; }
      if (k.x < W + 110) canli++;
      const kare = Math.floor(gec * 7), kizgin = e >= 0, gizli = e >= 1.4 && e < 4.6;
      if (!gizli) { const sars = e >= 0 && e < 1.4 ? Math.sin(gec * 45) * 2.5 : e >= 4.6 && e < 6 ? Math.sin(gec * 9) * 3 : 0; kediCiz(x, k.x + sars, py, S5, KEDI_RENK[k.renk], yuruyor ? kare : 0, kizgin, k.renk === "bw"); }
      if (e >= 4.6 && e < 6 + i) yildizlar(k.x + 36, py - 8, gec);
    });
    if (e >= 1.4 && e < 4.6) { bulut(gec); if (navigator.vibrate && Math.floor(gec * 5) !== titreK) { titreK = Math.floor(gec * 5); navigator.vibrate(25); } }
    if (canli) kediAkis = requestAnimationFrame(f); else { x.clearRect(0, 0, W, 170); c.remove(); }
  })(t0);
}
