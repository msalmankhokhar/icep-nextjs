'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import usePdfWorkerPreload from '@/utils/usePdfWorkerPreload';

// Dynamically import PDFViewer with no SSR
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-60 md:h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue"></div>
    </div>
  )
});

// Client component to wrap the PDF viewer
export default function PaperViewerClient({ fileUrl }: { fileUrl: string }) {
  // Use the preloader hook
  usePdfWorkerPreload();
  
  // Extra initialization for PDF
  useEffect(() => {
    console.log('Paper viewer client component loaded, fileUrl:', fileUrl);
  }, [fileUrl]);
  
  return <PDFViewer fileUrl={fileUrl} />;
}
