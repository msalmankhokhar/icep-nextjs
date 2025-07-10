'use client';

// Configure PDFjs worker
import { pdfjs } from 'react-pdf';

// This pattern works better with Next.js 15
if (typeof window !== 'undefined') {
  console.log('Initializing PDF.js worker with version:', pdfjs.version);
  
  // Use path that will be resolved by webpack configuration
  try {
    // First try to load from local path
    pdfjs.GlobalWorkerOptions.workerSrc = '/_next/static/worker/pdf.worker.min.js';
    console.log('PDF worker configured with local path:', pdfjs.GlobalWorkerOptions.workerSrc);
  } catch (error) {
    // Fallback to CDN if local file fails to load
    console.warn('Failed to load PDF.js worker from local path, falling back to CDN', error);
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      console.log('PDF worker configured with CDN path:', pdfjs.GlobalWorkerOptions.workerSrc);
    } catch (cdnError) {
      console.error('Failed to configure PDF.js worker:', cdnError);
      // Ultimate fallback - try a specific version
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/build/pdf.worker.min.js';
      console.log('PDF worker configured with hardcoded fallback path');
    }
  }
}

export default pdfjs;
