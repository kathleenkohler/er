"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import { FaLock, FaUser, FaEnvelope } from "react-icons/fa";

export default function Register() {
  const [name, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setClave] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("Error al registrar el usuario");

      const data = await res.json();
      router.push("/user"); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 ml-20 self-start">ERdoc Playground</h1>
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <Image
            src="/er.png"
            width={900}
            height={600}
            alt="ER Diagram"
            className="max-w-full max-h-full object-scale-down"
          />
        </div>
      </div>

      <div className="w-1/3 bg-gray-900 p-10 flex flex-col justify-center text-white">
        <h2 className="text-3xl font-bold mb-6">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Nombre de Usuario</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none"
                placeholder="Usuario"
                required
              />
              <FaUser className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
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
                required
              />
              <FaLock className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-400 p-3 rounded text-white font-bold hover:bg-orange-600">
            Registrarme
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-orange-400">Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
}
