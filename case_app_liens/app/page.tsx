// src/app/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard'; // Ajuste o caminho conforme a estrutura do seu projeto

export default function Home() {
  return (
    <AuthGuard>
      <div>
        <h1>Bem-vindo à sua página inicial protegida!</h1>
        {/* Conteúdo da sua página inicial */}
      </div>
    </AuthGuard>
  );
}