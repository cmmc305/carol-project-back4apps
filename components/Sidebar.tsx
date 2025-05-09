// src/components/Sidebar.tsx
'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeftIcon, BanknoteIcon, FileIcon, ListTodoIcon, MenuIcon, PlusSquareIcon, Settings, UserPlus, XIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
}

const navigationItems: NavItem[] = [
  { href: '/document-analysis', label: 'Document Analysis', icon: <FileIcon className="h-5 w-5" /> },
  { href: '/create-request', label: 'Create Request', icon: <PlusSquareIcon className="h-5 w-5" /> },
  { href: '/list-requests', label: 'List Requests', icon: <ListTodoIcon className="h-5 w-5" /> },
  { href: '/banks', label: 'Banks', icon: <BanknoteIcon className="h-5 w-5" /> },
  { href: '/register-user', label: 'Register User', icon: <UserPlus className="h-5 w-5" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    console.log('Logout realizado');
    router.push('/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  const textVisibility = isCollapsed ? 'opacity-0 absolute left-full transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300';
  const iconMargin = isCollapsed ? 'mr-0' : 'mr-3';

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transition-all duration-300 ${sidebarWidth}`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-2xl font-semibold ${textVisibility} ${!isCollapsed ? 'relative' : ''}`}>Case App Liens</h1>
        <button onClick={toggleCollapse} className="text-gray-400 hover:text-white focus:outline-none focus:shadow-outline cursor-pointer">
          {isCollapsed ? <MenuIcon className="h-6 w-6" /> : <XIcon className="h-6 w-6" />}
        </button>
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
            <span className={`ml-3 ${textVisibility}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeftIcon className={`h-5 w-5 ${iconMargin}`} />
          <span className={`${textVisibility} cursor-pointer`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;