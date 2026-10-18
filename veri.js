"use strict";
/* Statik veriler ve saf fonksiyonlar: mikro besin tanimlari, kan testi araliklari, takviye sablonlari, cumle cozucu. */

const sade = s => (s || "").toString().toLowerCase().replace(/İ/g, "i").replace(/I/g, "ı")
  .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/â/g, "a").replace(/î/g, "i")
  .replace(/\s+/g, " ").trim();

/* rda: [erkek, kadin] (yetiskin, EFSA/NIH ortalamalari). ust: guvenli ust sinir (UL) - yiyecek+takviye. tip:'sinir' = asilmamasi onerilen deger. */
const MIKRO = [
  {k: "A_ug", ad: "A vitamini", br: "µg", grup: "Vitaminler", rda: [900, 700], ust: 3000, renk: "#f59e0b"},
  {k: "C_mg", ad: "C vitamini", br: "mg", grup: "Vitaminler", rda: [90, 75], ust: 2000, renk: "#fb923c"},
  {k: "D_ug", ad: "D vitamini", br: "µg", grup: "Vitaminler", rda: [15, 15], ust: 100, renk: "#facc15"},
  {k: "E_mg", ad: "E vitamini", br: "mg", grup: "Vitaminler", rda: [13, 11], ust: 300, renk: "#a3e635"},
  {k: "K_ug", ad: "K vitamini", br: "µg", grup: "Vitaminler", rda: [120, 90], ust: null, renk: "#4ade80"},
  {k: "B6_mg", ad: "B6 vitamini", br: "mg", grup: "Vitaminler", rda: [1.7, 1.5], ust: 25, renk: "#2dd4bf"},
  {k: "B12_ug", ad: "B12 vitamini", br: "µg", grup: "Vitaminler", rda: [2.4, 2.4], ust: null, renk: "#f472b6"},
  {k: "Folat_ug", ad: "Folat (B9)", br: "µg", grup: "Vitaminler", rda: [400, 400], ust: 1000, renk: "#34d399"},
  {k: "Ca_mg", ad: "Kalsiyum", br: "mg", grup: "Mineraller", rda: [1000, 1000], ust: 2500, renk: "#e2e8f0"},
  {k: "Fe_mg", ad: "Demir", br: "mg", grup: "Mineraller", rda: [8, 18], ust: 45, renk: "#ef4444"},
  {k: "Mg_mg", ad: "Magnezyum", br: "mg", grup: "Mineraller", rda: [400, 310], ust: null, renk: "#22c55e"},
  {k: "Zn_mg", ad: "Çinko", br: "mg", grup: "Mineraller", rda: [11, 8], ust: 40, renk: "#94a3b8"},
  {k: "Potasyum_mg", ad: "Potasyum", br: "mg", grup: "Mineraller", rda: [3500, 3500], ust: null, renk: "#a78bfa"},
  {k: "Se_ug", ad: "Selenyum", br: "µg", grup: "Mineraller", rda: [55, 55], ust: 400, renk: "#fbbf24"},
  {k: "Na_mg", ad: "Sodyum (tuz)", br: "mg", grup: "Mineraller", rda: [2000, 2000], ust: null, tip: "sinir", renk: "#cbd5e1"},
  {k: "Lif_g", ad: "Lif", br: "g", grup: "Lif & yağ asitleri", rda: [30, 25], ust: null, renk: "#84cc16"},
  {k: "Omega3_g", ad: "Omega-3 (toplam)", br: "g", grup: "Lif & yağ asitleri", rda: [1.6, 1.1], ust: null, renk: "#38bdf8"},
  {k: "EPADHA_mg", ad: "EPA + DHA", br: "mg", grup: "Lif & yağ asitleri", rda: [250, 250], ust: 3000, renk: "#0ea5e9"},
];
const MIKRO_HARITA = Object.fromEntries(MIKRO.map(m => [m.k, m]));

/* Kan testleri. lo/hi: [erkek,kadin] ya da sayi. sinirLo: bunun altinda 'sinirda'. hiSinir: bunun uzerinde 'sinirda'.
   mikro: durum 'dusuk'/'sinir' ise ilgili mikro hedefi carpani (oneri; elle degistirilebilir). */
