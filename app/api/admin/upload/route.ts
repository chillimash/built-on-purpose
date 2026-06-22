import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data/require-admin";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok)
    return NextResponse.json({ error: auth.message }, { status: auth.status });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Use JPEG, PNG, WebP, or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 400 }
    );
  }

  // Build a unique, clean path: images/1718000000000-originalname.jpg
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .slice(0, 40);
  const path = `${Date.now()}-${safeName}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { data, error } = await auth.supabase.storage
    .from("images")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get the public URL (bucket is public, so no expiry needed)
  const {
    data: { publicUrl },
  } = auth.supabase.storage.from("images").getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
