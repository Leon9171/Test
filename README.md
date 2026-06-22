# 🐝 Imkerei ERP

Ein vereinfachtes ERP-System für Imkereien mit Browseroberfläche und GitHub als Datenspeicher.

## Features

✅ **Dashboard** - Übersicht über Statistiken und offene Aufträge  
✅ **Artikel-Verwaltung** - Produkte erstellen und bearbeiten  
✅ **Warenbestand** - Bestände verwalten und tracken  
✅ **Auftrags-Übersicht** - Bestellungen erstellen und verwalten  
✅ **GitHub Integration** - Daten als CSV in GitHub speichern

## 🚀 Installation & Setup

### 1. GitHub Token erstellen

1. Gehe zu https://github.com/settings/tokens
2. Klicke auf "Generate new token (classic)"
3. Gib einen Namen ein (z.B. "Imkerei-ERP")
4. Wähle "repo" Scope
5. Token kopieren und speichern

### 2. Projekt lokal starten

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### 3. Im Browser öffnen

1. Öffne http://localhost:5173
2. Gib deinen GitHub Token ein
3. Los geht's! 🎉

## 📦 Deployment auf GitHub Pages

```bash
# Build erstellen
npm run build

# Deploy (wenn gh-pages installiert)
npm run deploy
```

## 📊 Datenstruktur

Alle Daten werden als CSV-Dateien in GitHub gespeichert:

- `data/artikel.csv` - Artikelstammdaten
- `data/bestand.csv` - Warenbestand
- `data/auftraege.csv` - Aufträge und Positionen

## 🔒 Sicherheit

- Token wird nur lokal in localStorage gespeichert
- Keine Daten werden an externe Server gesendet
- Token kann jederzeit widerrufen werden

## 🛠️ Tech Stack

- **React 18** - Frontend Framework
- **TypeScript** - Typsicherheit
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **GitHub API** - Datenspeicher

## 📝 Lizenz

MIT
