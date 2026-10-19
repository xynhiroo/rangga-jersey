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


