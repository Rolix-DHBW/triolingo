"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailInputError, setEmailInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { login } = useContext(UserContext);

  const [users, setUsers] = useState([]);

  // Nutzer beim Laden der Seite fetchen
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/User`, {
          method: "GET",
        });
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          console.error("Failed to fetch users");
          setError("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  // Validierungsfunktion für die E-Mail-Adresse
  function validate() {
    let emailIsValid = validateEmail(email);
    setEmailInputError(!emailIsValid);
  }

  // E-Mail Validierung mit regulärem Ausdruck
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Handler für das Einloggen
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    validate();

    if (emailInputError) {
      setIsLoading(false);
      return;
    }

    // Prüfen, ob der Nutzer existiert und das Passwort korrekt ist
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      router.push("/"); // Umleiten auf die Startseite
      login({ id: user.id, name: user.name, isAdmin: user.isAdmin }); // Nutzer einloggen
    } else {
      setError("Ungültiger Benutzername oder Passwort"); // Fehlermeldung anzeigen
    }
    setIsLoading(false);
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
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border ${emailInputError ? "border-red-500" : ""} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailInputError && (
            <p className="text-red-500 text-xs italic">
              Ungültige E-Mail-Adresse.
            </p>
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
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Einloggen"}
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="/Registrieren"
          >
            Registrieren
          </Link>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </form>
    </div>
  );
}
