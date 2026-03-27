# NutriAI – Il tuo nutrizionista digitale

Un'app PWA di supporto per la dieta basata su suggerimenti AI e indicazioni del nutrizionista.

## Funzionalità

- **Dashboard** – Panoramica giornaliera: calorie consumate, anello calorico interattivo e macronutrienti
- **Diario Alimentare** – Registra i pasti con calorie e macronutrienti; aggiunta rapida da alimenti comuni
- **Suggerimenti AI** – Consigli personalizzati basati sul tuo profilo e sui pasti registrati
- **Consigli del Nutrizionista** – Linee guida professionali su alimentazione e salute
- **Profilo** – Imposta obiettivo, livello di attività fisica; calcolo automatico del fabbisogno calorico (Mifflin-St Jeor)

## Tecnologie

- React 19 + TypeScript
- Vite 8
- React Router v7
- PWA (manifest + service worker) per uso offline e installazione su dispositivo
- Dati salvati in `localStorage` (nessun account, nessun server)

## Avvio rapido

```bash
npm install
npm run dev
```

## Build produzione

```bash
npm run build
npm run preview
```
