// lib/pdf.ts
"use client";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// One of these two exists on v3 — keep whichever resolves in your env:
import workerSrc from "pdfjs-dist/build/pdf.worker.js?url"; // or pdf.worker.min.js?url

(pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc =
  workerSrc;

type PdfTextItem = { str: string };
type PdfTextContent = { items: PdfTextItem[] };
type PdfPage = { getTextContent(): Promise<PdfTextContent> };
type PdfDoc = { numPages: number; getPage(n: number): Promise<PdfPage> };
type PdfLoadingTask = { promise: Promise<PdfDoc> };

export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buf }) as unknown as PdfLoadingTask;
  const pdf = await loadingTask.promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(" ") + "\n";
  }
  return text;
}
