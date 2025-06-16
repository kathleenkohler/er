"use client";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";

export default function ChangePasswordForm() {
    
    const locale = useLocale();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newDiagramName, setNewDiagramName] = useState('');
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        if (!event.target.closest('.user-menu') && !event.target.closest('.user-button')) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeMenu);
        return () => {
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    const handleCreateDiagram = async () => {
        if (!newDiagramName.trim()) return;
        const res = await fetch('/api/diagram/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newDiagramName }),
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            router.push(`/${locale}/${data.id}`); 
        } else {
            console.error('Error creating diagram');
        }
    };

    const handleLogout = async () => {
        await fetch("/api/user/logout");
        router.push(`/${locale}/login`);
      };

  
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-1/4 bg-gray-800 text-white p-4 relative">
                <h1 className="text-2xl font-bold mb-10">ERdoc Playground</h1>
                <button className="w-full bg-orange-400 p-3 rounded text-white font-bold hover:bg-orange-600 mb-4"
                    onClick={() => setShowModal(true)}
                    >+ Nuevo diagrama
                </button>
                <div className="space-y-2">
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left"
                        onClick={() => router.push(`/${locale}/user`)}>
                        Mis diagramas
                    </button>
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left" 
                        onClick={() => router.push(`/${locale}/user/shared`)}>
                        Compartidos conmigo
                    </button>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
                    <button className="bg-gray-600 hover:bg-gray-700 p-2 rounded" onClick={toggleMenu}>
                        <FaUser className="inline mr-1 ml-1" />
                    </button>
                    {menuOpen && (
                        <div className="absolute bottom-12 bg-white text-black rounded shadow-lg w-48 user-menu">
                            <button onClick={() => router.push(`/${locale}/user/change-password`)} className="text-left p-2 hover:bg-gray-100 cursor-pointer w-full">
                                Cambiar contraseña
                            </button>
                            <button onClick={() => {setShowDeleteUserModal(true)}}
                            className="text-left p-2 hover:bg-gray-100 cursor-pointer w-full">
                                Eliminar cuenta
                            </button>
                            <button onClick={handleLogout} className="text-left p-2 hover:bg-gray-100 cursor-pointer w-full"> Cerrar sesión </button>
                        </div>
                    )}
                </div>
            </aside>

            <main className="w-3/4 p-8">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Cambiar contraseña</h2>
                
                <input
                    type="password"
                    placeholder="Contraseña actual"
                    className="w-full p-2 border rounded"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="w-full p-2 border rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    className="w-full p-2 border rounded"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <button type="submit"
                    className="w-full bg-orange-400 p-3 rounded text-white font-bold hover:bg-orange-600 mb-4"
                >
                    Confirmar cambio
                </button>
                </form>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Nombre del diagrama</h2>
                        <input
                            type="text"
                            placeholder="Nombre del diagrama"
                            value={newDiagramName}
                            onChange={(e) => setNewDiagramName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateDiagram}
                                className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteUserModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-xl font-bold mb-4">¿Eliminar cuenta?</h2>
                    <p className="mb-4">¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible. 
                        Perderás todos tus datos asociados a la cuenta y no podrás recuperarla.</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowDeleteUserModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded font-bold hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={async () => {
                                await fetch(`/api/user`, {
                                method: 'DELETE',
                                credentials: 'include',
                                });
                                setShowDeleteUserModal(false);
                                router.push(`/${locale}/login`);
                            }} 
                            className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
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
