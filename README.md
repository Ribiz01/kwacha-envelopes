# Kwacha Envelopes

Personal envelope budget in Zambian Kwacha, as an installable offline PWA.

- Envelopes with monthly budgets, progress and "left to spend"
- Wallets: Airtel Money, MTN MoMo, Zanaco, FNB, Stanbic, Absa, Cash
- Paste (or share, on Android) an Airtel / MoMo / bank SMS to fill a transaction, including wallet balance
- Data stays on the phone (localStorage), with JSON backup and restore

Also: fees on any transaction, recurring bills (mark paid, calendar file, due reminders), envelope rollover, insights, saving goals, and app lock (PIN + fingerprint).

Static site: `index.html`, `styles.css`, `features.css`, `app.js`, `sw.js`, `manifest.webmanifest`. The Vercel build (`vercel.json`) copies them into `public/` and draws the icons with `build-icons.js` (no dependencies).

Live: https://kwacha-envelopes.vercel.app

When changing `app.js` or the CSS, bump `?v=` in `index.html` and `VERSION`/`SHELL` in `sw.js` so phones pick up the update.
