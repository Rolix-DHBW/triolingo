interface Kurs {
  id: number;
  name: string;
  completedCount: number;
  completedPercentage: number;
}

interface KursStatus {
  kursId: number;
  alleLektionenRichtigBeantwortet: boolean;
}
type Kurse = Array<Kurs> | null;
