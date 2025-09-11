// /lib/pdf.ts
"use client";

import { GlobalWorkerOptions, getDocument, type TextContent } from "pdfjs-dist";

// Robust way: let the bundler resolve a real URL to the worker file
const workerUrl = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
GlobalWorkerOptions.workerSrc = workerUrl;

export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await getDocument({ data: buf }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content: TextContent = await page.getTextContent();
    text += content.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return text;
}
