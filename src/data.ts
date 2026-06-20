export interface AkadDetails {
  id: string;
  nama: string;
  namaArab: string;
  deskripsi: string;
  pelaku: string[];
  rukun: string[];
  syarat: string[];
  dasarHukum: string[];
  penerapan: string;
}

export interface HukumSektor {
  id: string;
  sektor: string;
  fatwaMui: string[];
  khesPasal: string;
  hukumPositif: string;
  penyelesaianSengketa: string;
}

export interface SkripsiTemplate {
  id: string;
  kategori: string;
  judulRekomendasi: string;
  latarBelakangGap: string;
  rumusanMasalah: string[];
  kerangkaPikir: string[];
  metodologiSaran: string;
}

export const LIST_AKAD: AkadDetails[] = [
  {
    id: "al-bai",
    nama: "Al-Bai' (Jual Beli)",
    namaArab: "البيع",
    deskripsi: "Akad pemindahan kepemilikan barang atau aset dengan imbalan berupa uang atau alat pembayaran yang sah, saling merelakan (taradhin).",
    pelaku: ["Penjual (Bai')", "Pembeli (Musytari)"],
    rukun: [
      "Pihak yang bertransaksi (Penjual & Pembeli)",
      "Objek transaksi (Ma'qud 'Alaih / Barang & Harga)",
      "Pernyataan kesepakatan (Sighat / Ijab & Qabul)"
    ],
    syarat: [
      "Pelaku harus cakap hukum (baligh, berakal, tanpa paksaan).",
      "Barang suci, bernilai manfaat, milik penuh, dapat diserahkan, dan diketahui sifat/kadarnya secara jelas.",
      "Harga harus disepakati jelas saat akad terjadi."
    ],
    dasarHukum: [
      "Al-Qur'an Surah Al-Baqarah ayat 275: '...Padahal Allah telah menghalalkan jual beli dan mengharamkan riba...'",
      "Fatwa DSN-MUI No. 110/DSN-MUI/IX/2017 tentang Akad Jual Beli.",
      "KHES Buku II pasal 26 s.d 54."
    ],
    penerapan: "Transaksi ritel harian, pembelian barang dagangan, dan dasar dari berbagai pembiayaan perbankan syariah."
  },
  {
    id: "ijarah",
    nama: "Ijarah (Sewa Menyewa)",
    namaArab: "الإجارة",
    deskripsi: "Akad pemindahan hak guna (manfaat) atas suatu barang atau jasa dalam waktu tertentu lewat pembayaran upah/sewa (ujrah), tanpa diikuti pemindahan kepemilikan barang itu sendiri.",
    pelaku: ["Pemberi Sewa (Mu'ajjir)", "Penyewa (Musta'jir)"],
    rukun: [
      "Pemberi sewa dan Penyewa",
      "Objek sewa (manfaat aset / jasa tenaga kerja)",
      "Uang sewa/upah (Ujrah)",
      "Ijab Qabul (Sighat)"
    ],
    syarat: [
      "Manfaat objek harus mubah (bukan maksiat), bernilai ekonomis, dan terukur durasinya.",
      "Nilai sewa (ujrah) harus ditentukan dan diketahui secara pasti di awal.",
      "Objek sewa tetap utuh kepemilikannya di tangan pemilik."
    ],
    dasarHukum: [
      "QS. At-Thalaq ayat 6: '...Jika mereka menyusukan (anak-anak)mu maka berikanlah upah mereka...'",
      "Fatwa DSN-MUI No. 09/DSN-MUI/IV/2000 tentang Pembiayaan Ijarah.",
      "KHES Buku II pasal 295 s.d 337."
    ],
    penerapan: "Sewa ruko/rumah, pembiayaan multijasa pendidikan/kesehatan, leasing kendaraan (IMBT)."
  },
  {
    id: "mudharabah",
    nama: "Mudharabah (Bagi Hasil Kepercayaan)",
    namaArab: "المضاربة",
    deskripsi: "Kerja sama usaha antara pemilik modal (shahibul maal) yang menyediakan 100% dana, dengan pengelola modal (mudharib) yang mengandalkan keahlian. Keuntungan dibagi sesuai nisbah yang disepakati, sedangkan kerugian materi ditanggung pemilik modal selama bukan kelalaian pengelola.",
    pelaku: ["Pemilik Modal (Shahibul Maal)", "Pengelola (Mudharib)"],
    rukun: [
      "Pemilik dana & Pengelola usaha",
      "Modal (Ra'sul Maal)",
      "Kegiatan Usaha (Amal)",
      "Keuntungan dibagi lewat Nisbah (Profit Sharing)",
      "Ijab Qabul"
    ],
    syarat: [
      "Modal harus berwujud uang tunai atau setara tunai, jelas jumlahnya, bukan piutang.",
      "Pembagian keuntungan wajib dinyatakan dalam rasio/nisbah persentase (e.g. 60:40) bukan nominal pasti.",
      "Pengelola memiliki kebebasan operasional, pemilik tidak boleh mengintervensi terlalu ketat (kecuali Mudharabah Muqayyadah)."
    ],
    dasarHukum: [
      "Hadis Nabi riwayat Ibnu Majah: 'Tiga hal yang di dalamnya ada keberkatan: Jual beli bertangguh, muqaradhah (mudharabah), dan mencampur gandum dengan jelai...'",
      "Fatwa DSN-MUI No. 07/DSN-MUI/IV/2000 tentang Pembiayaan Mudharabah.",
      "KHES Buku II pasal 184 s.d 232."
    ],
    penerapan: "Simpanan deposito syariah, tabungan rencana, pembiayaan modal kerja konstruksi bagi pelaku usaha."
  },
  {
    id: "musyarakah",
    nama: "Musyarakah (Kemitraan)",
    namaArab: "المشاركة",
    deskripsi: "Akad kerja sama antara dua pihak atau lebih untuk suatu usaha tertentu, di mana masing-masing pihak memberikan kontribusi modal/keahlian dengan ketentuan keuntungan dibagi sesuai nisbah kesepakatan dan kerugian dibagi secara proporsional sesuai porsi modal.",
    pelaku: ["Mitra Usaha (Syariik)"],
    rukun: [
      "Para mitra (Syuraka')",
      "Proyek/Usaha ekonomi",
      "Modal kontribusi (Mal)",
      "Nisbah profit, porsi kerugian (Nisbah al-Ribh wa al-Khasarah)",
      "Sighat (Ijab Qabul)"
    ],
    syarat: [
      "Setiap mitra berkontribusi finansial atau keahlian/kerja.",
      "Kerugian harus ditanggung persis sesuai persentase modal (kaidah 'Al-ghunmu bil ghurmi' - keuntungan sejalan risiko).",
      "Nisbah keuntungan disepakati bebas berdasarkan kesepakatan bersama."
    ],
    dasarHukum: [
      "QS. Shad ayat 24: '...Dan sesungguhnya kebanyakan dari orang-orang yang berserikat itu sebagian mereka berbuat zalim kepada sebagian yang lain, kecuali orang-orang yang beriman...'",
      "Fatwa DSN-MUI No. 08/DSN-MUI/IV/2000 tentang Pembiayaan Musyarakah.",
      "KHES Buku II pasal 139 s.d 183."
    ],
    penerapan: "Pembiayaan Musyarakah Mutanaqisah (MMQ) untuk KPR Syariah, patungan ventura bisnis bersama."
  },
  {
    id: "murabahah",
    nama: "Murabahah (Jual Beli Margin)",
    namaArab: "المرابحة",
    deskripsi: "Jual beli barang dengan menegaskan harga perolehan (modal) kepada pembeli dan pembeli membayar lebih sebagai margin keuntungan yang disepakati bersama. Pembayaran dapat dilakukan secara tunai atau tangguh (kredit).",
    pelaku: ["Penjual / Lembaga Keuangan", "Nasabah / Pembeli"],
    rukun: [
      "Penjual dan Pembeli",
      "Barang yang diperjualbelikan",
      "Harga beli asal, biaya tambahan, dan margin keuntungan",
      "Ijab Qabul"
    ],
    syarat: [
      "Penjual wajib jujur mengemukakan harga modal aslinya.",
      "Barang harus benar-benar dimiliki penjual sebelum diserahkan (tidak boleh jual barang fiktif/short selling).",
      "Metode angsuran dan denda keterlambatan (jika ada) harus tertata sesuai aturan syariah (ta'zir/ganti rugi biaya riil)."
    ],
    dasarHukum: [
      "QS. An-Nisa ayat 29: '...Janganlah kamu saling memakan harta sesamamu dengan jalan yang batil, kecuali dengan jalan perniagaan yang berlaku dengan suka sama-suka di antara kamu...'",
      "Fatwa DSN-MUI No. 04/DSN-MUI/IV/2000 tentang Murabahah.",
      "KHES Buku II pasal 111 s.d 124."
    ],
    penerapan: "Kredit mobil syariah, KPR Syariah Murabahah, pembiayaan barang konsumtif rumah tangga."
  },
  {
    id: "salam",
    nama: "Salam (Jual Beli Pesan Bayar Dimuka)",
    namaArab: "السَّلَم",
    deskripsi: "Transaksi jual beli barang pesanan dengan kriteria tertentu, di mana pembayaran dilakukan penuh di muka (saat akad), sedangkan barang diserahkan kemudian hari pada waktu yang disepakati.",
    pelaku: ["Pembeli/Pemesal (Muslam)", "Penjual/Penerima Pesan (Muslam 'ilaih)"],
    rukun: [
      "Pembeli dan Penjual",
      "Modal pembayaran tunai di majelis akad",
      "Objek pesanan (Muslam fih) dengan spesifikasi jelas",
      "Sighat"
    ],
    syarat: [
      "Pembayaran tidak boleh ditunda (harus kontan di awal secara penuh, tidak boleh barter utang).",
      "Spesifikasi barang (jenis, ukuran, mutu, kuantitas) harus sangat detail guna menghindari gharar.",
      "Tanggal penyerahan barang harus ditentukan secara definitif."
    ],
    dasarHukum: [
      "Hadis Riwayat Al-Bukhari: 'Barangsiapa yang melakukan akad salam, hendaknya ia melakukannya dalam takaran yang jelas, timbangan yang jelas, dan jangka waktu yang jelas.'",
      "Fatwa DSN-MUI No. 05/DSN-MUI/IV/2000 tentang Jual Beli Salam.",
      "KHES Buku II pasal 125 s.d 131."
    ],
    penerapan: "Pembiayaan sektor pertanian (petani dibayar cash di awal musim tanam untuk menyerahkan padi saat panen), tekstil ekspor."
  },
  {
    id: "istishna'",
    nama: "Istishna' (Jual Beli Manufaktur/Pesanan Pabrikasi)",
    namaArab: "الاستصناع",
    deskripsi: "Akad jual beli dalam bentuk pemesanan pembuatan barang tertentu dengan kriteria dan persyaratan khusus yang disepakati antara pemesan (pembeli) dan pembuat (penjual). Cara pembayaran dapat dilakukan di awal, dicicil berangsur, atau ditangguhkan di akhir.",
    pelaku: ["Pemesan/Pembeli (Mustashni')", "Pembuat/Penjual (Shani')"],
    rukun: [
      "Pemesan dan Pembuat",
      "Barang pesanan yang dibuat (Masnu')",
      "Harga barang / upah pembuatan (Thaman)",
      "Ijab Qabul"
    ],
    syarat: [
      "Kriteria barang harus jelas (bahan, dimensi, kualitas) agar terhindar dari sengketa.",
      "Barang harus merupakan barang yang lazim diproduksi/dibuat.",
      "Metodologi pembayaran diatur bebas sesuai termin, tidak wajib lunas di muka seperti akad Salam."
    ],
    dasarHukum: [
      "Konsensus ulama (Ijma') bahwa transaksi pembuatan barang bermanfaat adalah sah karena telah dipraktikkan masyarakat Islam tanpa penolakan sejak zaman sahabat.",
      "Fatwa DSN-MUI No. 06/DSN-MUI/IV/2000 tentang Jual Beli Istishna'.",
      "KHES Buku II pasal 132 s.d 138."
    ],
    penerapan: "Pembangunan jembatan, pengerjaan konstruksi perumahan (KPR inden), pemesanan mesin industri kustom."
  },
  {
    id: "wakalah",
    nama: "Wakalah (Keagenan/Perwakilan)",
    namaArab: "الوكالة",
    deskripsi: "Akad pelimpahan kekuasaan oleh satu pihak (muwakkil) kepada pihak lain (wakil) dalam hal-hal yang boleh diwakilkan (seperti transaksi maliah), di mana wakil bertindak atas nama pemberi kuasa.",
    pelaku: ["Pemberi Kuasa (Muwakkil)", "Penerima Kuasa (Wakil)"],
    rukun: [
      "Pemberi kuasa dan Penerima kuasa",
      "Objek pewakilan (tugas / urusan yang didelegasikan)",
      "Ijab Qabul"
    ],
    syarat: [
      "Muwakkil sah bertindak atas urusan tersebut.",
      "Wakil cakap hukum dlm urusan terkait.",
      "Objek kuasa harus diketahui dengan jenisnya dan dapat didelegasikan (ibadah badaniyah murni seperti shalat atau puasa tidak boleh diwakilkan, sedangkan urusan bisnis/nikah/sembelih boleh)."
    ],
    dasarHukum: [
      "QS. Al-Kahfi ayat 19 tentang mengutus salah seorang untuk membawa uang perak guna membeli makanan di kota.",
      "Fatwa DSN-MUI No. 10/DSN-MUI/IV/2000 tentang Wakalah.",
      "KHES Buku II pasal 338 s.d 354."
    ],
    penerapan: "Penyaluran L/C impor, transfer uang antar bank, agen asuransi syariah, kuasa hukum sengketa."
  },
  {
    id: "rahn",
    nama: "Rahn (Gadai Syariah)",
    namaArab: "الرهن",
    deskripsi: "Akad penyerahan barang berharga (marhun) dari peminjam (rahin) kepada pemberi pinjaman (murtahin) sebagai jaminan utang, guna meyakinkan pemberi pinjaman bahwa utangnya dapat dilunasi jika peminjam gagal bayar.",
    pelaku: ["Pemberi Jaminan/Peminjam (Rahin)", "Penerima Jaminan/Pemberi Utang (Murtahin)"],
    rukun: [
      "Rahin dan Murtahin",
      "Barang jaminan (Marhun)",
      "Utang/Pinjaman (Marhun bih)",
      "Sighat"
    ],
    syarat: [
      "Barang jaminan harus dapat diperjualbelikan agar bernilai eksekusi.",
      "Murtahin dilarang mengambil manfaat/keuntungan dari marhun kecuali sekadar menutupi biaya perawatan riil.",
      "Marhun tetap hak milik rahin; murtahin hanya menguasai secara fisik/legalitas."
    ],
    dasarHukum: [
      "QS. Al-Baqarah ayat 283: '...Jika kamu dalam perjalanan sedang kamu tidak memperoleh seorang penulis, maka hendaklah ada barang tanggungan yang dipegang...'",
      "Fatwa DSN-MUI No. 25/DSN-MUI/III/2002 tentang Rahn.",
      "KHES Buku II pasal 355 s.d 403."
    ],
    penerapan: "Pegadaian emas syariah, jaminan sertifikat tanah untuk pembiayaan mikro syariah."
  },
  {
    id: "kafalah",
    nama: "Kafalah (Penjaminan Personal / Garansi)",
    namaArab: "الكفالة",
    deskripsi: "Akad jaminan yang diberikan oleh satu pihak penjamin (kafil) kepada pihak ketiga (makful lahu) untuk memenuhi kewajiban pihak kedua/yang dijamin (makful 'anhu atau ashil) apabila terjadi wanprestasi.",
    pelaku: ["Penjamin (Kafil)", "Kreditor/Pihak Ketiga (Makful Lahu)", "Debitor/Pihak Kedua (Makful 'Anhu/Ashil)"],
    rukun: [
      "Penjamin, Penerima Jaminan, dan Yang Dijamin",
      "Objek penjaminan (hutang, kehadiran person, objek fisik)",
      "Pernyataan komitmen (Sighat)"
    ],
    syarat: [
      "Penjamin harus cakap melakukan tabarru' (mampu menanggung beban keuangan).",
      "Kewajiban atau piutang yang dijamin harus sah menurut syariat dan terukur.",
      "Kafalah bersifat mengikat (lazim) bagi kafil sejak dideklarasikan."
    ],
    dasarHukum: [
      "QS. Yusuf ayat 72: '...dan bagi siapa yang dapat mengembalikannya akan memperoleh bahan makanan (seberat) beban unta, dan aku menjaminnya (kafil).'",
      "Fatwa DSN-MUI No. 11/DSN-MUI/IV/2000 tentang Kafalah.",
      "KHES Buku II pasal 404 s.d 426."
    ],
    penerapan: "Penerbitan Bank Garansi Syariah, penjaminan kredit usaha mikro syariah, Letter of Credit (L/C) Guarantee."
  }
];

