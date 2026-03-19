@echo off
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\tgorg\.verdent\verdent-projects\new-project"
git add .
git commit -m "feat: v1.0.0 - PWA, i18n, compression, error boundary, test fixes

- PWA: vite-plugin-pwa with GitHub Pages scope, service worker, web manifest
- PWA icons: generated 192x192, 512x512 and apple-touch-icon PNGs
- i18n: pt-BR / en / es language support via src/i18n/translations.ts
- Compression: src/utils/compress.ts - resize+compress images before localStorage
- Integrated compressFile into ChildProfile, PrescriptionsExams, VaccineHistory
- Error Boundary in App.tsx wraps full app with user-friendly fallback UI
- Vaccination card: attach image/PDF to vaccine section
- Medical Agenda: editable appointment modal with notes persistence
- FoodRoutine: locale-invariant keys (MEAL_TYPE_KEYS) fix cross-language sort
- HealthContacts: sanitized tel: href via replace(/[^\d+]/g, '')
- ChildProfile: birthday label normalized to midnight for correct day diff
- MedicalAgenda: UTC date bug fixed using local todayStr for upcoming filter
- package.json: bumped to v1.0.0
- tests/e2e: fixed BASE_URL, conftest autouse->page fixture, selector updates"
git push origin main
