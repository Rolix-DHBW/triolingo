import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

export default function CreateAntwortModal({
  fetchFrage,
  kursId,
  lektionId,
  frageId,
}: CreateFrageModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [antwort, setAntwort] = useState("");
  const [isTrue, setIsTrue] = useState<boolean>(false);

  // Funktion zum Absenden des Formulars
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/Kurse/${kursId}/Lektion/${lektionId}/Frage/${frageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ antwort, isTrue }),
        },
      );

      if (res.ok) {
        setAntwort(""); // Antwort zurücksetzen
        setIsTrue(false); // Checkbox zurücksetzen
        handleClose(); // Modal schließen
        if (fetchFrage) {
          fetchFrage(); // Frage aktualisieren
        }
      } else {
        const errorResponse = await res.json();
        console.error("Frage creation failed", errorResponse);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleOpen}
      >
        Antwort hinzufügen
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <form onSubmit={handleSubmit}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="frage"
            >
              Antwort hinzufügen
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="frage"
              type="text"
              placeholder="Antwort"
              value={antwort}
              onChange={(e) => setAntwort(e.target.value)}
            />
            <input
              id="isTrue"
              type="checkbox"
              checked={isTrue}
              onChange={(e) => setIsTrue(e.target.checked)}
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="frage"
            >
              Antwort ist richtig
            </label>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Antwort hinzufügen
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