export const DAFTAR_SEKTOR_HUKUM: HukumSektor[] = [
  {
    id: "perbankan-syariah",
    sektor: "Perbankan Syariah",
    fatwaMui: [
      "Fatwa DSN No. 01/2000 tentang Giro Syariah",
      "Fatwa DSN No. 02/2000 tentang Tabungan Syariah",
      "Fatwa DSN No. 03/2000 tentang Deposito Syariah",
      "Fatwa DSN No. 04/2000 tentang Pembiayaan Murabahah"
    ],
    khesPasal: "Buku II Bab XI s.d XVIII Kompilasi Hukum Ekonomi Syariah (KHES)",
    hukumPositif: "Undang-Undang No. 21 Tahun 2008 tentang Perbankan Syariah, POJK Terkait Perbankan Syariah",
    penyelesaianSengketa: "Litigasi di Pengadilan Agama (UU 3/2006 dan Putusan MK No. 93/PUU-X/2012) atau Non-Litigasi melalui Badan Arbitrase Syariah Nasional (BASYARNAS)."
  },
  {
    id: "pasar-modal",
    sektor: "Pasar Modal & Efek Syariah",
    fatwaMui: [
      "Fatwa DSN No. 40/2003 tentang Pasar Modal & Pedoman Umum Penerapan Prinsip Syariah",
      "Fatwa DSN No. 80/2011 tentang Penerapan Prinsip Syariah dalam Perdagangan Efek Bersifat Ekuitas"
    ],
    khesPasal: "Buku II Bab XXIV Kompilasi Hukum Ekonomi Syariah (KHES)",
    hukumPositif: "UU No. 8 Tahun 1995 tentang Pasar Modal jo. UU Pengembangan dan Penguatan Sektor Keuangan (P2SK) Tahun 2023, Peraturan OJK terkait Efek Syariah",
    penyelesaianSengketa: "Melalui Lembaga Alternatif Penyelesaian Sengketa Sektor Jasa Keuangan (LAPS SJK) atau arbitrase komersial syariah."
  },
  {
    id: "perasuransian-syariah",
    sektor: "Asuransi & Takaful",
    fatwaMui: [
      "Fatwa DSN No. 21/2001 tentang Pedoman Umum Asuransi Syariah",
      "Fatwa DSN No. 51/2006 tentang Akad Mudharabah Musytarakah pada Asuransi Syariah"
    ],
    khesPasal: "Buku II Bab XXII Kompilasi Hukum Ekonomi Syariah (KHES)",
    hukumPositif: "UU No. 40 Tahun 2014 tentang Perasuransian jo. UU P2SK Tahun 2023, SEOJK tentang Prinsip Syariah Asuransi",
    penyelesaianSengketa: "Pengadilan Agama atau Mediasi/Arbitrase LAPS SJK."
  },
  {
    id: "zakat-wakaf",
    sektor: "Filantropi Islam (ZISWAF)",
    fatwaMui: [
      "Fatwa DSN No. 115/2017 tentang Mudharabah Kontemporer pada Wakaf Uang",
      "Fatwa Majelis Ulama Indonesia tentang Zakat Produktif & Zakat Saham"
    ],
    khesPasal: "Buku III (Zakat) & Buku IV (Wakaf) Kompilasi Hukum Ekonomi Syariah (KHES)",
    hukumPositif: "UU No. 23 Tahun 2011 tentang Pengelolaan Zakat, UU No. 41 Tahun 2004 tentang Wakaf, PP No. 25 Tahun 2018",
    penyelesaianSengketa: "Mediasi Badan Wakaf Indonesia (BWI), atau gugatan sengketa wakaf di Pengadilan Agama."
  }
];

