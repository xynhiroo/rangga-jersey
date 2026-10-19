"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase";

export async function login(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) {
    return { error: "Formulir tidak valid." };
  }

  const email = form.get("email")?.toString().trim();
  const password = form.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createAdminClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("invalid login credentials")) {
        return { error: "Email atau password salah." };
      }
      return {
        error: error.message || "Gagal masuk. Silakan periksa kembali email dan password.",
      };
    }
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat mencoba masuk.",
    };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createAdminClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Gagal keluar:", err);
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) {
    return { error: "Formulir tidak valid." };
  }

  const passwordBaru = form.get("password_baru")?.toString();
  const konfirmasiPassword = form.get("konfirmasi_password")?.toString();

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru harus memiliki minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  try {
    const supabase = await createAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Anda harus masuk terlebih dahulu untuk mengganti password." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      let pesanError = error.message || "Gagal mengganti password.";
      if (pesanError.toLowerCase().includes("different from the old password")) {
        pesanError = "Password baru tidak boleh sama dengan password lama.";
      }
      return { error: pesanError };
    }
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat mengganti password.",
    };
  }

  revalidatePath("/admin/password");
  return {
    sukses: true,
    pesan: "Password berhasil diganti.",
  };
}

export async function tambahProduk(prevState, formData) {
  const form =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  if (!form) {
    return { error: "Formulir tidak valid." };
  }

  const nama = form.get("nama")?.toString().trim();
  const hargaRaw = form.get("harga")?.toString().trim();
  const kategori = form.get("kategori")?.toString().trim() || null;
  const foto_url = form.get("foto_url")?.toString().trim() || null;
  const deskripsi = form.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (!hargaRaw) {
    return { error: "Harga produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan minimal 0." };
  }

  try {
    const supabase = await createAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Anda harus masuk terlebih dahulu untuk menambah produk." };
    }

    const { error } = await supabase.from("produk").insert([
      {
        nama,
        harga,
        kategori,
        foto_url,
        deskripsi,
      },
    ]);

    if (error) {
      return { error: error.message || "Gagal menyimpan produk ke database." };
    }
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat menyimpan produk.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}



