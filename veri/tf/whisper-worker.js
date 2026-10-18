// Cihazda calisan Whisper (transformers.js + onnxruntime-web, WASM). Ses cihazdan cikmaz;
// yalniz model dosyalari ilk kullanimda Hugging Face'ten iner ve tarayici onbellegine yazilir.
import { pipeline, env } from "./transformers.min.js";

env.allowLocalModels = false;
env.backends.onnx.wasm.wasmPaths = new URL("./", import.meta.url).href;
env.backends.onnx.wasm.numThreads = 1;

const MODELLER = { hizli: "onnx-community/whisper-base", dogru: "onnx-community/whisper-small" };
let boru = null, yuklu = "";

async function yukle(m) {
  const ad = MODELLER[m] || MODELLER.dogru;
  if (boru && yuklu === ad) return boru;
  boru = null; yuklu = ad;
  const dosyalar = {};
  boru = await pipeline("automatic-speech-recognition", ad, {
    device: "wasm", dtype: "q8",
    progress_callback: p => {
      if (p.status === "progress" && p.file) {
        dosyalar[p.file] = { yuklenen: p.loaded || 0, toplam: p.total || 0 };
        let y = 0, t = 0; for (const k in dosyalar) { y += dosyalar[k].yuklenen; t += dosyalar[k].toplam; }
        self.postMessage({ tur: "ilerleme", yuzde: t ? Math.round(100 * y / t) : 0, mb: Math.round(t / 1048576) });
      } else if (p.status === "ready") self.postMessage({ tur: "hazir" });
    }
  });
  return boru;
}

self.onmessage = async e => {
  try {
    if (e.data.tur === "onisle") { await yukle(e.data.model); self.postMessage({ tur: "hazir" }); return; }
    const b = await yukle(e.data.model);
    self.postMessage({ tur: "cozuyor" });
    const s = await b(e.data.ses, { language: "turkish", task: "transcribe", chunk_length_s: 30, stride_length_s: 5, max_new_tokens: 160, no_repeat_ngram_size: 4, repetition_penalty: 1.15 });
    self.postMessage({ tur: "sonuc", metin: (s.text || "").trim() });
  } catch (err) { self.postMessage({ tur: "hata", mesaj: String(err && err.message || err) }); }
};
