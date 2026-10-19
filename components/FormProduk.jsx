"use client";

import { useState, useRef } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
// US-14: Tombol "Buat deskripsi AI" memanggil Gemini API via Route Handler.
export default function FormProduk({
  action,
  produk = {},
  labelTombol,
  error,
  isPending = false,
}) {
  const [sedangBuatAI, setSedangBuatAI] = useState(false);
  const [errorAI, setErrorAI] = useState(null);
  const deskripsiRef = useRef(null);

  async function buatDeskripsiAI() {
    setErrorAI(null);

    // Ambil nilai nama dan kategori dari form
    const form = deskripsiRef.current?.closest("form");
    if (!form) return;

    const nama = form.querySelector('[name="nama"]')?.value?.trim();
    const kategori = form.querySelector('[name="kategori"]')?.value?.trim();

    if (!nama) {
      setErrorAI("Isi nama produk terlebih dahulu.");
      return;
    }

    setSedangBuatAI(true);

    try {
      const res = await fetch("/api/generate-deskripsi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, kategori }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorAI(data.error || "Gagal membuat deskripsi.");
        return;
      }

      if (data.deskripsi && deskripsiRef.current) {
        // Set value pada textarea menggunakan native setter agar React mengenali perubahan
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(deskripsiRef.current, data.deskripsi);
        deskripsiRef.current.dispatchEvent(
          new Event("input", { bubbles: true })
        );
      }
    } catch {
      setErrorAI("Terjadi kesalahan saat menghubungi layanan AI.");
    } finally {
      setSedangBuatAI(false);
    }
  }

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {error}
        </div>
      )}
      {produk?.id ? <input type="hidden" name="id" defaultValue={produk.id} /> : null}
      <Input label="Nama produk" name="nama" defaultValue={produk.nama} required />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input label="Kategori" name="kategori" defaultValue={produk.kategori} />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      {/* US-14: Deskripsi dengan tombol AI */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="deskripsi-input" className="text-sm font-semibold">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={buatDeskripsiAI}
            disabled={sedangBuatAI || isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-utama/30 bg-utama/5 px-3 py-1.5 text-xs font-semibold text-utama transition-all hover:bg-utama/10 hover:border-utama/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sedangBuatAI ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Membuat...
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L9.5 8.5 2 12l7.5 3.5L12 22l2.5-6.5L22 12l-7.5-3.5z" />
                </svg>
                Buat deskripsi AI
              </>
            )}
          </button>
        </div>
        <textarea
          ref={deskripsiRef}
          id="deskripsi-input"
          name="deskripsi"
          rows={4}
          defaultValue={produk.deskripsi}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {errorAI && (
          <p className="text-xs text-bahaya">{errorAI}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
