// src/components/LayoutWithSidebar.tsx
'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import AuthGuard from './AuthGuard';

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex h-screen bg-gray-100">
      {!isLoginPage && <Sidebar />}
      <div className={`flex-1 overflow-y-auto bg-gray-200  ${isLoginPage ? '' : 'pl-64'}`}>
        <main>{isLoginPage ? children : <AuthGuard>{children}</AuthGuard>}</main>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;