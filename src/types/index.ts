export interface Artikel {
  id: string;
  name: string;
  beschreibung: string;
  preis: number;
  einheit: string;
  kategorie: string;
}

export interface Bestand {
  artikel_id: string;
  menge: number;
  lagerort: string;
  zuletzt_aktualisiert: string;
}

export interface Auftrag {
  id: string;
  auftragsnummer: string;
  kunde: string;
  datum: string;
  status: 'offen' | 'in_bearbeitung' | 'abgeschlossen' | 'storniert';
  positionen: AuftragPosition[];
  gesamtbetrag: number;
  notizen: string;
}

export interface AuftragPosition {
  artikel_id: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}

export interface Statistiken {
  gesamtumsatz: number;
  offeneAuftraege: number;
  gesamtbestand: number;
  bestandswert: number;
}
