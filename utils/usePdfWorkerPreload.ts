'use client';

// This script preloads the PDF.js worker script to ensure it's ready
// when needed by the PDF viewer component
import { useEffect } from 'react';
import pdfjs from './pdfWorker';

export function usePdfWorkerPreload() {
  useEffect(() => {
    // Preload the PDF worker script
    try {
      const workerUrl = pdfjs.GlobalWorkerOptions.workerSrc;
      if (workerUrl) {
        console.log('Preloading PDF worker from:', workerUrl);
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'script';
        preloadLink.href = workerUrl;
        preloadLink.id = 'pdf-worker-preload';
        document.head.appendChild(preloadLink);
        
        return () => {
          // Clean up on unmount
          const existingLink = document.getElementById('pdf-worker-preload');
          if (existingLink) {
            document.head.removeChild(existingLink);
          }
        };
      }
    } catch (error) {
      console.error('Error preloading PDF worker:', error);
    }
  }, []);
}

export default usePdfWorkerPreload;
