interface CreateLektionModalProps {
  onLektionAdded: () => void;
  kursId: number;
}

interface CreateFrageModalProps {
  fetchFrage?: () => void;
  fetchLektion?: () => void;
  kursId: number;
  lektionId: number;
  frageId?: number;
}
