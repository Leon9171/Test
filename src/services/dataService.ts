import githubService from './githubService';
import { Artikel, Bestand, Auftrag, Statistiken } from '../types';

const ARTIKELFILE = 'data/artikel.csv';
const BESTANDFILE = 'data/bestand.csv';
const AUFTRAGSFILE = 'data/auftraege.csv';

class DataService {
  async loadArtikle(): Promise<Artikel[]> {
    const content = await githubService.getFile(ARTIKELFILE);
    if (!content) return this.getDefaultArtikle();
    return this.parseCSV(content, this.parseArtikle);
  }

  async loadBestand(): Promise<Bestand[]> {
    const content = await githubService.getFile(BESTANDFILE);
    if (!content) return this.getDefaultBestand();
    return this.parseCSV(content, this.parseBestand);
  }

  async loadAuftraege(): Promise<Auftrag[]> {
    const content = await githubService.getFile(AUFTRAGSFILE);
    if (!content) return [];
    return this.parseCSV(content, this.parseAuftrag);
  }

  async saveArtikle(artikel: Artikel[]): Promise<boolean> {
    const csv = this.artikleToCSV(artikel);
    return githubService.saveFile(ARTIKELFILE, csv, 'Update Artikel');
  }

  async saveBestand(bestaende: Bestand[]): Promise<boolean> {
    const csv = this.bestandToCSV(bestaende);
    return githubService.saveFile(BESTANDFILE, csv, 'Update Bestand');
  }

  async saveAuftraege(auftraege: Auftrag[]): Promise<boolean> {
    const csv = this.auftraegeToCSV(auftraege);
    return githubService.saveFile(AUFTRAGSFILE, csv, 'Update Aufträge');
  }

  async getStatistiken(): Promise<Statistiken> {
    const auftraege = await this.loadAuftraege();
    const artikel = await this.loadArtikle();
    const bestaende = await this.loadBestand();

    const gesamtumsatz = auftraege
      .filter(a => a.status === 'abgeschlossen')
      .reduce((sum, a) => sum + a.gesamtbetrag, 0);

    const offeneAuftraege = auftraege
      .filter(a => a.status === 'offen' || a.status === 'in_bearbeitung')
      .length;

    const gesamtbestand = bestaende.reduce((sum, b) => sum + b.menge, 0);

    const bestandswert = bestaende.reduce((sum, b) => {
      const artikel_obj = artikel.find(a => a.id === b.artikel_id);
      return sum + (b.menge * (artikel_obj?.preis || 0));
    }, 0);

    return {
      gesamtumsatz,
      offeneAuftraege,
      gesamtbestand,
      bestandswert,
    };
  }

  private getDefaultArtikle(): Artikel[] {
    return [
      { id: '1', name: 'Honig 500g', beschreibung: 'Bio Blütenhonig', preis: 8.99, einheit: 'Glas', kategorie: 'Honig' },
      { id: '2', name: 'Honig 1kg', beschreibung: 'Bio Blütenhonig', preis: 15.99, einheit: 'Eimer', kategorie: 'Honig' },
      { id: '3', name: 'Bienenwachs', beschreibung: 'Reines Bienenwachs', preis: 12.99, einheit: 'kg', kategorie: 'Wachs' },
      { id: '4', name: 'Pollenpouches', beschreibung: 'Blütenpollen', preis: 4.99, einheit: 'Beutel', kategorie: 'Pollen' },
    ];
  }

  private getDefaultBestand(): Bestand[] {
    return [
      { artikel_id: '1', menge: 50, lagerort: 'Regal A1', zuletzt_aktualisiert: new Date().toISOString() },
      { artikel_id: '2', menge: 30, lagerort: 'Regal A2', zuletzt_aktualisiert: new Date().toISOString() },
      { artikel_id: '3', menge: 100, lagerort: 'Lager B1', zuletzt_aktualisiert: new Date().toISOString() },
      { artikel_id: '4', menge: 200, lagerort: 'Regal C1', zuletzt_aktualisiert: new Date().toISOString() },
    ];
  }

  private parseCSV(content: string, parser: (row: string[]) => any): any[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];
    return lines.slice(1).map(line => parser(this.parseCSVLine(line)));
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  private parseArtikle = (row: string[]): Artikel => ({
    id: row[0],
    name: row[1],
    beschreibung: row[2],
    preis: parseFloat(row[3]),
    einheit: row[4],
    kategorie: row[5],
  });

  private parseBestand = (row: string[]): Bestand => ({
    artikel_id: row[0],
    menge: parseInt(row[1]),
    lagerort: row[2],
    zuletzt_aktualisiert: row[3],
  });

  private parseAuftrag = (row: string[]): Auftrag => ({
    id: row[0],
    auftragsnummer: row[1],
    kunde: row[2],
    datum: row[3],
    status: row[4] as any,
    positionen: JSON.parse(row[5]),
    gesamtbetrag: parseFloat(row[6]),
    notizen: row[7] || '',
  });

  private artikleToCSV(artikel: Artikel[]): string {
    const header = 'id,name,beschreibung,preis,einheit,kategorie\n';
    const rows = artikel.map(a =>
      `${a.id},"${a.name}","${a.beschreibung}",${a.preis},"${a.einheit}","${a.kategorie}"`
    ).join('\n');
    return header + rows;
  }

  private bestandToCSV(bestaende: Bestand[]): string {
    const header = 'artikel_id,menge,lagerort,zuletzt_aktualisiert\n';
    const rows = bestaende.map(b =>
      `${b.artikel_id},${b.menge},"${b.lagerort}","${b.zuletzt_aktualisiert}"`
    ).join('\n');
    return header + rows;
  }

  private auftraegeToCSV(auftraege: Auftrag[]): string {
    const header = 'id,auftragsnummer,kunde,datum,status,positionen,gesamtbetrag,notizen\n';
    const rows = auftraege.map(a =>
      `${a.id},"${a.auftragsnummer}","${a.kunde}","${a.datum}","${a.status}","${JSON.stringify(a.positionen).replace(/"/g, '""')}",${a.gesamtbetrag},"${a.notizen.replace(/"/g, '""')}"`
    ).join('\n');
    return header + rows;
  }
}

export default new DataService();
