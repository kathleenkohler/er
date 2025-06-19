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
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-6 ml-20 self-start text-4xl font-bold text-blue-900">
          ERdoc Playground
        </h1>
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <Image
            src="/er.png"
            width={900}
            height={600}
            alt="ER Diagram"
            className="max-h-full max-w-full object-scale-down"
          />
        </div>
      </div>

      <div className="flex w-1/3 flex-col justify-center bg-gray-900 p-10 text-white">
        <h2 className="mb-6 text-3xl font-bold">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm">Nombre de Usuario</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full rounded bg-gray-800 p-3 text-white focus:outline-none"
                placeholder="Usuario"
                required
              />
              <FaUser className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded bg-gray-800 p-3 text-white focus:outline-none"
                placeholder="Correo electrónico"
                required
              />
              <FaEnvelope className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setClave(e.target.value)}
                className="w-full rounded bg-gray-800 p-3 text-white focus:outline-none"
                placeholder="Contraseña"
                required
              />
              <FaLock className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-orange-400 p-3 font-bold text-white hover:bg-orange-600"
          >
            Registrarme
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-orange-400">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
