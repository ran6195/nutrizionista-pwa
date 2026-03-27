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

  const dataDir = path.join(process.cwd(), "data");
  const parts: string[] = [];

  for (const filename of PDF_FILES) {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[nutritionist] File non trovato: ${filePath}`);
      continue;
    }
    const buffer = fs.readFileSync(filePath);
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    parts.push(`=== ${filename} ===\n${text.trim()}`);
  }

  cachedContext = parts.join("\n\n");
  return cachedContext;
}
