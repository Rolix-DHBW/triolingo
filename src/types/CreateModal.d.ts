interface CreateLektionModalProps {
    fetchLektionen: () => void;
    kursId: number;
}

interface CreateFrageModalProps {
    fetchFrage?: () => void;
    fetchLektion?: () => void;
    fetchLektionen?: () => void;
    kursId: number;
    lektionId: number;
    frageId?: number;
}

interface CreateCourseModalProps {
    fetchFrage: () => void;
}