"use client";
import { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function ChangePasswordForm() {
  const locale = useLocale();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState("");
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al cambiar la contraseña.");
    } else {
      setSuccess("Contraseña actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = (event: MouseEvent) => {
    if (!event.target || !(event.target instanceof HTMLElement)) return;
    if (
      !event.target.closest(".user-menu") &&
      !event.target.closest(".user-button")
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const handleCreateDiagram = async () => {
    if (!newDiagramName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/diagram/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newDiagramName }),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setLoading(false);
      router.push(`/${locale}/${data.id}`);
    } else {
      console.error("Error creating diagram");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/user/logout");
    router.push(`/${locale}/login`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="relative w-1/4 bg-gray-800 p-4 text-white">
        <Link href={`/${locale}`} className="self-start">
          <h1 className="mb-10 text-2xl font-bold">ERdoc Playground</h1>
        </Link>
        <button
          className="mb-4 w-full rounded bg-orange-400 p-3 font-bold text-white hover:bg-orange-600"
          onClick={() => setShowModal(true)}
        >
          + Nuevo diagrama
        </button>
        <div className="space-y-2">
          <button
            className="w-full rounded p-2 text-left hover:bg-gray-700"
            onClick={() => router.push(`/${locale}/user`)}
          >
            Mis diagramas
          </button>
          <button
            className="w-full rounded p-2 text-left hover:bg-gray-700"
            onClick={() => router.push(`/${locale}/user/shared`)}
          >
            Compartidos conmigo
          </button>
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform justify-center">
          <button
            className="rounded bg-gray-600 p-2 hover:bg-gray-700"
            onClick={toggleMenu}
          >
            <FaUser className="ml-1 mr-1 inline" />
          </button>
          {menuOpen && (
            <div className="user-menu absolute bottom-12 w-48 rounded bg-white text-black shadow-lg">
              <button
                onClick={() => router.push(`/${locale}/user/change-password`)}
                className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
              >
                Cambiar contraseña
              </button>
              <button
                onClick={() => {
                  setShowDeleteUserModal(true);
                }}
                className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
              >
                Eliminar cuenta
              </button>
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
              >
                {" "}
                Cerrar sesión{" "}
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="w-3/4 p-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-md space-y-4"
        >
          <h2 className="mb-4 text-2xl font-semibold">Cambiar contraseña</h2>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Contraseña actual"
              className="w-full rounded border p-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              className="w-full rounded border p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              className="w-full rounded border p-2"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            className="mb-4 w-full rounded bg-orange-400 p-3 font-bold text-white hover:bg-orange-600"
          >
            Confirmar cambio
          </button>
        </form>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Nombre del diagrama</h2>
            <input
              type="text"
              placeholder="Nombre del diagrama"
              value={newDiagramName}
              onChange={(e) => setNewDiagramName(e.target.value)}
              className="mb-4 w-full rounded border p-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded bg-gray-300 px-4 py-2 font-bold text-black hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateDiagram}
                disabled={loading}
                className={`rounded px-4 py-2 font-bold text-white
                  ${
                    loading
                      ? "cursor-not-allowed bg-orange-300"
                      : "bg-orange-400 hover:bg-orange-600"
                  }
                `}
              >
                {loading ? "Cargando..." : "Aceptar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">¿Eliminar cuenta?</h2>
            <p className="mb-4">
              ¿Seguro que quieres eliminar tu cuenta? Esta acción es
              irreversible. Perderás todos tus datos asociados a la cuenta y no
              podrás recuperarla.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteUserModal(false)}
                className="rounded bg-gray-300 px-4 py-2 font-bold hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/user`, {
                    method: "DELETE",
                    credentials: "include",
                  });
                  setShowDeleteUserModal(false);
                  router.push(`/${locale}/login`);
                }}
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
