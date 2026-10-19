import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { createAdminClient } from "@/lib/supabase";
import FormUbahProduk from "./FormUbahProduk";

export const dynamic = "force-dynamic";

// US-09: ubah produk
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  let produk = null;

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      notFound();
    }
    produk = data;
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} />
    </div>
  );
}
