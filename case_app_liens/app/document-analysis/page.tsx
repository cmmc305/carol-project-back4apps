'use client';

import dynamic from 'next/dynamic';

// Carregue o componente dinamicamente com SSR desativado
const DocumentAnalysis = dynamic(() => import('@/components/DocumentAnalysisComponent'), { ssr: false });

export default function Page() {
  return <DocumentAnalysis />;
}