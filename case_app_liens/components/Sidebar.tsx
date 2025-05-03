// src/components/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'; // Certifique-se de instalar @heroicons/react

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Home', icon: <HomeIcon className="h-5 w-5" /> },
  { href: '/tarefas', label: 'Tarefas', icon: <ClipboardIcon className="h-5 w-5" /> },
  { href: '/usuarios', label: 'Usuários', icon: <UsersIcon className="h-5 w-5" /> },
  { href: '/configuracoes', label: 'Configurações', icon: <CogIcon className="h-5 w-5" /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Logout realizado');
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Case App Liens</h1>
      </div>
      <nav className="mt-6">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center p-4 hover:bg-gray-700 transition-colors duration-200 ${
              pathname === item.href ? 'bg-gray-700' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;