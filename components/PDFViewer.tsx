'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import pdfjs from '@/utils/pdfWorker';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [width, setWidth] = useState<number>(800);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [performance, setPerformance] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Use a ref to track load attempts
  const loadAttempts = useRef(0);
  
  useEffect(() => {
    // Reset states when the file changes
    setPageNumber(1);
    setNumPages(null);
    setLoading(true);
    setError(false);
    loadAttempts.current = 0;
    
    // Auto-detect performance level based on device
    const detectPerformance = () => {
      if (typeof window !== 'undefined') {
        // Check for mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Set performance based on device capabilities
        setPerformance(isMobile ? 'low' : 'medium');
      }
    };
    
    detectPerformance();
    
    // Set width based on window size
    const handleResize = () => {
      // Get container width with a minimum of 320px and maximum of 800px
      const container = document.getElementById('pdf-container');
      if (container) {
        const containerWidth = Math.max(320, Math.min(container.clientWidth, 1000));
        setWidth(containerWidth);
      }
    };
    
    // Try to preload the PDF worker script
    let preloadWorker: HTMLLinkElement | null = null;
    try {
      preloadWorker = document.createElement('link');
      preloadWorker.rel = 'preload';
      preloadWorker.as = 'script';
      preloadWorker.href = pdfjs.GlobalWorkerOptions.workerSrc;
      document.head.appendChild(preloadWorker);
    } catch (e) {
      console.warn('Failed to preload worker:', e);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (preloadWorker && document.head.contains(preloadWorker)) {
        try {
          document.head.removeChild(preloadWorker);
        } catch (e) {
          console.warn('Error removing preload link:', e);
        }
      }
    };
  }, [fileUrl]);

  // Effect to handle changes to performance level
  useEffect(() => {
    if (!loading && !error && numPages) {
      console.log(`Performance mode set to: ${performance}`);
    }
  }, [performance, loading, error, numPages]);
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    loadAttempts.current += 1;
    
    // Check if it's a worker-related error
    if (error.message.includes('worker') || error.message.includes('Worker')) {
      console.error('PDF.js worker error - trying alternate source');
      // Try the CDN worker as fallback
      try {
        // First try with the version from pdfjs
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        console.log('Set worker to:', pdfjs.GlobalWorkerOptions.workerSrc);
      } catch (e) {
        console.error('Error setting worker URL:', e);
        // Use hardcoded version as last resort
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/build/pdf.worker.min.js';
      }
      
      // If we've tried too many times, fallback to low performance mode
      if (loadAttempts.current >= 2) {
        setPerformance('low');
        console.log('Switching to low performance mode after multiple failures');
      }
      
      // Wait a moment and try again
      setTimeout(() => {
        setError(false);
        setLoading(true);
      }, 1000);
    } else {
      // For other errors, if we haven't tried too many times, reduce performance and retry
      if (loadAttempts.current < 3) {
        setPerformance('low');
        console.log('Switching to low performance mode after error');
        setTimeout(() => {
          setError(false);
          setLoading(true);
        }, 1000);
      } else {
        setError(true);
        setLoading(false);
      }
    }
  }

  function handlePDFRetry() {
    setLoading(true);
    setError(false);
    
    // Reset and try to reload the PDF
    setTimeout(() => {
      const container = document.getElementById('pdf-container');
      if (container) {
        const containerWidth = Math.max(320, Math.min(container.clientWidth, 1000));
        setWidth(containerWidth);
      }
    }, 500);
  }

  function changePage(offset: number) {
    if (numPages === null) return;
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.max(1, Math.min(newPage, numPages));
    });
  }

  return (
    <div className="pdf-viewer bg-white p-4 rounded-lg shadow-md">
      <div 
        id="pdf-container" 
        className="bg-gray-100 rounded-lg shadow-inner p-2 md:p-4 overflow-auto"
      >
        {loading && (
          <div className="flex justify-center items-center h-60 md:h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10 text-brand-red">
            <p className="text-xl font-semibold">Failed to load PDF</p>
            <p className="mt-2">The document could not be loaded.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handlePDFRetry}
                className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue-700"
              >
                Try Again
              </button>
              <a 
                href={fileUrl} 
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-yellow text-brand-blue px-4 py-2 rounded-md hover:bg-brand-yellow-600 transition-colors flex items-center justify-center"
              >
                Download Instead
              </a>
            </div>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex justify-center"
          options={{
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/standard_fonts/',
            disableStream: performance === 'low',
            disableAutoFetch: performance === 'low',
            useSystemFonts: true,
            isEvalSupported: true,
            useWorkerFetch: true,
            // Set range chunk size based on performance mode
            rangeChunkSize: performance === 'high' ? 65536 : (performance === 'medium' ? 32768 : 16384),
          }}
        >
          <Page 
            pageNumber={pageNumber} 
            width={width}
            renderTextLayer={performance !== 'low'}
            renderAnnotationLayer={performance !== 'low'}
            className="mx-auto"
            loading={null}
            canvasBackground={performance === 'high' ? 'rgba(255, 255, 255, 1)' : 'transparent'}
            customTextRenderer={performance === 'high' ? undefined : () => ''}
          />
        </Document>
      </div>

      {!loading && !error && numPages && (
        <div className="controls mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className={`bg-brand-blue text-white px-4 py-2 rounded-md ${
                pageNumber <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-blue-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || 1)}
              className={`bg-brand-blue text-white px-4 py-2 rounded-md ${
                pageNumber >= (numPages || 1) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-blue-700'
              }`}
            >
              Next
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-center text-brand-blue-400 font-medium">
              Page {pageNumber} of {numPages}
            </p>
            <div className="mt-1 flex items-center text-xs">
              <span className="mr-2 text-brand-blue-400">Performance:</span>
              <button 
                onClick={() => setPerformance('low')}
                className={`px-2 py-1 rounded-l-md ${
                  performance === 'low' 
                    ? 'bg-brand-blue text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Low
              </button>
              <button 
                onClick={() => setPerformance('medium')}
                className={`px-2 py-1 ${
                  performance === 'medium' 
                    ? 'bg-brand-blue text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Medium
              </button>
              <button 
                onClick={() => setPerformance('high')}
                className={`px-2 py-1 rounded-r-md ${
                  performance === 'high' 
                    ? 'bg-brand-blue text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                High
              </button>
            </div>
          </div>
          
          <a 
            href={fileUrl} 
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-red text-white px-4 py-2 rounded-md hover:bg-brand-red-600 transition-colors"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
