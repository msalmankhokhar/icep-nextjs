'use client';

import * as React from 'react';
import Image from 'next/image';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

// Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
  // Toolbar plugin with custom configuration
  const toolbarPluginInstance = toolbarPlugin({
    downloadPlugin: {
      // Download button ko completely hide kar dete hain
      downloadMenuItem: () => null,
    },
    openPlugin: {
      // Open file button ko hide kar dete hain
      openMenuItem: () => null,
    },
    printPlugin: {
      // Print button ko hide kar dete hain  
      printMenuItem: () => null,
    },
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Sidebar tabs remove kar dete hain
    toolbarPlugin: toolbarPluginInstance,
    // Download aur file operations disable kar dete hain
    renderToolbar: (Toolbar) => (
      <Toolbar>        {(slots) => {
          const {
            CurrentPageInput,
            // Download, // Yeh use nahi kar rahe
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            // Open, // Yeh bhi use nahi kar rahe
            // Print, // Yeh bhi use nahi kar rahe
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
          } = slots;
          return (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                width: '100%',
                padding: '4px',
                backgroundColor: '#f8f9fa',
              }}
            >
              <div style={{ padding: '0px 2px' }}>
                <ShowSearchPopover />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomOut />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <Zoom />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomIn />
              </div>
              <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                <GoToPreviousPage />
              </div>
              <div style={{ padding: '0px 2px', width: '4rem' }}>
                <CurrentPageInput />
              </div>
              <div style={{ padding: '0px 2px' }}>
                / <NumberOfPages />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <GoToNextPage />
              </div>
              <div style={{ padding: '0px 2px', marginLeft: '8px' }}>
                <EnterFullScreen />
              </div>
              {/* Download, Open, Print buttons ko yahan add nahi kar rahe */}
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  return (
    <div className="relative">
      {/* PDF Viewer Container */}
      <div
        className='h-[350px] sm:h-[90vh] rounded-xl overflow-hidden'
        style={{ border: '1px solid #eee' }}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
      >
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>

      {/* Watermark Logo - Top Right */}
      {/* <div className="absolute top-4 right-4 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <Image
            src="/images/logos/logo.png"
            alt="ICEP Institute"
            width={40}
            height={40}
            className="opacity-70"
          />
        </div>
      </div> */}

      {/* Watermark Logo - Center (Subtle) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <div className="w-[25vw] aspect-square">
          <Image
            src="/images/logos/logo.png"
            alt="ICEP Institute"
            fill
            className="opacity-30 object-cover object-center"
          />
        </div>
      </div>

      {/* Watermark Logo - Bottom Left */}
      {/* <div className="absolute bottom-4 left-4 z-50 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
          <Image
            src="/images/logos/logo.png"
            alt="ICEP Institute"
            width={24}
            height={24}
            className="opacity-70"
          />
          <span className="text-xs font-semibold text-gray-700">ICEP Institute</span>
        </div>
      </div> */}
    </div>
  );
};

export default PDFViewer;