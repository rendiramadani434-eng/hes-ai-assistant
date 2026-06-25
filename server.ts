import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy client generation to handle missing API keys gracefully without crashing
let aiInstance: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Detect transient/overload errors worth retrying (503 = model overloaded, 429 = rate limited)
function isRetryableError(error: any): boolean {
  const message = typeof error?.message === "string" ? error.message : JSON.stringify(error);
  return (
    error?.code === 503 ||
    error?.code === 429 ||
    message.includes('"code":503') ||
    message.includes('"code":429') ||
    message.toLowerCase().includes("overload") ||
    message.toLowerCase().includes("high demand") ||
    message.toLowerCase().includes("unavailable")
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Call Gemini with automatic retry + exponential backoff when the model is temporarily
// overloaded (503) or rate-limited (429). Other errors (bad request, auth, etc.) fail fast.
async function callGeminiWithRetry(params: any, maxRetries = 2): Promise<any> {
  const ai = getGenAI();
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      const isLastAttempt = attempt === maxRetries;

      if (!isRetryableError(error) || isLastAttempt) {
        throw error;
      }

      const delayMs = 800 * Math.pow(2, attempt);
      console.warn(`Gemini overloaded, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

// System Persona & Mode Definitions
const BASE_PERSONA = `Anda adalah dosen senior dan asisten akademik Hukum Ekonomi Syariah (HES) yang menguasai fikih muamalah klasik, Kompilasi Hukum Ekonomi Syariah (KHES), fatwa Dewan Syariah Nasional (DSN-MUI), sistem perbankan syariah, asuransi syariah, lembaga keuangan syariah, metodologi riset akademik, dan hukum positif Indonesia.
Berikan respons yang ilmiah, sistematis, ramah akademis, terarah, dan berbasis referensi konkret.`;

const DEFAULTS_MODE_INSTRUCTIONS = `Berikan jawaban yang seimbang antara rujukan fikih muamalah klasik dan kerangka regulasi modern Indonesia. Pastikan setiap komponen terisi dengan lengkap, jelas, serta memberikan wawasan praktis bagi mahasiswa.`;

const AKADEMIK_MODE_INSTRUCTIONS = `Fokus secara mendalam pada analisis teoretis fikih muamalah. Uraikan definisi etimologis dan terminologis, rukun, syarat sah (syarat in'iqad), pendapat mazhab fikih terkemuka (Hanafi, Maliki, Syafii, Hambali) jika terdapat khilafiyah, serta kaitkan secara presisi dengan Kompilasi Hukum Ekonomi Syariah (KHES) dan Fatwa DSN-MUI yang relevan. Jika ada dalil berupa Al-Qur'an (nama surah & nomor ayat) atau Hadis (perawi), mohon cantumkan dengan pelafalan terjemahan yang jelas.`;

const SKRIPSI_MODE_INSTRUCTIONS = `Fokus sebagai pembimbing riset, metodologi, dan penulisan skripsi HES. Bantu mahasiswa menganalisis judul, menyusun latar belakang masalah yang urgen (gap analisis), merumuskan rumusan masalah yang tajam, menawarkan metodologi penelitian hukum (apakah yuridis normatif, yuridis empiris, sosiologi hukum, dsb.), merancang kerangka berpikir/outline skripsi secara sistematis bab demi bab, serta merekomendasikan literatur rujukan primer dan sekunder.`;

// 1. API Route: Chat with HES AI
app.post("/api/chat", async (req, res) => {
  try {
    const { message, mode, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return beautiful simulated response if API key is missing
      return res.json({
        ringkasan: "Kunci API Gemini tidak terkonfigurasi.",
        penjelasanMendalam: "Untuk mengaktifkan asisten cerdas HES AI secara penuh, Harap lengkapi kunci API Gemini Anda di menu **Settings > Secrets** di Google AI Studio dengan nama variabel `GEMINI_API_KEY`.\n\nSementara itu, berikut adalah informasi simulasi: Hukum Ekonomi Syariah mempelajari integrasi muamalah dengan hukum positif. Pastikan API key terpasang untuk mendapatkan jawaban riset real-time.",
        referensiHukum: ["Harap konfigurasi GEMINI_API_KEY", "Fatwa DSN-MUI Terkait", "Kompilasi Hukum Ekonomi Syariah (KHES)"],
        saranBacaan: ["Petunjuk konfigurasi API Key di panel AI Studio UI", "Buku Fikih Muamalah Kontemporer"]
      });
    }

    // Mode-specific prompts
    let modeInstruction = DEFAULTS_MODE_INSTRUCTIONS;
    if (mode === "akademik") {
      modeInstruction = AKADEMIK_MODE_INSTRUCTIONS;
    } else if (mode === "skripsi") {
      modeInstruction = SKRIPSI_MODE_INSTRUCTIONS;
    }

    const systemInstruction = `${BASE_PERSONA}\n\nMODUS UTAMA: ${modeInstruction}\n\nFormat output WAJIB mengikuti JSON schema yang ditentukan. Output harus disajikan dalam Bahasa Indonesia yang formal, ilmiah, rapi, dan mudah dimengerti mahasiswa.`;

    // Process history if provided
    const formattedHistory = Array.isArray(history) ? history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    })) : [];

    // Combine history for generation context
    const response = await callGeminiWithRetry({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ringkasan: {
              type: Type.STRING,
              description: "Ringkasan jawaban dalam 1-3 kalimat padat, informatif, dan langsung menyentuh esensi pertanyaan."
            },
            penjelasanMendalam: {
              type: Type.STRING,
              description: "Penjelasan akademis yang komprehensif, runut, mendalam dalam format Markdown. Gunakan poin-poin tebal (bold), kutipan (blockquote), dan paragraf terstruktur. Sertakan pendapat ulama/mazhab, dalil Al-Qur'an/Hadis bila relevan, asuransi/perbankan syariah terapan, serta penjelasan komparatif hukum positif."
            },
            referensiHukum: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar referensi regulasi konkret (misalnya: Fatwa DSN-MUI No. XX tahun XX, KHES Buku II Bab XX, Undang-Undang No. 21 Tahun 2008, dsb.)"
            },
            saranBacaan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Saran buku-buku referensi terkemuka (misalnya karya Wahbah al-Zuhaili, Sayyid Sabiq, Adiwarman Karim), nama jurnal bereputasi, atau bahan hukum lanjutan."
            }
          },
          required: ["ringkasan", "penjelasanMendalam", "referensiHukum", "saranBacaan"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    const overloaded = isRetryableError(error);

    return res.status(503).json({
      ringkasan: overloaded
        ? "Server AI sedang sangat sibuk."
        : "Terjadi kesalahan saat menghubungi server AI.",
      penjelasanMendalam: overloaded
        ? "Model Gemini yang digunakan sedang menerima banyak permintaan dari pengguna lain di seluruh dunia secara bersamaan. Sistem sudah mencoba menghubungi ulang beberapa kali secara otomatis, namun masih belum berhasil.\n\nSilakan **tunggu sekitar 30-60 detik**, lalu kirim ulang pertanyaan Anda. Ini bukan masalah pada akun atau kunci API Anda."
        : "Terjadi kendala teknis saat menghubungi layanan AI. Silakan coba lagi beberapa saat lagi.",
      referensiHukum: [],
      saranBacaan: [],
      _debug: error.message || "Unknown error occurred"
    });
  }
});

// Serve frontend app with Vite or statics
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server HES AI running on port ${PORT}`);
  });
}

startServer();
