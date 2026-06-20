import React, { useState } from "react";
import { DollarSign, ShieldAlert, CheckCircle, Percent, ArrowRight, BookOpen, Landmark } from "lucide-react";

export default function AkadSimulator() {
  const [activeTab, setActiveTab] = useState<"murabahah" | "mudharabah">("murabahah");

  // State Murabahah
  const [hargaPokok, setHargaPokok] = useState<number>(100000000);
  const [uangMuka, setUangMuka] = useState<number>(10000000);
  const [marginTahun, setMarginTahun] = useState<number>(8);
  const [tenor, setTenor] = useState<number>(24);

  // State Mudharabah
  const [modalKerja, setModalKerja] = useState<number>(50000000);
  const [nisbahShahibul, setNisbahShahibul] = useState<number>(60); // 60% Shahibul Maal
  const [keuntunganBulanan, setKeuntunganBulanan] = useState<number>(4000000);

  // Format Rupiah Helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Perhitungan Murabahah
  const sisaPembiayaan = Math.max(0, hargaPokok - uangMuka);
  const totalMargin = Math.round(sisaPembiayaan * (marginTahun / 100) * (tenor / 12));
  const totalHargaJual = sisaPembiayaan + totalMargin;
  const angsuranBulanan = Math.round(totalHargaJual / tenor);

  // Perhitungan Mudharabah
  const bagianShahibulMaal = Math.round(keuntunganBulanan * (nisbahShahibul / 100));
  const bagianMudharib = Math.round(keuntunganBulanan * ((100 - nisbahShahibul) / 100));

  return (
    <div id="simulator-akad" className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-primary-base" />
            Simulasi & Kalkulator Akad Syariah
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi perhitungan kuantitatif dan alur transaksi Lembaga Keuangan Syariah sesuai standar fikih.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mt-4 md:mt-0 max-w-xs border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("murabahah")}
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "murabahah"
                ? "bg-primary-base text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Murabahah (Jual Beli)
          </button>
          <button
            onClick={() => setActiveTab("mudharabah")}
            className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "mudharabah"
                ? "bg-primary-base text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Mudharabah (Bagi Hasil)
          </button>
        </div>
      </div>

      {activeTab === "murabahah" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-5">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Percent className="w-4 h-4 text-emerald-custom" />
                Input Pembiayaan Murabahah
              </h3>

              {/* Input Harga */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Harga Pokok Aset (Rp): <span className="font-semibold text-slate-800 dark:text-white float-right">{formatRupiah(hargaPokok)}</span>
                </label>
                <input
                  type="range"
                  min="5000000"
                  max="500000000"
                  step="5000000"
                  value={hargaPokok}
                  onChange={(e) => setHargaPokok(Number(e.target.value))}
                  className="w-full accent-primary-base cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>5 Juta</span>
                  <span>500 Juta</span>
                </div>
              </div>

              {/* Input Uang Muka */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Uang Muka (Down Payment - Rp): <span className="font-semibold text-slate-900 dark:text-white float-right">{formatRupiah(uangMuka)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={hargaPokok * 0.8}
                  step="1000000"
                  value={uangMuka}
                  onChange={(e) => setUangMuka(Number(e.target.value))}
                  className="w-full accent-primary-base cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Rp 0</span>
                  <span>Maks {formatRupiah(hargaPokok * 0.8)} (80%)</span>
                </div>
              </div>

              {/* Input Margin */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Margin Keuntungan Bank (% per tahun): <span className="font-bold text-emerald-custom float-right">{marginTahun}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={marginTahun}
                  onChange={(e) => setMarginTahun(Number(e.target.value))}
                  className="w-full accent-primary-base cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>1%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Tenor */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Jangka Waktu (Masa Sewa/Tenor): <span className="font-bold text-slate-800 dark:text-white float-right">{tenor} Bulan</span>
                </label>
                <select
                  value={tenor}
                  onChange={(e) => setTenor(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-base"
                >
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                  <option value={36}>36 Bulan (3 Tahun)</option>
                  <option value={48}>48 Bulan (4 Tahun)</option>
                  <option value={60}>60 Bulan (5 Tahun)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50/30 dark:from-slate-900 dark:to-slate-950 p-6 rounded-2xl border border-teal-100/50 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-primary-base font-semibold mb-4">Hasil Kalkulasi Murabahah</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Uang Pokok yang Dibiayai</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatRupiah(sisaPembiayaan)}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Margin Bank ({marginTahun}%)</span>
                  <span className="text-lg font-bold text-amber-600 dark:text-yellow-500">{formatRupiah(totalMargin)}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Harga Jual Bank</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{formatRupiah(totalHargaJual)}</span>
                </div>
                <div className="bg-teal-600 text-white p-4 rounded-xl shadow-md">
                  <span className="block text-[11px] text-teal-100 font-medium">Angsuran Bulanan</span>
                  <span className="text-xl font-extrabold">{formatRupiah(angsuranBulanan)}</span>
                  <span className="block text-[10px] text-teal-100">selama {tenor} bulan</span>
                </div>
              </div>

              {/* Skema Workflow Alur Murabahah */}
              <div className="mt-6 pt-5 border-t border-teal-100/50 dark:border-slate-800">
                <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-primary-base" />
                  Alur Syariah Murabahah (Kepatuhan DSN-MUI):
                </h5>
                <div className="space-y-3">
                  <div className="flex gap-3 text-xs">
                    <div className="bg-primary-base text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Negosiasi & Janji Pembelian</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Nasabah mengajukan permohonan, Bank menegosiasikan spesifikasi aset & margin {marginTahun}%.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="bg-primary-base text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Pembelian Aset oleh Bank</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Bank membeli aset secara resmi dari supplier senilai {formatRupiah(hargaPokok)} tunai agar aset sah dikuasai Bank terlebih dahulu.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="bg-primary-base text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">3</div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Akad Murabahah & Serah Terima</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Bank menjual aset kepada Nasabah dengan harga jual {formatRupiah(totalHargaJual)} denda syariah ditiadakan, pembayaran dicicil {formatRupiah(angsuranBulanan)}/bulan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
                <Percent className="w-4 h-4 text-emerald-custom" />
                Input Kemitraan Mudharabah
              </h3>

              {/* Modal */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Modal Kerja Shahibul Maal (Rp): <span className="font-semibold text-slate-800 dark:text-white float-right">{formatRupiah(modalKerja)}</span>
                </label>
                <input
                  type="range"
                  min="5000000"
                  max="200000000"
                  step="5000000"
                  value={modalKerja}
                  onChange={(e) => setModalKerja(Number(e.target.value))}
                  className="w-full accent-primary-base cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>5 Juta</span>
                  <span>200 Juta</span>
                </div>
              </div>

              {/* Nisbah */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Nisbah Pembagian (Shahibul Maal : Mudharib): 
                  <span className="font-bold text-emerald-custom float-right">
                    {nisbahShahibul}% : {100 - nisbahShahibul}%
                  </span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={nisbahShahibul}
                  onChange={(e) => setNisbahShahibul(Number(e.target.value))}
                  className="w-full accent-primary-base cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Investor 10% : Pengelola 90%</span>
                  <span>Investor 90% : Pengelola 10%</span>
                </div>
              </div>

              {/* Proyeksi Untung */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Ekspektasi Laba Bersih Bulanan (Rp): <span className="font-semibold text-slate-800 dark:text-white float-right">{formatRupiah(keuntunganBulanan)}</span>
                </label>
                <input
                  type="range"
                  min="500000"
                  max="25000000"
                  step="500000"
                  value={keuntunganBulanan}
                  onChange={(e) => setKeuntunganBulanan(Number(e.target.value))}
                  className="w-full accent-primary-base cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>500 Ribu</span>
                  <span>25 Juta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50/30 dark:from-slate-900 dark:to-slate-950 p-6 rounded-2xl border border-teal-100/50 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-primary-base font-semibold mb-4">Hasil Pembagian Untung (Mudharabah)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 text-[9px] bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded font-semibold mb-1">Milik Investor</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Bagi Hasil Shahibul Maal ({nisbahShahibul}%)</span>
                  </div>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2 block">{formatRupiah(bagianShahibulMaal)}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-yellow-500 rounded font-semibold mb-1">Milik Pengelola</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Bagi Hasil Mudharib ({100 - nisbahShahibul}%)</span>
                  </div>
                  <span className="text-xl font-bold text-amber-700 dark:text-yellow-600 mt-2 block">{formatRupiah(bagianMudharib)}</span>
                </div>
              </div>

              {/* Skema Kerugian Warning */}
              <div className="mt-5 bg-yellow-50/80 dark:bg-slate-900 p-4 rounded-xl border border-yellow-100 dark:border-amber-950">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-800 dark:text-yellow-500">Prinsip Risiko & Kerugian (Al-Khusr)</h5>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 line-clamp-3">
                      Jika terjadi kerugian usaha murni (risiko bisnis atau <i>force majeure</i>), modal akan berkurang langsung dari uang investor ({formatRupiah(modalKerja)}).
                      Pengelola (Mudharib) tidak wajib mengembalikan uang yang habis selama tidak ada kelalaian (taqsir), melainkan ia kehilangan seluruh imbalan waktu dan kerjanya.
                    </p>
                  </div>
                </div>
              </div>

              {/* Syarat Khusus Mudharabah */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Fatwa Terkait:</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Bahwa penetapan nominal bagi hasil bulanan tidak boleh didasarkan atas persentase tetap dari <b>modal kerja</b> (e.g. 1% dari Rp 50Juta terus-menerus), melainkan wajib berdasarkan persentase (nisbah) terhadap <b>pendapatan riil usaha (revenue/profit)</b>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
