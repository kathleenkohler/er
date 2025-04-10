"use client"
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// import { MoreVertical, Share2, Trash, User } from 'lucide-react';

const DiagramList = ['Diagrama Proyecto', 'Diagrama Laboratorio'];

export default function ERdocPlayground() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

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

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-1/4 bg-gray-800 text-white p-4 relative">
                <h1 className="text-2xl font-bold mb-10">ERdoc Playground</h1>
                <button className="w-full bg-orange-400 p-3 rounded text-white font-bold hover:bg-orange-600 mb-4">+ Nuevo diagrama</button>
                <div className="space-y-2">
                    <button className="hover:bg-gray-700 text-orange-400 p-2 rounded w-full text-left"
                        onClick={() => router.push('/user')}>
                        Mis diagramas
                    </button>
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left" 
                        onClick={() => router.push('/user/shared')}>
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
                            <p className="p-2 hover:bg-gray-100 cursor-pointer">Cerrar sesión</p>
                        </div>
                    )}
                </div>
            </aside>

            <main className="w-3/4 p-8">
                <h2 className="text-2xl font-semibold mb-4">Mis diagramas</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-l font-semibold mb-2 pb-2 border-b">Nombre</h2>
                    <ul>
                        {DiagramList.map((diagram, index) => (
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
        </div>
    );
}