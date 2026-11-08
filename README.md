# ErtaRifiuti - Web App PWA

## File presenti (TUTTI PRONTI PER APK)
✅ index.html
✅ styles.css
✅ script.js
✅ manifest.json
✅ service-worker.js
✅ icon-192.png (creata)
✅ icon-512.png (creata)

## Istruzioni per caricare su Netlify (MOLTO SEMPLICE)

### Passo 1: Registrati su Netlify
1. Vai su https://www.netlify.com/
2. Clicca su "Sign up"
3. Registrati con email, GitHub o Google

### Passo 2: Carica i file
1. Dopo il login, clicca su "Add new site" → "Deploy manually"
2. Vedrai una finestra "Drag and drop your site output folder here"
3. Apri la cartella `ErtaRifiuti` sul tuo computer
4. Trascina TUTTI i file nella finestra di Netlify:
   - index.html
   - styles.css
   - script.js
   - manifest.json
   - service-worker.js
   - icon-192.png
   - icon-512.png
5. Aspetta qualche secondo per il caricamento

### Passo 3: Ottieni l'URL
1. Netlify ti darà un URL tipo: `https://random-name-12345.netlify.app`
2. Copia questo URL

### Passo 4: Crea l'APK con PWA Builder
1. Vai su https://www.pwabuilder.com/
2. Inserisci l'URL di Netlify
3. Clicca su "Package for Android"
4. Aspetta l'elaborazione
5. Scarica l'APK

### Passo 5: Installa l'APK
1. Sul tuo dispositivo Android, abilita "Installazione app da sconosciuti" nelle impostazioni
2. Trasferisci l'APK sul dispositivo
3. Installa l'APK
4. All'avvio, accetta il permesso per le notifiche

## Configurazioni attive
- ✅ PWA configurata con manifest.json
- ✅ Service worker per notifiche in background
- ✅ Permesso notifiche richiesto all'avvio
- ✅ Icone create (192x192 e 512x512)
- ✅ Notifiche alle 01:00 locali del dispositivo
- ✅ Persistenza dati in localStorage
- ✅ Layout ottimizzato per Android (portrait)

## Notifiche
Le notifiche sono configurate per:
- Web: API Notification + Service Worker
- APK: Supporto nativo tramite PWA Builder

Le notifiche vengono inviate alle 01:00 del giorno se è presente un'assegnazione.

## Per l'APK
Quando installi l'APK:
1. L'app richiederà il permesso per le notifiche
2. Le notifiche funzioneranno anche se l'app è chiusa (grazie al service worker)
3. L'orario delle notifiche sarà basato sull'ora locale del dispositivo


