"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

const VARIAN_DEFAULT = ["S", "M", "L", "XL", "XXL"];

export default function PilihPesanWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  function kurang() {
    setJumlah((j) => Math.max(1, j - 1));
  }
  function tambah() {
    setJumlah((j) => j + 1);
  }
  function handleJumlahInput(e) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) setJumlah(val);
  }

  function buildPesan() {
    let pesan = `Halo, saya ingin memesan:\n\n`;
    pesan += `Produk : ${produk.nama}\n`;
    pesan += `Harga  : ${formatRupiah(produk.harga)}\n`;
    if (varian) pesan += `Ukuran : ${varian}\n`;
    pesan += `Jumlah : ${jumlah} pcs\n`;
    pesan += `\nTotal  : ${formatRupiah(produk.harga * jumlah)}\n`;
    pesan += `\nMohon konfirmasi ketersediaan stok. Terima kasih!`;
    return pesan;
  }

  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(buildPesan())}`;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-4">
      {/* Pilih ukuran */}
      <div>
        <p className="mb-2 text-sm font-semibold">Pilih Ukuran</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih ukuran">
          {VARIAN_DEFAULT.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVarian(varian === v ? "" : v)}
              aria-pressed={varian === v}
              className={`min-w-[44px] rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                varian === v
                  ? "border-utama bg-utama text-white"
                  : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Pilih jumlah */}
      <div>
        <p className="mb-2 text-sm font-semibold">Jumlah</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={kurang}
            aria-label="Kurangi jumlah"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-lg font-bold transition-colors hover:border-utama hover:text-utama disabled:opacity-40"
            disabled={jumlah <= 1}
          >
            −
          </button>
          <input
            id="jumlah-produk"
            type="number"
            min="1"
            value={jumlah}
            onChange={handleJumlahInput}
            className="w-16 rounded-lg border border-garis bg-latar px-2 py-1.5 text-center text-sm font-semibold focus:border-utama focus:outline-none focus:ring-2 focus:ring-utama/20"
          />
          <button
            type="button"
            onClick={tambah}
            aria-label="Tambah jumlah"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-lg font-bold transition-colors hover:border-utama hover:text-utama"
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-xl bg-harga-latar px-4 py-2">
        <span className="text-sm font-semibold text-harga">Total</span>
        <span className="text-lg font-extrabold text-harga">
          {formatRupiah(produk.harga * jumlah)}
        </span>
      </div>

      {/* Tombol pesan */}
      <a
        id="tombol-pesan-whatsapp"
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.886a.5.5 0 00.611.61l6.098-1.597A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.034-1.382l-.36-.214-3.724.975.997-3.645-.235-.374A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
        </svg>
        Pesan via WhatsApp
      </a>
    </div>
  );
}
