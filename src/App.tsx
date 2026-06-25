import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Scale, 
  GraduationCap, 
  MessageSquare, 
  Search, 
  History, 
  ExternalLink, 
  Sparkles, 
  Sun, 
  Moon, 
  FileText, 
  Compass, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2, 
  Building2, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { LIST_AKAD, DAFTAR_SEKTOR_HUKUM, SKRIPSI_TEMPLATES, PRESET_QUESTIONS } from "./data";
import AkadSimulator from "./components/AkadSimulator";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  // If AI response properties:
  ringkasan?: string;
  penjelasanMendalam?: string;
  referensiHukum?: string[];
  saranBacaan?: string[];
  mode?: "akademik" | "skripsi" | "umum";
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<"chat" | "pustaka" | "simulator" | "skripsi">("chat");
  const [chatMode, setChatMode] = useState<"akademik" | "skripsi" | "umum">("akademik");
  
  // Chat States
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Selamat datang di HES AI Assistant! Saya siap mendampingi Anda.",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
      ringkasan: "Assalamu'alaikum wr. wb. Saya adalah asisten akademik cerdas Anda.",
      penjelasanMendalam: "Silakan Ajukan Pertanyaan Akademik Hukum Ekonomi Syariah Anda. Saya dapat membantu menganalisis:\n\n* **Fikih Muamalah Klasik**: Penjelasan komprehensif 10 akad utama (Bai', Ijarah, Mudharabah, Musyarakah, dll).\n* **Regulasi & Fatwa**: Kompilasi Hukum Ekonomi Syariah (KHES), Fatwa DSN-MUI, serta Undang-Undang Republik Indonesia.\n* **Bimbingan Skripsi HES**: Mulai dari pencarian judul, pembuatan latar belakang, rumusan masalah, hingga metode riset normatif maupun empiris.\n\n*Silakan ganti sub-mode di bawah input chat untuk memfokuskan gaya jawaban saya.*",
      referensiHukum: ["Al-Qur'an dan Al-Hadis", "Fatwa DSN-MUI", "KHES (Buku II)"],
      saranBacaan: ["Pustaka Fikih Muamalah & Buku Syariah Kontemporer"],
      mode: "umum"
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatHistoryList, setChatHistoryList] = useState<{ id: string; query: string; time: string }[]>([]);

  // Pustaka Akad States
  const [searchAkad, setSearchAkad] = useState<string>("");
  const [selectedAkad, setSelectedAkad] = useState<string>("al-bai");

  // Skripsi Progress Interactive Simulator
  const [skripsiProgress, setSkripsiProgress] = useState<number>(45); // 45% default
  const [selectedSkripsiTemplate, setSelectedSkripsiTemplate] = useState<string>("skr-1");
  const [randomJudul, setRandomJudul] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Scroll smoothly to the main tabs/content section (used after switching tabs from hero buttons)
  const scrollToTabSection = () => {
    const el = document.getElementById("main-tabs-section");
    if (el) {
      // Small delay to ensure layout has updated after tab/state change
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  // Handle Preset Clicks
  const handlePresetClick = (query: string) => {
    setInputText(query);
    setActiveMainTab("chat");
    scrollToTabSection();
  };

  // Submit Question to API (Express -> Gemini SDK)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    setInputText("");

    // Create User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Save search history locally
    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      query: userMessageText,
      time: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistoryList(prev => [newHistoryItem, ...prev].slice(0, 8));

    try {
      // Gather simplified chat history representing roles as required by modern systems
      const systemHistory = messages.slice(-5).map(m => ({
        role: m.sender === "ai" ? "model" as const : "user" as const,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessageText,
          mode: chatMode,
          history: systemHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Server already returned a well-formed, user-friendly error payload (e.g. Gemini overloaded).
        // Use it directly instead of throwing into the generic catch-all fallback below.
        const aiErrMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: data.ringkasan || "Server AI sedang sibuk.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
          ringkasan: data.ringkasan,
          penjelasanMendalam: data.penjelasanMendalam,
          referensiHukum: data.referensiHukum || [],
          saranBacaan: data.saranBacaan || [],
          mode: chatMode
        };
        setMessages(prev => [...prev, aiErrMsg]);
        return;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.ringkasan || "Berikut adalah penjelasannya:",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
        ringkasan: data.ringkasan,
        penjelasanMendalam: data.penjelasanMendalam,
        referensiHukum: data.referensiHukum || [],
        saranBacaan: data.saranBacaan || [],
        mode: chatMode
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err: any) {
      console.error(err);
      // Fallback response inside the UI — only reached for genuine network failures
      // (request never reached the server, or response wasn't valid JSON at all).
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "Koneksi Bermasalah",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
        ringkasan: "Maaf, tidak dapat menghubungi server.",
        penjelasanMendalam: "Permintaan Anda gagal terkirim ke server, kemungkinan karena koneksi internet Anda terputus. Silakan periksa koneksi internet Anda dan **coba lagi beberapa saat kemudian**.\n\nNamun jangan khawatir, Anda tetap bisa menggunakan Pustaka Akad Lengkap, Sektor Hukum, dan Simulator Maslahat Kuantitatif di tab navigasi di atas secara instan bebas kuota!",
        referensiHukum: ["Periksa koneksi internet Anda"],
        saranBacaan: ["Gunakan panel simulator akad luar jaringan di tab atas."]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate random skripsi title helper for student ideation
  const handleGenerateJudulSpesifik = () => {
    const listJudulHES = [
      "Optimalisasi Akad Musyarakah Mutanaqisah (MMQ) pada Industri Finansial Teknologi Berbasis Syariah",
      "Analisis Konstruksi Hukum Eksekusi Jaminan Fidusia pada Perbankan Syariah Ditinjau dari Fatwa DSN-MUI",
      "Urgensi Penerapan Akad Wakalah Bil Ujrah Pada Bisnis Logistik Kurir Syariah Kontemporer",
      "Tinjauan Kompilasi Hukum Ekonomi Syariah (KHES) Terhadap Skema Dropshipping Tanpa Keterbukaan Barang (Gharar)",
      "Penyelesaian Sengketa Hubungan Kemitraan Antara Driver Ojek Online Dengan Aplikator Ditinjau Dari Konsep Akad Syirkah Abdan",
      "Perlindungan Konsumen Terhadap Jual Beli Mystery Box Pada Marketplace Shopee: Perspektif Hukum Positif & Fikih Jual Beli",
      "Tuntutan Al-Maqasid Syariah Atas Regulasi Pembatasan Transaksi Bunga Ribawi Berdasarkan Undang-Undang Perbankan"
    ];
    const randomIndex = Math.floor(Math.random() * listJudulHES.length);
    setRandomJudul(listJudulHES[randomIndex]);
  };

  // Clear chat logs
  const clearChatLogs = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "Sesi percakapan baru diaktifkan.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
        ringkasan: "Riwayat telah dibersihkan. Hubungi saya untuk penelitian baru.",
        penjelasanMendalam: "Silakan masukkan topik penelitian baru atau bandingkan regulasi akad syariah di Indonesia.",
        referensiHukum: ["Fatwa DSN-MUI", "Kompilasi Hukum Ekonomi Syariah (KHES)"]
      }
    ]);
  };

  // Filtered Akad List based on Search box
  const filteredAkads = LIST_AKAD.filter(ak => 
    ak.nama.toLowerCase().includes(searchAkad.toLowerCase()) || 
    ak.deskripsi.toLowerCase().includes(searchAkad.toLowerCase())
  );

  const selectedAkadObj = LIST_AKAD.find(ak => ak.id === selectedAkad) || LIST_AKAD[0];
  const selectedSkripsiTemplateObj = SKRIPSI_TEMPLATES.find(sk => sk.id === selectedSkripsiTemplate) || SKRIPSI_TEMPLATES[0];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-800"}`} id="hes-ai-root">
      
      {/* 1. Header Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0F766E] text-white shadow-xl border-b-4 border-[#D4AF37] px-4 md:px-8 py-3 flex flex-wrap items-center justify-between" id="navbar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-[#D4AF37]/50 shrink-0">
            <svg viewBox="0 0 32 32" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              {/* Open book shape representing fikih/kitab */}
              <path d="M16 8C13.5 6.5 9.5 6 6 6.5V23C9.5 22.5 13.5 23 16 24.5C18.5 23 22.5 22.5 26 23V6.5C22.5 6 18.5 6.5 16 8Z" fill="#0F766E"/>
              <path d="M16 8V24.5" stroke="#D4AF37" strokeWidth="1.2"/>
              {/* Small star accent */}
              <path d="M16 2L17.2 5.2L20.5 5.5L18 7.8L18.7 11L16 9.3L13.3 11L14 7.8L11.5 5.5L14.8 5.2L16 2Z" fill="#D4AF37"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight font-display">HES AI Assistant</span>
              <span className="bg-[#D4AF37] text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Akademik
              </span>
            </div>
            <p className="text-[11px] text-teal-100 opacity-90 leading-none">Asisten Riset & Fikih Muamalah Mahasiswa Hukum Ekonomi Syariah</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 md:gap-4 mt-3 sm:mt-0">
          <button 
            id="tab-chat"
            onClick={() => setActiveMainTab("chat")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeMainTab === "chat" 
                ? "bg-white text-[#0F766E] shadow" 
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tanya AI</span>
          </button>
          
          <button 
            id="tab-pustaka"
            onClick={() => setActiveMainTab("pustaka")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeMainTab === "pustaka" 
                ? "bg-white text-[#0F766E] shadow" 
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pustaka Akad</span>
          </button>

          <button 
            id="tab-simulator"
            onClick={() => setActiveMainTab("simulator")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeMainTab === "simulator" 
                ? "bg-white text-[#0F766E] shadow" 
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kalkulator Akad</span>
          </button>

          <button 
            id="tab-skripsi"
            onClick={() => setActiveMainTab("skripsi")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeMainTab === "skripsi" 
                ? "bg-white text-[#0F766E] shadow" 
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panduan Skripsi</span>
          </button>

          <div className="border-l border-teal-600/60 pl-3 md:pl-4 flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              title={darkMode ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Welcome Announcement */}
      <header className="bg-gradient-to-r from-emerald-900 via-[#0F766E] to-teal-800 text-white relative overflow-hidden py-8 px-4 md:px-8 border-b border-[#D4AF37]/30" id="hero-banner">
        {/* Decorative Islamic Arch Stars */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-8 select-none">
          <svg width="240" height="240" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50 0L61.2 38.8H100L68.8 61.2L80 100L50 76.4L20 100L31.2 61.2L0 38.8H38.8L50 0Z"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Inovasi Belajar Hukum Ekonomi Syariah Terkini
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display leading-tight">
              Satu Asisten Pintar Untuk Semua <span className="text-[#D4AF37]">Studi Syariah & Muamalah</span>
            </h1>
            <p className="text-teal-100 text-sm md:text-base mt-2 max-w-xl font-sans font-light">
              Mudah memahami perbedaan akad keuangan syariah, menyelaraskan fatwa DSN-MUI dengan hukum positif Indonesia, dan menyusun outline penelitian skripsi yang siap bimbingan.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-5 justify-center md:justify-start">
              <button 
                onClick={() => { setActiveMainTab("chat"); handlePresetClick("Jelaskan perbedaan akad mudharabah dan musyarakah menurut KHES dan Fatwa DSN-MUI..."); }}
                className="bg-[#D4AF37] text-slate-950 px-5 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 transition-all flex items-center gap-1 shadow-md hover:scale-[1.02]"
              >
                Mulai Bertanya <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => { setActiveMainTab("pustaka"); scrollToTabSection(); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                Jelajahi Fitur Akad
              </button>
            </div>
          </div>

          {/* Quick Islamic Illustration Minimalist Device Card */}
          <div className="w-full md:w-80 shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl text-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              <span className="text-[10px] text-teal-200 ml-auto font-mono">Maqasid Syariah Engine</span>
            </div>
            <p className="text-[11px] text-slate-200">
              "Fikih mementingkan kemudahan umum dan meminimalkan kerusakan ekonomi (Dar'ul mafasid muqaddamun 'ala jalbil mashalih)."
            </p>
            <div className="flex justify-between items-center text-[10px] bg-teal-800/40 p-2 rounded-lg text-teal-200">
              <span>📚 10 Akad Fikih Klasik</span>
              <span className="text-[#D4AF37] font-semibold">Aktif</span>
            </div>
            <div className="flex justify-between items-center text-[10px] bg-teal-800/40 p-2 rounded-lg text-teal-200">
              <span>⚖️ Putusan DSN-MUI & KHES</span>
              <span className="text-[#D4AF37] font-semibold">Tersinkron</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Content - Tabs & Interactivity */}
        <section className="lg:col-span-9 space-y-6 flex flex-col justify-stretch">
          
          {/* Main Action Tabs Controller */}
          <div id="main-tabs-section" className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 shadow-sm">
            
            {/* Nav Title & Context */}
            {activeMainTab === "chat" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest font-mono">
                      💬 Konsultasi Akademik HES AI
                    </span>
                  </div>
                  
                  {/* Select Chat Mode in UI */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setChatMode("akademik")}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        chatMode === "akademik"
                          ? "bg-[#0F766E] text-white shadow"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      title="Analisis Fikih Muamalah, Rukun, Syarat, & Pendapat Mazhab secara Detail"
                    >
                      🎓 Mode Akademik
                    </button>
                    <button
                      onClick={() => setChatMode("skripsi")}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        chatMode === "skripsi"
                          ? "bg-[#0F766E] text-white shadow"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      title="Bimbingan Desain Kerangka Skripsi, Rumusan Masalah & Metodologi Kualitatif"
                    >
                      📝 Mode Skripsi
                    </button>
                    <button
                      onClick={() => setChatMode("umum")}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        chatMode === "umum"
                          ? "bg-[#0F766E] text-white shadow"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      title="Tanya Jawab Bebas Hubungan Muamalah & Isu Hukum Kontemporer"
                    >
                      🌐 Umum
                    </button>
                  </div>
                </div>

                {/* Main Chat Stream Container */}
                <div className="h-[600px] overflow-y-auto px-2 space-y-4 custom-scroll" id="chat-messages-container">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar */}
                      {msg.sender === "ai" && (
                        <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-100 dark:ring-emerald-950">
                          AI
                        </div>
                      )}

                      <div className={`max-w-[85%] space-y-1.5 ${msg.sender === "user" ? "order-1" : "order-2"}`}>
                        {/* Chat Info Bubble Tag */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {msg.sender === "user" ? "Mahasiswa (Anda)" : "HES Akademik AI"}
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                          {msg.mode && (
                            <span className="ml-1 px-1 bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-300 rounded font-bold text-[9px] uppercase">
                              {msg.mode}
                            </span>
                          )}
                        </div>

                        {/* Speech Bubble body */}
                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                          msg.sender === "user" 
                            ? "bg-gradient-to-tr from-emerald-800 to-[#0F766E] text-white rounded-tr-none" 
                            : "bg-teal-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-teal-100/30 dark:border-slate-800"
                        }`}>
                          {/* Main answer text */}
                          <div className="whitespace-pre-line prose max-w-none">{msg.text}</div>

                          {/* Render parsed rich content if AI with structure */}
                          {msg.sender === "ai" && (msg.ringkasan || msg.penjelasanMendalam) && (
                            <div className="mt-4 pt-4 border-t border-teal-100/40 dark:border-slate-800 text-slate-900 dark:text-slate-200">
                              {/* Summary Box */}
                              {msg.ringkasan && (
                                <div className="p-3 bg-[#D4AF37]/10 dark:bg-amber-950/20 border-l-4 border-[#D4AF37] rounded-r-xl mb-3">
                                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                                    Intisari & Ringkasan Hukum
                                  </span>
                                  <p className="italic text-xs text-slate-700 dark:text-slate-300">{msg.ringkasan}</p>
                                </div>
                              )}

                              {/* Penjelasan Mendalam (Rich Markdown explanation) */}
                              {msg.penjelasanMendalam && (
                                <div className="space-y-2 text-xs">
                                  <span className="text-[10px] uppercase tracking-wide text-primary-base dark:text-teal-300 font-bold block">
                                    Penjelasan Ilmiah Komprehensif:
                                  </span>
                                  <div 
                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                      __html: msg.penjelasanMendalam
                                        .replace(/\n\n/g, '<br/><br/>')
                                        .replace(/\* \*\*(.*?)\*\*/g, '🔥 <b>$1</b>')
                                        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                                        .replace(/\* (.*?)\n/g, '• $1<br/>')
                                    }}
                                  />
                                </div>
                              )}

                              {/* Referensi Hukum List */}
                              {msg.referensiHukum && msg.referensiHukum.length > 0 && (
                                <div className="mt-3">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                                    ⚖️ Rujukan Dasar Hukum Pasca Analisis:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {msg.referensiHukum.map((ref, idx) => (
                                      <span 
                                        key={idx} 
                                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-mono flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                                      >
                                        <FileCheck className="w-2.5 h-2.5 text-emerald-600" />
                                        {ref}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Saran Bacaan Lanjutan */}
                              {msg.saranBacaan && msg.saranBacaan.length > 0 && (
                                <div className="mt-3">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                                    📖 Saran Bacaan & Referensi Buku:
                                  </span>
                                  <ul className="text-[11px] list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                                    {msg.saranBacaan.map((bk, idx) => (
                                      <li key={idx} className="hover:text-emerald-700 dark:hover:text-teal-300 transition-colors">
                                        {bk}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Avatar */}
                      {msg.sender === "user" && (
                        <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-slate-950 flex-shrink-0 flex items-center justify-center font-bold text-xs ring-2 ring-yellow-100">
                          MHS
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Loader Indicator */}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs animate-bounce">
                        ...
                      </div>
                      <div className="bg-teal-50/50 dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none border border-teal-100/20 dark:border-slate-900 max-w-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-slate-500 italic">HES Assistant sedang menelaah kitab-kitab fikih klasik dan KHES...</span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Preset Suggestions Pills */}
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-teal-800 dark:text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      Pertanyaan Akademik Populer Mahasiswa:
                    </span>
                    <button 
                      onClick={clearChatLogs}
                      className="text-[10px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
                      title="Hapus riwayat dialog untuk memulai sesi ilmiah yang baru"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Bersihkan Chat
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    {PRESET_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePresetClick(q)}
                        className="text-left bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3 py-2.5 rounded-lg hover:border-[#0F766E] dark:hover:border-teal-500 hover:bg-teal-50/20 dark:hover:bg-slate-800/50 transition-all font-medium text-slate-700 dark:text-slate-300 leading-snug overflow-hidden min-h-[64px]"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                        }}
                      >
                        ❓ {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area Form */}
                <form onSubmit={handleSendMessage} className="pt-2">
                  <div className="relative">
                    <input
                      type="text"
                      id="chat-input-bar"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={
                        chatMode === "akademik" 
                          ? "Tulis pertanyaan (Contoh: Apa hukum gharar dalam transaksi e-commerce menurut Kompilasi Hukum Syariah?)"
                          : chatMode === "skripsi"
                          ? "Butuh saran riset (Contoh: Berikan ide judul skripsi fintech syariah tentang wakalah bil ujrah)"
                          : "Contoh: Jelaskan perbedaan akad ijarah dengan sewa menyewa hukum perdata..."
                      }
                      className="w-full pl-4 pr-24 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[12px] outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-teal-600/10 transition-all text-slate-800 dark:text-white"
                    />
                    
                    {/* Submit and Indicator trigger */}
                    <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
                      <button
                        type="submit"
                        disabled={!inputText.trim() || isTyping}
                        className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                          inputText.trim() && !isTyping
                            ? "bg-[#0F766E] text-white hover:bg-emerald-800 shadow"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Kirim
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Pustaka Akad Browser */}
            {activeMainTab === "pustaka" && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-base" />
                      Eksplorasi Pustaka 10 Akad Fikih Muamalah Utama
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Rangkuman rukun, syarat sah, dasar hukum Al-Qur'an/Hadis, Kompilasi Hukum (KHES) & Fatwa DSN MUI.
                    </p>
                  </div>
                  
                  {/* Search box for Akad */}
                  <div className="relative max-w-xs w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchAkad}
                      onChange={(e) => setSearchAkad(e.target.value)}
                      placeholder="Cari nama akad (e.g., Ijarah)..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-base"
                    />
                  </div>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left list directory */}
                  <div className="md:col-span-4 space-y-2 max-h-[460px] overflow-y-auto pr-1 complex-scroll">
                    {filteredAkads.map((ak) => (
                      <button
                        key={ak.id}
                        onClick={() => setSelectedAkad(ak.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          selectedAkad === ak.id
                            ? "bg-emerald-50/70 dark:bg-slate-900 border-[#0F766E] dark:border-teal-500 shadow-sm"
                            : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <div className="space-y-0.5 max-w-[85%]">
                          <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{ak.nama}</span>
                          <span className="block text-[10px] text-slate-400 font-mono truncate">{ak.deskripsi}</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">{ak.namaArab}</span>
                      </button>
                    ))}
                    {filteredAkads.length === 0 && (
                      <p className="text-xs text-slate-400 italic p-4 text-center">Akad tidak ditemukan.</p>
                    )}
                  </div>

                  {/* Right display content */}
                  <div className="md:col-span-8 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/55 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] text-[#D4AF37] font-bold font-mono tracking-widest block uppercase">
                          AKAD DETAIL
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          {selectedAkadObj.nama}
                        </h3>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700 dark:text-teal-400 bg-emerald-50 dark:bg-teal-950/50 px-3 py-1 rounded-xl">
                        {selectedAkadObj.namaArab}
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      " {selectedAkadObj.deskripsi} "
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Pihak Terlibat */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                          👥 Pihak Yang Bertransaksi (Subjek):
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                          {selectedAkadObj.pelaku.map((pl, i) => (
                            <li key={i}>{pl}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Rukun */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                          📌 Rukun Akad:
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {selectedAkadObj.rukun.map((rk, i) => (
                            <li key={i}>{rk}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Syarat Sah */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                          ✅ Syarat Sah Agar Bebas Dari Batil (Syarat In'iqad):
                        </span>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                          {selectedAkadObj.syarat.map((sy, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{sy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dasar Hukum Positif & Syariah */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 md:col-span-2 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          ⚖️ Sumber/Dasar Pokok Regulasi & Syariah Indonesia:
                        </span>
                        <div className="space-y-1.5">
                          {selectedAkadObj.dasarHukum.map((dh, i) => (
                            <p 
                              key={i} 
                              className="text-[11px] p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-300 border-l-4 border-[#0F766E] font-medium"
                            >
                              {dh}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Aplikasi Operasional */}
                      <div className="bg-[#0F766E]/5 dark:bg-teal-950/20 p-4 rounded-xl border border-[#0F766E]/20 md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-400 block mb-1 tracking-wider">
                          💼 Implementasi Riil di Lembaga Keuangan Syariah (LKS):
                        </span>
                        <p className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                          {selectedAkadObj.penerapan}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Simulations */}
            {activeMainTab === "simulator" && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-2">
                <AkadSimulator />
              </div>
            )}

            {/* Tab 4: Skripsi templates */}
            {activeMainTab === "skripsi" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary-base" />
                    Asisten Penelitian & Inspirasi Kerangka Skripsi
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Template rancangan penelitian akademik Hukum Ekonomi Syariah terlatih. Pilih kategori riset Anda untuk mendalami format penulisan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Category select buttons */}
                  <div className="md:col-span-4 space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block mb-2">
                      PILIH TOPIK PENELITIAN:
                    </span>
                    {SKRIPSI_TEMPLATES.map((sk) => (
                      <button
                        key={sk.id}
                        onClick={() => setSelectedSkripsiTemplate(sk.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          selectedSkripsiTemplate === sk.id
                            ? "bg-emerald-50/70 dark:bg-slate-900 border-[#0F766E] dark:border-teal-500"
                            : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <span className="block text-[10px] text-amber-600 dark:text-yellow-500 font-bold uppercase tracking-wider mb-1">
                          {sk.kategori}
                        </span>
                        <span className="block text-xs font-semibold text-slate-900 dark:text-slate-200 line-clamp-2">
                          {sk.judulRekomendasi}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Display skripsi template content */}
                  <div className="md:col-span-8 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-400 tracking-widest block font-mono mb-1">
                        REKOMENDASI JUDUL ILMIAH
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
                        " {selectedSkripsiTemplateObj.judulRekomendasi} "
                      </h3>
                    </div>

                    {/* Gap Analysis */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <h4 className="text-xs font-bold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Urgensi Permasalahan & Gap Analysis (Untuk Latar Belakang):
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {selectedSkripsiTemplateObj.latarBelakangGap}
                      </p>
                    </div>

                    {/* Rumusan Masalah */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <h4 className="text-xs font-bold text-[#0F766E] dark:text-teal-400 mb-2">
                        ❓ Rumusan Masalah Riset:
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside">
                        {selectedSkripsiTemplateObj.rumusanMasalah.map((rm, idx) => (
                          <li key={idx} className="italic">{rm}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Kerangka Berpikir */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        📋 Estimasi Kerangka Berpikir (Draft Outline Bab):
                      </h4>
                      <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-300">
                        {selectedSkripsiTemplateObj.kerangkaPikir.map((kp, idx) => (
                          <p key={idx} className="pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                            {kp}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Metodologi */}
                    <div className="bg-teal-50/50 dark:bg-slate-950 p-4 rounded-xl border border-teal-100/50 dark:border-slate-800 text-xs">
                      <h4 className="text-xs font-bold text-teal-800 dark:text-teal-400 tracking-wide mb-1">
                        🔬 Saran Metodologi Penelitian:
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300">
                        {selectedSkripsiTemplateObj.metodologiSaran}
                      </p>
                    </div>

                    {/* Ask AI Trigger */}
                    <div className="flex justify-between items-center bg-[#D4AF37]/5 p-3.5 rounded-xl border border-[#D4AF37]/20">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ingin Mengembangkan Bab Ini Lewat AI?</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Analisis instan rumusan masalah di atas langsung di chatbot.</p>
                      </div>
                      <button
                        onClick={() => {
                          setChatMode("skripsi");
                          handlePresetClick(`Bantu rancang latar belakang penelitian HES dengan judul: "${selectedSkripsiTemplateObj.judulRekomendasi}". Serta sertakan rujukan Fatwa DSN-MUI yang relevan.`);
                        }}
                        className="bg-[#0F766E] hover:bg-emerald-800 text-white font-bold text-[11px] px-3.5 py-2 rounded-lg shadow whitespace-nowrap transition-colors"
                      >
                        Bimbingan Judul Ini
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick Informational Cards row explaining Shariah Economic Laws */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="features">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:translate-y-[-2px] transition-all duration-350">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-lg mb-2">
                📖
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Akad Fikih Muamalah</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Tersedia penjelasan 10 akad esensial: Al-Bai', Mudharabah, Wadiah, hingga Kafalah untuk bekal munaqasyah skripsi.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:translate-y-[-2px] transition-all duration-350">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/25 flex items-center justify-center text-lg mb-2">
                ⚖️
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Analisis Dua Dimensi</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Membandingkan secara otomatis pasal di Kompilasi Hukum Ekonomi Syariah (KHES) dengan Fatwa DSN-MUI & Undang-Undang RI.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:translate-y-[-2px] transition-all duration-350">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-slate-800 flex items-center justify-center text-lg mb-2">
                📝
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Outline Penelitian</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Bantuan menyusun instrumen penelitian, menguji legal gap masalah sosial-ekonomi syariah kontemporer.
              </p>
            </div>
          </div>

        </section>

        {/* Right Side Column (Dynamic Information Hub) */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* 1. Interactive Slider for Thesis Progress */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-[#0F766E] dark:text-teal-400 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4.5 h-4.5 text-[#D4AF37]" />
              Progress Penulisan Skripsi Anda
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Sesuaikan status skripsi Anda saat ini untuk melihat analisis kesiapan sidang ujian munaqasyah Anda.
            </p>
            
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Tahapan Riset HES</span>
                <span className="text-[#D4AF37] font-mono">{skripsiProgress}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={skripsiProgress}
                onChange={(e) => setSkripsiProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                id="skripsi-range-progress"
              />

              {/* Dynamic feedback message based on value chosen */}
              <div className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans pt-1">
                {skripsiProgress <= 20 && (
                  <span>❌ <b>Tahap Awal:</b> Fokuslah pada perumusan **Latar Belakang Masalah** (mencari kesenjangan antara fatwa ideal dengan kenyataan lapangan usahawan).</span>
                )}
                {skripsiProgress > 20 && skripsiProgress <= 40 && (
                  <span>📚 <b>Bab I-II:</b> Mulai telaah dalil (naqliyah/hadis) serta carilah perundang-undangan positif (seperti UU Perbankan Syariah) sebagai pisau analisis.</span>
                )}
                {skripsiProgress > 40 && skripsiProgress <= 65 && (
                  <span>🔬 <b>Bab III Metodologi:</b> Mantapkan apakah penelitian Anda menggunakan komparasi pustaka murni (yuridis normatif) atau wawancara pelaku usaha (yuridis empiris).</span>
                )}
                {skripsiProgress > 65 && skripsiProgress <= 85 && (
                  <span>💡 <b>Bab IV Analisis Pembahasan:</b> Segera tabulasikan perbedaan akad akad fikih menurut pandangan ulama mazhab Hanafi/Syafii dengan realita KHES Indonesia.</span>
                )}
                {skripsiProgress > 85 && (
                  <span className="text-[#0F766E] dark:text-teal-400 font-bold animate-pulse">🎉 <b>Siap Sidang Munaqasyah!</b> Selamat, periksa kembali kelengkapan catatan kaki (footnotes) dan orisinalitas plagiat turnitin Anda.</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Directory Regulasi Sektoral Sariah */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0F766E] dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Scale className="w-4.5 h-4.5 text-[#D4AF37]" />
              Dasar Regulasi Ekonomi Syariah Sektoral
            </h3>

            <div className="space-y-3 custom-scroll max-h-[350px] overflow-y-auto pr-1">
              {DAFTAR_SEKTOR_HUKUM.map((skt) => (
                <div 
                  key={skt.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 transition-all font-sans"
                >
                  <span className="text-[10px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider block">
                    Sektor Keuangan
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-0.5">
                    {skt.sektor}
                  </h4>

                  <div className="mt-2 text-[10.5px] space-y-1 text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-emerald-500 pl-2">
                    <p><b>KHES:</b> {skt.khesPasal}</p>
                    <p><b>UU Positif:</b> {skt.hukumPositif}</p>
                    <p><b>Sengketa:</b> {skt.penyelesaianSengketa}</p>
                  </div>

                  {/* MUI Fatwas list inside bubble */}
                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest block font-mono">
                      FATWA DSN-MUI RELEVAN:
                    </span>
                    <ul className="list-disc list-inside text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 font-medium">
                      {skt.fatwaMui.map((ft, i) => (
                        <li key={i} className="truncate" title={ft}>{ft}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Random Title Generator Wing */}
          <div className="bg-gradient-to-br from-emerald-950 via-[#0F766E] to-teal-900 text-white p-5 rounded-2xl relative overflow-hidden" id="title-generator-widget">
            <div className="relative z-10 space-y-3">
              <span className="bg-[#D4AF37] text-slate-950 text-[9px] font-bold font-mono tracking-widest px-2 py-0.5 rounded-full uppercase">
                INTELLIGENT GENERATOR
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-200">Sedang Bingung Judul Skripsi?</h3>
                <p className="text-[10.5px] opacity-90 leading-relaxed mt-1">
                  Dapatkan rekomendasi judul skripsi kontemporer yang relevan dengan tren perbankan dan fintech syariah saat ini.
                </p>
              </div>

              {randomJudul && (
                <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs italic font-semibold leading-relaxed animate-fade-in text-white shadow-inner">
                  " {randomJudul} "
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleGenerateJudulSpesifik}
                  className="w-full py-2 bg-[#D4AF37] text-teal-950 text-xs font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-md transform active:scale-95"
                >
                  {randomJudul ? "Generate Judul Lain" : "Dapatkan Contoh Judul Instan"}
                </button>
                {randomJudul && (
                  <button
                    onClick={() => {
                      setChatMode("skripsi");
                      handlePresetClick(`Buat rancangan rumusan masalah dan metodologi penelitian yang ideal untuk judul skripsi HES berikut: "${randomJudul}".`);
                    }}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white"
                    title="Analisis judul ini"
                  >
                    🔍
                  </button>
                )}
              </div>
            </div>
            
            {/* Background vector orb */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          </div>

        </aside>

      </main>

      {/* 3. Global Footer */}
      <footer className="mt-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 py-6 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-xs font-serif" id="footer">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <span className="font-bold text-[#0F766E] font-sans">HES AI Assistant</span>
          <span className="text-slate-400">•</span>
          <p className="not-italic text-[11px] font-sans text-slate-400">© 2026. Dikembangkan khusus bagi civitas akademika Program Studi Hukum Ekonomi Syariah.</p>
        </div>
        <div className="flex gap-4 font-sans text-[11px]">
          <a href="#navbar" className="text-emerald-700 dark:text-teal-400 hover:underline">Kembali Ke Atas</a>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 italic">"Al-Maslahah Al-Mursalah"</span>
        </div>
      </footer>

    </div>
  );
}
