"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/user/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Revisa tu correo para restablecer la contraseña.");
      setLoading(false);
    } else {
      setMessage(data.message || "Error al enviar el correo");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded p-3 font-bold text-white
          ${
            loading
              ? "cursor-not-allowed bg-orange-300"
              : "bg-orange-400 hover:bg-orange-600"
          }
        `}
      >
        Enviar enlace de recuperación
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </form>
  );
}