const KAN = [
  {k: "d3", ad: "D vitamini (25-OH)", br: "ng/mL", lo: 20, sinirLo: 30, hi: 100, mikro: "D_ug", carpan: {dusuk: 2, sinir: 1.5}, takma: ["25 oh", "25-oh", "25(oh)", "25 hidroksi", "d vitamini", "vitamin d", "25-hidroksi"]},
  {k: "b12", ad: "B12 vitamini", br: "pg/mL", lo: 200, sinirLo: 300, hi: 900, mikro: "B12_ug", carpan: {dusuk: 2, sinir: 1.5}, takma: ["b12", "vitamin b12", "b 12", "kobalamin"]},
  {k: "ferritin", ad: "Ferritin", br: "ng/mL", lo: [30, 15], hi: [400, 150], mikro: "Fe_mg", carpan: {dusuk: 1.5}, takma: ["ferritin", "ferritin (serum)"]},
  {k: "hb", ad: "Hemoglobin", br: "g/dL", lo: [13, 12], hi: [17.5, 15.5], mikro: "Fe_mg", carpan: {dusuk: 1.25}, takma: ["hemoglobin", "hgb", "hb "], haric: ["a1c"]},
  {k: "folat", ad: "Folat", br: "ng/mL", lo: 4, sinirLo: 6, hi: 40, mikro: "Folat_ug", carpan: {dusuk: 1.5, sinir: 1.25}, takma: ["folat", "folik asit", "folic"]},
  {k: "mg", ad: "Magnezyum", br: "mg/dL", lo: 1.7, hi: 2.4, mikro: "Mg_mg", carpan: {dusuk: 1.25}, takma: ["magnezyum", "magnesium"]},
  {k: "ca", ad: "Kalsiyum", br: "mg/dL", lo: 8.5, hi: 10.5, mikro: "Ca_mg", carpan: {dusuk: 1.2}, takma: ["kalsiyum", "calcium", "ca "]},
  {k: "zn", ad: "Çinko", br: "µg/dL", lo: 70, hi: 120, mikro: "Zn_mg", carpan: {dusuk: 1.25}, takma: ["cinko", "çinko", "zinc"]},
  {k: "glukoz", ad: "Açlık glukozu", br: "mg/dL", lo: 70, hiSinir: 100, hi: 125, takma: ["aclik kan sekeri", "açlık kan şekeri", "glukoz", "glucose", "kan sekeri"]},
  {k: "hba1c", ad: "HbA1c", br: "%", lo: 4, hiSinir: 5.7, hi: 6.4, takma: ["hba1c", "hemoglobin a1c", "a1c"]},
  {k: "kol", ad: "Total kolesterol", br: "mg/dL", lo: 0, hiSinir: 200, hi: 239, takma: ["total kolesterol", "kolesterol"], haric: ["ldl", "hdl"]},
  {k: "ldl", ad: "LDL kolesterol", br: "mg/dL", lo: 0, hiSinir: 100, hi: 159, takma: ["ldl"]},
  {k: "hdl", ad: "HDL kolesterol", br: "mg/dL", lo: [40, 50], hi: 999, takma: ["hdl"]},
  {k: "tg", ad: "Trigliserid", br: "mg/dL", lo: 0, hiSinir: 150, hi: 199, takma: ["trigliserid", "trigliserit", "triglycerid"]},
  {k: "tsh", ad: "TSH", br: "mIU/L", lo: 0.4, hi: 4.0, takma: ["tsh", "tiroid uyarici", "tiroid uyaran"]},
  {k: "crp", ad: "CRP", br: "mg/L", lo: 0, hiSinir: 5, hi: 10, takma: ["crp", "c-reaktif", "c reaktif"]},
];
const KAN_HARITA = Object.fromEntries(KAN.map(t => [t.k, t]));
const kanSinir = (v, cins) => Array.isArray(v) ? v[cins === "k" ? 1 : 0] : v;
function kanDurum(t, deger, cins) {
  const lo = kanSinir(t.lo, cins), hi = kanSinir(t.hi, cins);
  if (lo != null && deger < lo) return "dusuk";
  if (t.sinirLo != null && deger < t.sinirLo) return "sinir";
  if (hi != null && deger > hi) return "yuksek";
  if (t.hiSinir != null && deger >= t.hiSinir) return "sinir";
  return "normal";
}
const DURUM_AD = {dusuk: "Düşük", sinir: "Sınırda", normal: "Normal", yuksek: "Yüksek"};

