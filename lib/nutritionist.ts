import fs from "fs";
import path from "path";
import { extractText, getDocumentProxy } from "unpdf";

// Cache in-memory per evitare di rileggere i PDF ad ogni richiesta
let cachedContext: string | null = null;

const PDF_FILES = [
  "Indicazioni CORSANELLO Francesco.pdf",
  "Dieta Corsanello Francesco.pdf",
];

export async function getNutritionistContext(): Promise<string> {
  if (cachedContext) return cachedContext;

  // 1. Prova a leggere i PDF locali (sviluppo / server proprio)
  const dataDir = path.join(process.cwd(), "data");
  const parts: string[] = [];

  for (const filename of PDF_FILES) {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) continue;
    const buffer = fs.readFileSync(filePath);
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    parts.push(`=== ${filename} ===\n${text.trim()}`);
  }

  if (parts.length > 0) {
    cachedContext = parts.join("\n\n");
    return cachedContext;
  }

  // 2. Fallback: variabile d'ambiente (Vercel / produzione senza PDF)
  const envContext = process.env.NUTRITIONIST_CONTEXT;
  if (envContext) {
    cachedContext = envContext;
    return cachedContext;
  }

  // 3. Nessuna fonte disponibile — Claude userà solo le sue conoscenze generali
  console.warn("[nutritionist] Nessun contesto disponibile: né PDF né NUTRITIONIST_CONTEXT.");
  cachedContext = "";
  return cachedContext;
}
