    import React from 'react';

    const PDFViewer2 = ({ pdfUrl }: { pdfUrl: string }) => {
      return (
        <div>
          <iframe src={pdfUrl} width="100%" height="500px" title="PDF Viewer" />
        </div>
      );
    };

    export default PDFViewer2;