export const SKRIPSI_TEMPLATES: SkripsiTemplate[] = [
  {
    id: "skr-1",
    kategori: "Analisis Produk Keuangan Syariah",
    judulRekomendasi: "Analisis Penerapan Akad Ijarah Muntahiyah Bittamlik (IMBT) atas Pembiayaan Alat Berat di Bank Syariah: Studi Kesesuaian Fatwa DSN-MUI",
    latarBelakangGap: "Banyak sengketa pembiayaan IMBT disebabkan percampuran antara akad sewa dan janji transfer kepemilikan di akhir masa sewa. Penelitian diperlukan untuk membandingkan implementasi operasional di bank dengan legalitas syariah di KHES dan Fatwa DSN MUI.",
    rumusanMasalah: [
      "Bagaimana mekanisme praktis pembiayaan IMBT untuk nasabah korporat pada Bank Syariah X?",
      "Apakah klausul penalti dan pelunasan dipercepat dalam akad IMBT tersebut telah sesuai dengan Fatwa DSN-MUI No. 27/DSN-MUI/III/2002?"
    ],
    kerangkaPikir: [
      "Bab I: Pendahuluan (Latar belakang, rumusan, tujuan, keaslian penelitian)",
      "Bab II: Landasan Teoretis (Teori akad Ijarah, teori janji/wa'ad, Fatwa DSN-MUI terkait)",
      "Bab III: Metode Penelitian (Deskriptif kualitatif, jenis penelitian yuridis empiris/sosiologis, metode wawancara dan telaah berkas akad)",
      "Bab IV: Hasil dan Pembahasan (Analisis akta perjanjian IMBT vs regulasi rujukan)",
      "Bab V: Penutup (Kesimpulan dan implikasi praktis)"
    ],
    metodologiSaran: "Yuridis Empiris (Studi Kasus). Data dikumpulkan melalui wawancara mendalam dengan divisi legal dan syariah di bank, serta menelaah salinan akta perjanjian yang disamarkan datanya."
  },
  {
    id: "skr-2",
    kategori: "Penyelesaian Sengketa Muamalah",
    judulRekomendasi: "Efektivitas Penyelesaian Sengketa Wanprestasi Akad Murabahah Melalui Jalur Litigasi Pasca Terbitnya PERMA No. 14 Tahun 2016 tentang Tata Cara Penyelesaian Sengketa Ekonomi Syariah",
    latarBelakangGap: "Sengketa ekonomi syariah seringkali memakan waktu lama di pengadilan. Dengan terbitnya mekanisme gugatan sederhana syariah (Small Claim Court) lewat PERMA No. 14 Tahun 2016, diperlukan pembuktian efektivitas durasi dan kepailitan hukum di lapangan.",
    rumusanMasalah: [
      "Bagaimana penerapan hukum acara gugatan sederhana dalam sengketa pembiayaan murabahah di Pengadilan Agama X?",
      "Apa hambatan yang dihadapi hakim dalam mengeksekusi jaminan (marhun) pada perkara pembuktian sederhana tersebut?"
    ],
    kerangkaPikir: [
      "Bab I: Latar Belakang & Urgensi Akses Keadilan Cepat",
      "Bab II: Tinjauan Pustaka (Teori Keadilan Acara, Konstruksi Wanprestasi Murabahah, Sejarah Kompetensi Pengadilan Agama)",
      "Bab III: Metode (Yuridis Normatif-Dokumenter, menelaah putusan-putusan Pengadilan Agama terkait)",
      "Bab IV: Analisis Putusan Pengadilan Agama & Durasi Eksekusi Hak Tanggungan",
      "Bab V: Kesimpulan & Rekomendasi Amandemen Hukum Acara"
    ],
    metodologiSaran: "Yuridis Normatif (Penelitian Kepustakaan). Peneliti menganalisis Putusan Pengadilan Agama yang inkrah dalam rentang tahun 2020-2025 yang menggunakan mekanisme gugatan sederhana."
  },
  {
    id: "skr-3",
    kategori: "Fintech & Isu Kontemporer",
    judulRekomendasi: "Tinjauan Fikih Muamalah terhadap Penerapan Wakalah bil Ujrah pada Crowdfunding Sharia Securities (Layanan Urun Dana Syariah)",
    latarBelakangGap: "Platform securities crowdfunding mengumpulkan dana dari ribuan investor kecil untuk disalurkan ke UMKM. Hak pengelolaan, biaya komisi (ujrah), dan batasan kewajiban platform sebagai wakil mutlak seringkali kabur ketika penerbit saham syariah mengalami kebangkrutan.",
    rumusanMasalah: [
      "Bagaimana kedudukan hukum platform securities crowdfunding sebagai agen (wakil) pembeli saham syariah?",
      "Bagaimana keabsahan pembebanan biaya administrasi (ujrah) platform ditinjau dari prinsip tawassuth dan maslahah?"
    ],
    kerangkaPikir: [
      "Bab I: Urgensi Fintech Syariah, Rumusan Masalah, Manfaat Penelitian",
      "Bab II: Teori Akad Wakalah Bil Ujrah, Fatwa DSN-MUI tentang Fintech, Peraturan OJK No. 57/POJK.04/2020",
      "Bab III: Metode Kualitatif Literatur deskriptif-komparatif",
      "Bab IV: Analisis Syarat & Ketentuan digital (T&C) di platform syariah terdaftar OJK",
      "Bab V: Kesimpulan & Pola Hubungan Hukum yang Ideal"
    ],
    metodologiSaran: "Yuridis Normatif. Meneliti dokumen perjanjian elektronik (E-Contract), regulasi otoritas jasa keuangan, fatwa-fatwa DSN terkait tekonologi keuangan, dan literatur fikih klasik."
  }
];

export const PRESET_QUESTIONS = [
  "Jelaskan perbedaan akad mudharabah dan musyarakah menurut KHES dan Fatwa DSN-MUI",
  "Berikan rukun dan syarat sah akad ijarah serta dasar hukum positif Indonesianya",
  "Bantu buatkan judul skripsi Hukum Ekonomi Syariah bidang Fintech beserta rumusan masalahnya",
  "Bagaimana skema pembagian keuntungan dan kerugian pada pembiayaan Musyarakah Mutanaqisah (MMQ)?"
];
