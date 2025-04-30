"use client"
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

// import { MoreVertical, Share2, Trash, User } from 'lucide-react';

export default function ERdocPlayground() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [diagramList, setDiagramList] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newDiagramName, setNewDiagramName] = useState('');
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
              setDiagramList(data.map(d => d.name));
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
        console.log("enviando a api")
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
            router.push(`/${locale}`)
            // router.push(`/${locale}/${data.id}`); 
        } else {
            console.log("error en front")
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
                            <p className="p-2 hover:bg-gray-100 cursor-pointer">Eliminar cuenta</p>
                            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 cursor-pointer"> Cerrar sesión </button>
                        </div>
                    )}
                </div>
            </aside>

            <main className="w-3/4 p-8">
                <h2 className="text-2xl font-semibold mb-4">Mis diagramas</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-l font-semibold mb-2 pb-2 border-b">Nombre</h2>
                    <ul>
                        {diagramList.map((diagram, index) => (
                            <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-200 rounded">
                                {diagram}
                                {/* <div className="flex gap-2">
                                    <Trash className="cursor-pointer" />
                                    <Share2 className="cursor-pointer" />
                                </div> */}
                            </li>
                        ))}
                    </ul>
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

        </div>
    );
}