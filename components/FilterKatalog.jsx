"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function FilterKatalog({ produkList }) {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  // Ambil daftar kategori unik dari data produk
  const kategoriList = useMemo(() => {
    const unik = [...new Set(produkList.map((p) => p.kategori).filter(Boolean))];
    return ["Semua", ...unik.sort()];
  }, [produkList]);

  const produkTampil = useMemo(() => {
    return produkList.filter((p) => {
      const cocokKategori =
        kategoriAktif === "Semua" || p.kategori === kategoriAktif;
      const cocokCari = p.nama
        .toLowerCase()
        .includes(cari.toLowerCase().trim());
      return cocokKategori && cocokCari;
    });
  }, [produkList, kategoriAktif, cari]);

  return (
    <div className="flex flex-col gap-5">
      {/* Search + Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Kolom pencarian */}
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teks-lembut"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="cari-produk"
            type="search"
            placeholder="Cari nama produk…"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            className="w-full rounded-xl border border-garis bg-permukaan py-2.5 pl-9 pr-4 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none focus:ring-2 focus:ring-utama/20"
          />
        </div>

        {/* Tombol filter kategori */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 sm:pb-0"
          role="group"
          aria-label="Filter kategori"
        >
          {kategoriList.map((kat) => (
            <button
              key={kat}
              onClick={() => setKategoriAktif(kat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                kategoriAktif === kat
                  ? "bg-utama text-white"
                  : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
              }`}
              aria-pressed={kategoriAktif === kat}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid produk */}
      {produkTampil.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-10 text-center">
          <p className="text-teks-lembut">
            Tidak ada produk yang sesuai dengan pencarianmu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTampil.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
