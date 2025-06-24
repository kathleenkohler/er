"use client";
import React, { useEffect, useState } from "react";
import { FaUser, FaTrash, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

type Diagram = { _id: string; name: string };

export default function ERdocPlayground() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [diagramList, setDiagramList] = useState<Diagram[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [diagramToDelete, setDiagramToDelete] = useState<Diagram | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [diagramToShare, setDiagramToShare] = useState<Diagram | null>(null);
  const [copiedMessageVisible, setCopiedMessageVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/diagram/user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDiagramList(data);
        } else {
          setDiagramList([]);
        }
      });
  }, []);

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

  const handleLogout = async () => {
    await fetch("/api/user/logout");
    router.push(`/${locale}/login`);
  };

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
      router.push(`/${locale}/${data.id}`);
    } else {
      console.error("Error creating diagram");
    }
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
            className="w-full rounded p-2 text-left text-orange-400 hover:bg-gray-700"
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
        <h2 className="mb-4 text-2xl font-semibold">Mis diagramas</h2>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="text-l mb-2 border-b pb-2 font-semibold">Nombre</h2>
          {diagramList === null ? (
            <p className="text-gray-500">Cargando...</p>
          ) : diagramList.length === 0 ? (
            <p className="text-gray-500">No tienes diagramas</p>
          ) : (
            <ul>
              {diagramList.map((diagram) => (
                <li
                  key={diagram._id}
                  className="flex items-center justify-between rounded p-2 hover:bg-gray-200"
                >
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => router.push(`/${locale}/${diagram._id}`)}
                  >
                    {diagram.name}
                  </span>
                  <FaShareAlt
                    className="text-500 ml-4 cursor-pointer"
                    onClick={() => {
                      setDiagramToShare(diagram);
                      setShareModalOpen(true);
                    }}
                  />
                  <FaTrash
                    className="text-500 ml-4 cursor-pointer"
                    onClick={() => {
                      setDiagramToDelete(diagram);
                      setShowDeleteModal(true);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
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

      {shareModalOpen && diagramToShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            {copiedMessageVisible && (
              <div className="absolute right-2 top-2 rounded bg-orange-100 px-3 py-1 text-orange-800 shadow">
                ¡Copiado!
              </div>
            )}
            <h2 className="mb-4 text-lg font-bold">Compartir diagrama</h2>
            <p className="mb-2">Este es el enlace para compartir:</p>
            <div className="mb-4 flex items-center rounded border px-2 py-1">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/${diagramToShare._id}`}
                className="flex-1 outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/${diagramToShare._id}`,
                  );
                  setCopiedMessageVisible(true);
                  setTimeout(() => setCopiedMessageVisible(false), 2000);
                }}
                className="ml-2 rounded bg-orange-400 px-2 py-1 text-sm font-bold text-white hover:bg-orange-600"
              >
                Copiar
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShareModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 font-bold hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && diagramToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">¿Eliminar diagrama?</h2>
            <p className="mb-4">
              {`¿Estás seguro de que deseas eliminar "${diagramToDelete.name}"?`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded bg-gray-300 px-4 py-2 font-bold hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/diagram/${diagramToDelete._id}`, {
                    method: "DELETE",
                    credentials: "include",
                  });
                  setDiagramList(
                    (prev) =>
                      prev?.filter((d) => d._id !== diagramToDelete._id) ?? [],
                  );
                  setShowDeleteModal(false);
                  setDiagramToDelete(null);
                }}
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
              >
                Eliminar
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
