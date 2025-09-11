"use client";

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

// robust worker path that works in Next.js
const workerUrl = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
GlobalWorkerOptions.workerSrc = workerUrl;

type PdfTextItemLike = { str: string };
type PdfTextContentLike = { items: PdfTextItemLike[] };

export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await getDocument({ data: buf }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = (await page.getTextContent()) as unknown as PdfTextContentLike;
    text += content.items.map((it) => it.str).join(" ") + "\n";
  }
  return text;
}
