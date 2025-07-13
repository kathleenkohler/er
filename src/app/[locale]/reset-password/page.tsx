"use client";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const locale = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmNewPassword) {
      setMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    const res = await fetch("/api/user/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Contraseña actualizada");
      setPassword("");
      setConfirmNewPassword("");
      router.push(`/${locale}/login`);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Restablecer contraseña</h1>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded border p-2"
        />
        <span
          className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="relative">
        <input
          type={showConfirmNewPassword ? "text" : "password"}
          placeholder="Confirmar nueva contraseña"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          className="w-full rounded border p-2"
        />
        <span
          className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
        >
          {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-orange-400 p-2 font-bold text-white hover:bg-orange-600"
      >
        Actualizar
      </button>
      <p className="mt-2 text-sm text-gray-700">{message}</p>
    </form>
  );
}
