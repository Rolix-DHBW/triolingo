import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

export default function CreateFrageModal({
  fetchLektion,
  kursId,
  lektionId,
}: CreateFrageModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [frage, setFrage] = useState("");

  // Funktion zum Absenden des Formulars
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/Kurse/${kursId}/Lektion/${lektionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frage }),
      });

      if (res.ok) {
        setFrage(""); // Frage zurücksetzen
        handleClose(); // Modal schließen
        if (fetchLektion) {
          fetchLektion(); // Lektion neu laden
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
        Frage hinzufügen
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
              Frage hinzufügen
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="frage"
              type="text"
              placeholder="Frage"
              value={frage}
              onChange={(e) => setFrage(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Frage hinzufügen
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
