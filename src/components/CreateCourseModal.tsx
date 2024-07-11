import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

export default function CreateCourseModal({ fetchFrage }: CreateCourseModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = useState("");

  // Funktion zum Absenden des Formulars
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    try {
      // Kursdaten an den Server senden
      const res = await fetch(`/api/Kurse`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        // Kurs erfolgreich hinzugefügt
        const data = await res.json();
        setName("");
        handleClose();
        fetchFrage();
      } else {
        console.error("Registrierung fehlgeschlagen");
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }

  return (
    <div>
      {/* Button zum Öffnen des Modals */}
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
        onClick={handleOpen}
      >
        Kurs hinzufügen
      </Button>
      {/* Modal für das Hinzufügen eines Kurses */}
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
          {/* Formular zum Hinzufügen eines Kurses */}
          <form onSubmit={handleSubmit}>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Kurs hinzufügen
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button
              className="bg-blue-500  hover:bg-blue-700 text-white font-bold py-2  px-4 rounded  focus:outline-none  focus:shadow-outline mt-2"
              type="submit"
            >
              Kurs hinzufügen
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