/* Tipik etiket degerleri; kullanici kendi urunune gore ozel takviye olusturabilir. */
const TAKVIYE_SABLON = [
  {ad: "D3 1000 IU (25 µg)", mikro: {D_ug: 25}}, {ad: "D3 2000 IU (50 µg)", mikro: {D_ug: 50}},
  {ad: "B12 500 µg", mikro: {B12_ug: 500}}, {ad: "B12 1000 µg", mikro: {B12_ug: 1000}},
  {ad: "Balık yağı 1000 mg (EPA+DHA ≈300 mg)", mikro: {EPADHA_mg: 300, Omega3_g: 0.3}},
  {ad: "Balık yağı yüksek doz (EPA+DHA ≈600 mg)", mikro: {EPADHA_mg: 600, Omega3_g: 0.6}},
  {ad: "Magnezyum 200 mg (elementel)", mikro: {Mg_mg: 200}}, {ad: "Magnezyum 400 mg (elementel)", mikro: {Mg_mg: 400}},
  {ad: "Çinko 15 mg", mikro: {Zn_mg: 15}}, {ad: "Demir 14 mg", mikro: {Fe_mg: 14}}, {ad: "Demir 28 mg", mikro: {Fe_mg: 28}},
  {ad: "C vitamini 500 mg", mikro: {C_mg: 500}}, {ad: "C vitamini 1000 mg", mikro: {C_mg: 1000}},
  {ad: "Kalsiyum 500 mg", mikro: {Ca_mg: 500}}, {ad: "Folik asit 400 µg", mikro: {Folat_ug: 400}}, {ad: "Selenyum 100 µg", mikro: {Se_ug: 100}},
  {ad: "Multivitamin (tipik)", mikro: {A_ug: 800, C_mg: 80, D_ug: 10, E_mg: 12, K_ug: 75, B6_mg: 1.4, B12_ug: 2.5, Folat_ug: 200, Zn_mg: 10, Se_ug: 55, Fe_mg: 14, Mg_mg: 100}},
];

/* ---------- cumle cozucu ("kahvaltida iki yumurta ve 2 dilim ekmek yedim") ---------- */
const SAYI_KELIME = {bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10, yarim: 0.5, ceyrek: 0.25};
const BIRIM_ESLEME = {g: "g", gr: "g", gram: "g", adet: "adet", tane: "adet", dilim: "dilim", bardak: "bardak", kasik: "kasik", tatlikasik: "tatlikasik",
  kase: "kase", tabak: "tabak", porsiyon: "porsiyon", avuc: "avuc", fincan: "fincan", kutu: "kutu", sise: "sise", olcek: "olcek", top: "top", kare: "kare",
  salkim: "salkim", somun: "somun", ceyrek: "ceyrek", sis: "sis", durum: "durum", kepce: "kepce", disi: "disi", yaprak: "yaprak", tablet: "tablet", yarim: "yarim"};
const OGUN_KELIME = {kahvalti: "kahvalti", sabah: "kahvalti", ogle: "ogle", oglen: "ogle", aksam: "aksam", ara: "ara", atistirma: "ara"};
const birimNorm = s => sade(s).replace(/su bardagi/, "bardak").replace(/cay bardagi/, "bardak").replace(/yemek kasigi/, "kasik")
  .replace(/tatli kasigi/, "tatlikasik").replace(/cay kasigi/, "tatlikasik").replace(/kasigi/, "kasik").replace(/bardagi/, "bardak").replace(/\s+/g, "");

function yiyecekIndeksle(liste) {
  return liste.map(y => Object.assign(y, {
    _ara: [sade(y.ad)].concat((y.takma || []).map(sade)),
    _birim: Object.fromEntries(Object.entries(y.birim || {}).map(([k, v]) => [birimNorm(k), v]))
  }));
}

