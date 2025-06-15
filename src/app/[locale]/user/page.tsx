"use client"
import React, { useEffect, useState } from 'react';
import { FaUser, FaTrash, FaShareAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

type Diagram = { _id: string; name: string };

export default function ERdocPlayground() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [diagramList, setDiagramList] = useState<Diagram[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [newDiagramName, setNewDiagramName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [diagramToDelete, setDiagramToDelete] = useState<Diagram | null>(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [diagramToShare, setDiagramToShare] = useState<Diagram | null>(null);
    const [copiedMessageVisible, setCopiedMessageVisible] = useState(false);
    const router = useRouter();
    const locale = useLocale()

    useEffect(() => {
        fetch('/api/user', {
          credentials: 'include',
        })
          .then(res => res.json())
          .then(setUser);

        fetch('/api/diagram/user', { 
            credentials: 'include' 
        })
          .then(res => res.json())
          .then(data => {
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

    if (!user) return <div>Loading...</div>;

    const handleLogout = async () => {
        await fetch("/api/user/logout");
        router.push(`/${locale}/login`);
      };
    
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


    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-1/4 bg-gray-800 text-white p-4 relative">
                <h1 className="text-2xl font-bold mb-10">ERdoc Playground</h1>
                <button className="w-full bg-orange-400 p-3 rounded text-white font-bold hover:bg-orange-600 mb-4"
                     onClick={() => setShowModal(true)}
                    >+ Nuevo diagrama
                 </button>
                <div className="space-y-2">
                    <button className="hover:bg-gray-700 text-orange-400 p-2 rounded w-full text-left"
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
                            <p className="p-2 hover:bg-gray-100 cursor-pointer">Cambiar contraseña</p>
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
                <h2 className="text-2xl font-semibold mb-4">Mis diagramas</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-l font-semibold mb-2 pb-2 border-b">Nombre</h2>
                {diagramList === null ? (
                    <p className="text-gray-500">Cargando...</p>
                ) : diagramList.length === 0 ? (
                    <p className="text-gray-500">No tienes diagramas</p>
                ) : (
                    <ul>
                        {diagramList.map((diagram) => (
                        <li key={diagram._id} className="flex justify-between items-center p-2 hover:bg-gray-200 rounded">
                            <span
                                className="cursor-pointer flex-1"
                                onClick={() => router.push(`/${locale}/${diagram._id}`)}
                                >
                                {diagram.name}
                            </span>
                            <FaShareAlt
                                className="text-500 cursor-pointer ml-4"
                                onClick={() => {
                                    setDiagramToShare(diagram);
                                    setShareModalOpen(true);
                                }}
                                />
                            <FaTrash
                                className="text-500 cursor-pointer ml-4"
                                onClick={() => {
                                    setDiagramToDelete(diagram);
                                    setShowDeleteModal(true);
                                }}/>
                        </li>
                        ))}
                    </ul>
                )}
                </div>
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

            {shareModalOpen && diagramToShare && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                {copiedMessageVisible && (
                    <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 px-3 py-1 rounded shadow">
                    ¡Copiado!
                    </div>
                )}
                <h2 className="text-lg font-bold mb-4">Compartir diagrama</h2>
                <p className="mb-2">Este es el enlace para compartir:</p>
                <div className="flex items-center border rounded px-2 py-1 mb-4">
                    <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/${diagramToShare._id}`}
                    className="flex-1 outline-none"
                    />
                    <button
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/${diagramToShare._id}`);
                        setCopiedMessageVisible(true);
                        setTimeout(() => setCopiedMessageVisible(false), 2000);
                    }}
                    className="ml-2 px-2 py-1 bg-orange-400 text-white font-bold rounded hover:bg-orange-600 text-sm"
                    >
                    Copiar
                    </button>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShareModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 font-bold rounded hover:bg-gray-400"
                    >
                        Cerrar
                    </button>
                </div>
                </div>
            </div>
            )}


            {showDeleteModal && diagramToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-xl font-bold mb-4">¿Eliminar diagrama?</h2>
                    <p className="mb-4">¿Estás seguro de que deseas eliminar "{diagramToDelete.name}"?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded font-bold hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={async () => {
                                await fetch(`/api/diagram/${diagramToDelete._id}`, {
                                method: 'DELETE',
                                credentials: 'include',
                                });
                                setDiagramList((prev) => prev?.filter(d => d._id !== diagramToDelete._id) ?? []);
                                setShowDeleteModal(false);
                                setDiagramToDelete(null);
                            }} 
                            className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
                        >
                            Eliminar
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