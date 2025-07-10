    import React from 'react';

    const PDFViewerSimple = ({ pdfUrl }: { pdfUrl: string }) => {
      return (
        <div>
          <iframe src={pdfUrl} width="100%" height="500px" title="PDF Viewer" />
        </div>
      );
    };

    export default PDFViewerSimple;