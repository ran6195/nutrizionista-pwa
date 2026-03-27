# Opzioni di deploy — Harvest & Hearth

## Contesto e vincoli
- Server PHP disponibile → non utilizzabile (Node.js non supportato)
- GCP disponibile ma da verificare
- Server casalingo possibile ma senza IP fisso
- App personale, dati sensibili (PDF nutrizionista), traffico bassissimo

---

## Opzione A — Vercel ⭐ Più semplice

**Cos'è**: piattaforma cloud fatta dagli stessi autori di Next.js.
Deploy con un comando dal terminale, zero configurazione server.

**Come funziona**:
```bash
npm install -g vercel
vercel        # fa login + deploy automatico
```

**Costo**: Gratuito per uso personale (Hobby plan).

**Problema con i PDF**: Vercel è "serverless" — non ha un filesystem persistente.
I PDF del nutrizionista non possono stare in `data/`.
**Soluzione**: estrarre il testo dai PDF una volta sola, salvarlo come
file `.txt` nel codice (non è più un dato binario sensibile, solo testo).
Il testo andrebbe in git ma oscurato se il repo è privato.

**Pro**:
- Setup in 10 minuti
- HTTPS automatico
- Deploy automatico ad ogni `git push`
- Nessun server da gestire

**Contro**:
- I PDF originali non rimangono sul server (bisogna adattare il codice)
- Dipendi da un servizio esterno

---

## Opzione B — GCP Cloud Run

**Cos'è**: Google Cloud Platform permette di eseguire container Docker
su richiesta. Paghi solo quando l'app riceve traffico (praticamente gratis
per uso personale).

**Come funziona**:
1. Crei un `Dockerfile` per l'app Next.js
2. Fai il build del container e lo carichi su GCP
3. Cloud Run lo esegue su richiesta

**Costo**: Free tier generoso (2 milioni di richieste/mese gratis).
Per uso personale: €0.

**PDF**: Il container può includere i PDF al suo interno (non è git,
è un'immagine Docker privata).

**Pro**:
- Scala automaticamente
- Infrastruttura Google (affidabile)
- I PDF stanno dentro il container (dati al sicuro)
- HTTPS automatico

**Contro**:
- Richiede imparare Docker (non difficile ma un passaggio in più)
- Configurazione più lunga (~1 ora la prima volta)
- Se hai già un account GCP, parti avvantaggiato

---

## Opzione C — Server casalingo + Cloudflare Tunnel

**Cos'è**: Cloudflare Tunnel crea un tunnel cifrato tra il tuo server
casalingo e la rete Cloudflare. Nessun IP fisso necessario,
nessun port forwarding sul router.

**Come funziona**:
```
Internet → Cloudflare (tuodominio.com) → Tunnel → Mac/PC di casa → app Next.js
```

**Costo**: Gratuito (Cloudflare Tunnel è gratis, serve solo un dominio
~10€/anno, oppure usi un sottodominio gratuito di Cloudflare).

**PDF**: I file stanno sul tuo computer di casa. Non escono mai dalla rete.

**Come si imposta**:
1. Installa `cloudflared` (il client Cloudflare)
2. Autenticati con il tuo account Cloudflare
3. Crea il tunnel: `cloudflared tunnel create harvest-hearth`
4. Avvia l'app Next.js (`npm start`)
5. Avvia il tunnel: `cloudflared tunnel run`

**Pro**:
- I dati del nutrizionista non escono mai dal tuo computer
- Costo quasi zero
- Nessun problema con IP dinamico
- Hai pieno controllo

**Contro**:
- L'app è offline se il computer di casa è spento o la connessione cade
- Non adatto se hai bisogno di accesso H24 affidabile
- Richiede un processo sempre attivo sul tuo Mac

---

## Confronto rapido

| Criterio              | Vercel       | GCP Cloud Run   | Home + Cloudflare |
|-----------------------|--------------|-----------------|-------------------|
| Difficoltà setup      | ⭐ Facile    | ⚙️ Media        | ⚙️ Media          |
| Costo                 | Gratis       | ~Gratis         | ~Gratis           |
| PDF sul server        | ❌ No        | ✅ Sì           | ✅ Sì (locale)    |
| Privacy dati          | ⚠️ Cloud     | ⚠️ Cloud Google | ✅ Massima        |
| Disponibilità H24     | ✅ Sì        | ✅ Sì           | ⚠️ Dipende da te  |
| IP fisso necessario   | No           | No              | No                |
| Imparare Docker       | No           | Sì              | No                |

---

## Raccomandazione

**Se vuoi partire subito e semplice → Vercel**
Adatta il codice per leggere il testo dei PDF da file `.txt` invece
che dai PDF binari. 30 minuti di lavoro, poi sei online.

**Se hai già GCP e vuoi imparare Docker → GCP Cloud Run**
Buon investimento di tempo, competenza riutilizzabile.

**Se la privacy dei dati è prioritaria e il PC è sempre acceso → Cloudflare Tunnel**
I dati del nutrizionista non escono mai da casa tua.