function gramHesapla(y, miktar, birim) {
  const b = y._birim || {};
  if (birim === "g") return miktar;
  if (birim && b[birim] != null) return miktar * b[birim];
  if (birim && birim !== "g" && Object.keys(b).length) return miktar * (b.adet ?? b.porsiyon ?? Object.values(b)[0]);
  if (!birim && Object.keys(b).length) return miktar * (b.adet ?? b.porsiyon ?? Object.values(b)[0]);
  return miktar >= 10 ? miktar : miktar * 100;
}

function olcekle(y, gram) {
  const f = gram / 100, o = {ad: y.ad, gram: Math.round(gram), kcal: Math.round(y.kcal * f), protein: +(y.protein * f).toFixed(1),
    yag: +(y.yag * f).toFixed(1), karb: +(y.karb * f).toFixed(1), mikro: null};
  if (y.mikro) o.mikro = Object.fromEntries(Object.entries(y.mikro).map(([k, v]) => [k, +(v * f).toFixed(3)]));
  return o;
}

function enIyiEsles(adHam, liste) {
  let en = null, skor = 0;
  const GENEL = ["yemek", "yemegi", "yemekleri"];
  const kelimeler = adHam.split(" ").filter(w => w.length >= 3 && !GENEL.includes(w));
  for (const y of liste) {
    let s = 0;
    for (const a of y._ara) {
      if (adHam.includes(a)) s = Math.max(s, 200 + a.length);
      else if (adHam.length > 2 && a.includes(adHam)) s = Math.max(s, 100 + adHam.length - (a.length - adHam.length) * 0.2);
      else {
        const aw = a.split(" ").filter(w => !GENEL.includes(w)), ort = kelimeler.filter(k => aw.some(w => w.slice(0, 4) === k.slice(0, 4) && w.length >= 4)).reduce((t, k) => t + k.length, 0);
        if (ort) s = Math.max(s, ort);
      }
    }
    if (s > skor) { en = y; skor = s; }
  }
  return skor >= 4 ? en : null;
}

function cozCumle(metin, liste) {
  let t = sade(metin).replace(/su bardagi/g, "bardak").replace(/cay bardagi/g, "bardak").replace(/yemek kasigi/g, "kasik")
    .replace(/tatli kasigi/g, "tatlikasik").replace(/cay kasigi/g, "tatlikasik");
  let ogun = null;
  for (const [k, v] of Object.entries(OGUN_KELIME)) {
    const m = t.match(new RegExp("\\b" + k + "\\w*( icin| de| da)?"));
    if (m) { ogun = v; t = t.replace(m[0], " "); break; }
  }
  t = t.replace(/\b(yedim|ictim|yedik|attim|ekle|ekler misin|olarak|bugun|dun)\b/g, " ");
  const parcalar = t.split(/,|;|\bve\b|\+|\bbir de\b/).map(s => s.trim()).filter(Boolean);
  const ogeler = [], yok = [];
  for (const p of parcalar) {
    let miktar = null, birim = null; const kalan = [];
    const tk = p.split(" ");
    for (let i = 0; i < tk.length; i++) {
      const w = tk[i], sayi = parseFloat(w.replace(",", "."));
      const n = !isNaN(sayi) && /^[\d.,]+$/.test(w) ? sayi : SAYI_KELIME[w];
      if (n !== undefined && miktar === null) { miktar = n; continue; }
      if ((w === "bucuk" || w === "buçuk") && miktar !== null) { miktar += 0.5; continue; }
      if (BIRIM_ESLEME[w] && birim === null && miktar !== null) { birim = BIRIM_ESLEME[w]; continue; }
      if (BIRIM_ESLEME[w] && birim === null && miktar === null && ["gram", "gr", "g"].includes(w)) { birim = "g"; continue; }
      if (w !== "tane") kalan.push(w);
    }
    const adHam = kalan.join(" ");
    const y = enIyiEsles(adHam, liste);
    if (!y) { yok.push(p); continue; }
    const m = miktar ?? 1, gram = gramHesapla(y, m, birim);
    const o = olcekle(y, gram); o.soz = p; o.miktar = m; o.birimAd = birim;
    ogeler.push(o);
  }
  return {ogun, ogeler, yok};
}
