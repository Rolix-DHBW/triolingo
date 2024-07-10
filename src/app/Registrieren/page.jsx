"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/navigation";

export default function RegistrierenPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [passError, setPassError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const { login } = useContext(UserContext); // Zugriff auf den Benutzerkontext

  useEffect(() => {
    validatePassword(password, confirmPassword); // Überprüfung des Passworts bei Änderungen
  }, [password, confirmPassword]);

  function validatePassword(password, confirmPassword) {
    setPassError(password !== confirmPassword); // Überprüfung, ob das Passwort mit der Bestätigung übereinstimmt
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars
    if (passError) return; // Wenn ein Passwortfehler vorliegt, wird die Funktion abgebrochen

    let userData = {
      name,
      email,
      password,
      isAdmin,
    };

    try {
      const res = await fetch(`/api/User`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const data = await res.json();
        login({ id: data.id, name: data.name, isAdmin: data.isAdmin }); // Benutzer einloggen
        router.push("/"); // Zur Startseite navigieren
      } else {
        const errorData = await res.json();
        if (res.status === 409) {
          setEmailError("Die E-Mail-Adresse existiert bereits."); // E-Mail-Fehler festlegen
        } else {
          console.error("Registration failed", errorData);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex justify-center items-center m-auto p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && (
            <p className="text-red-500 text-xs italic">{emailError}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type="password"
            placeholder="******"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passError && (
            <p className="text-red-500 text-xs italic">
              Passwörter müssen gleich sein!
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="isAdmin"
          >
            Admin
          </label>
          <input
            type="checkbox"
            id="isAdmin"
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Registrieren
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="/Login"
          >
            Einloggen
          </Link>
        </div>
      </form>
    </div>
  );
}
