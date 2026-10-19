import { createAdminClient } from "@/lib/supabase";
import { toko } from "@/lib/toko";

export async function POST(request) {
  // Pastikan admin sudah login
  try {
    const supabase = await createAdminClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Anda harus masuk terlebih dahulu." },
        { status: 401 }
      );
    }
  } catch {
    return Response.json(
      { error: "Gagal memverifikasi sesi admin." },
      { status: 401 }
    );
  }

  // Validasi input
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const { nama, kategori } = body;

  if (!nama || typeof nama !== "string" || !nama.trim()) {
    return Response.json(
      { error: "Nama produk wajib diisi untuk membuat deskripsi." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "API key Gemini belum diatur di server." },
      { status: 500 }
    );
  }

  // Buat prompt untuk Gemini
  const kategoriTeks = kategori?.trim() ? ` dengan kategori "${kategori.trim()}"` : "";
  const prompt = `Buatkan deskripsi produk singkat (2-3 kalimat) dalam bahasa Indonesia untuk produk bernama "${nama.trim()}"${kategoriTeks} dari toko "${toko.nama}". Deskripsi harus menarik, informatif, dan cocok untuk katalog online. Jangan gunakan emoji. Langsung tulis deskripsinya saja tanpa awalan atau penjelasan tambahan.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Gemini API error:", res.status, errorData);
      return Response.json(
        { error: "Gagal menghubungi layanan AI. Silakan coba lagi." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const deskripsi =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!deskripsi) {
      return Response.json(
        { error: "AI tidak menghasilkan deskripsi. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return Response.json({ deskripsi });
  } catch (err) {
    console.error("Gemini fetch error:", err);
    return Response.json(
      { error: "Terjadi kesalahan saat menghubungi layanan AI." },
      { status: 500 }
    );
  }
}
