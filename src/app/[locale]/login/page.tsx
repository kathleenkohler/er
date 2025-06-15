"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useLocale } from "next-intl";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setClave] = useState("");
  const router = useRouter();
  const locale = useLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Error al iniciar sesión");
      router.push(`/${locale}/user`); 
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="flex h-screen">
    <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 ml-20 self-start">ERdoc Playground</h1>
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <Image src="/er.png" width={900} height={600} alt="ER Diagram" className="max-w-full max-h-full object-scale-down"
          />
        </div>
      </div>

      <div className="w-1/3 bg-gray-900 p-10 flex flex-col justify-center text-white">
        <h2 className="text-3xl font-bold mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-2">Correo electrónico</label>
          <div className="relative">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none"
              placeholder="Correo electrónico"
              required
            />
            <FaEnvelope className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Contraseña</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setClave(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none"
              placeholder="Contraseña"
            />
            <FaLock className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        <a href="#" className="text-sm text-gray-400 mb-4">¿Olvidaste tu contraseña?</a>
        <button type="submit" className="w-full bg-orange-400 p-3 rounded text-white font-bold hover:bg-orange-600">
          Entrar
        </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿No tienes una cuenta? <Link href="/register" className="text-orange-400">Registrarme</Link>
        </p>
      </div>
    </div>
  );
}
