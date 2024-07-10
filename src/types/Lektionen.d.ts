interface Lektion {
  id: number;
  name: string;
  kursId: number;
  fragen: Frage[];
}

type Lektionen = Array<Lektion> | null;

interface LektionStatus {
  lektionId: number;
  alleRichtigBeantwortet: boolean;
}
