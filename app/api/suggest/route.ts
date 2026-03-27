import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getNutritionistContext } from "@/lib/nutritionist";
import { PreferenceContext } from "@/lib/preferenceStorage";

const client = new Anthropic();

function buildPreferenceSection(prefs: PreferenceContext, style: string): string {
  const lines: string[] = [];

  if (prefs.recentMeals.length > 0) {
    lines.push(
      `## Pasti recenti da NON riproporre (ultimi 14 giorni)\n` +
      prefs.recentMeals.map((n) => `- ${n}`).join("\n")
    );
  }

  if (prefs.disliked.length > 0) {
    lines.push(
      `## Pasti che l'utente tende a rifiutare (evita o proponi con meno probabilità)\n` +
      prefs.disliked.map((n) => `- ${n}`).join("\n")
    );
  }

  if (prefs.liked.length > 0) {
    lines.push(
      `## Pasti che l'utente apprezza (puoi proporre varianti simili)\n` +
      prefs.liked.map((n) => `- ${n}`).join("\n")
    );
  }

  lines.push(`## Direttiva stile per questa richiesta\nIspirazione: ${style}. Usa questa indicazione per variare il tipo di piatto pur rispettando le linee guida nutrizionali.`);

  return lines.join("\n\n");
}

export async function POST(req: NextRequest) {
  const { mealType, notes, preferences, style } = await req.json() as {
    mealType: string;
    notes: string;
    preferences?: PreferenceContext;
    style?: string;
  };

  if (!mealType) {
    return NextResponse.json({ error: "mealType è obbligatorio" }, { status: 400 });
  }

  const nutritionistContext = await getNutritionistContext();

  const preferenceSection = preferences && style
    ? `\n\n${buildPreferenceSection(preferences, style)}`
    : "";

  const systemPrompt = `Sei un assistente nutrizionale personale.
Hai accesso alle indicazioni e al piano dietetico specifico dell'utente, forniti dal suo nutrizionista.
Il tuo compito è suggerire un singolo pasto concreto e completo per il tipo di pasto richiesto,
rispettando scrupolosamente le indicazioni del nutrizionista.

Rispondi SEMPRE in italiano e in formato JSON con questa struttura:
{
  "nome": "Nome del pasto",
  "descrizione": "Breve descrizione appetitosa (1-2 frasi)",
  "ingredienti": ["ingrediente 1 con quantità", "ingrediente 2 con quantità"],
  "preparazione": "Istruzioni brevi di preparazione (2-4 frasi)",
  "note_nutrizionali": "Perché questo pasto rispetta le indicazioni del nutrizionista",
  "calorie": 480,
  "proteine": 32,
  "carboidrati": 61,
  "grassi": 12
}

I valori nutrizionali devono essere numeri interi stimati in base agli ingredienti e alle quantità indicate.

## Indicazioni e piano del nutrizionista
${nutritionistContext}${preferenceSection}`;

  const userMessage = `Suggeriscimi un/una ${mealType}${notes ? `. Note aggiuntive: ${notes}` : ""}.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = (message.content[0] as { type: string; text: string }).text;

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Risposta non valida da Claude" }, { status: 500 });
    }

    const suggestion = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("[api/suggest] Errore:", err);
    return NextResponse.json({ error: "Errore nel generare il suggerimento" }, { status: 500 });
  }
}
