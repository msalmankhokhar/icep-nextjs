'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [width, setWidth] = useState<number>(800);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when the file changes
    setPageNumber(1);
    setNumPages(null);
    setLoading(true);
    setError(false);
    
    // Set width based on window size
    const handleResize = () => {
      // Get container width with a minimum of 320px and maximum of 800px
      const container = document.getElementById('pdf-container');
      if (container) {
        const containerWidth = Math.max(320, Math.min(container.clientWidth, 1000));
        setWidth(containerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError(true);
    setLoading(false);
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
            <p className="mt-2">The document could not be loaded. Please try again later.</p>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            width={width}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="mx-auto"
            loading={null}
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
          
          <p className="text-center text-brand-blue-400 font-medium">
            Page {pageNumber} of {numPages}
          </p>
          
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
