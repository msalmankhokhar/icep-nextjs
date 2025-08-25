import { put, PutBlobResult } from "@vercel/blob";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
    });
  }

  const blob: PutBlobResult = await put(file.name, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  });

  return Response.json(blob);
}
