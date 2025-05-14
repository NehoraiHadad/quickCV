/**
 * Generates a print-ready document with the resume content
 */
export const createPrintDocument = (resumeContentHtml: string | undefined): Window | null => {
  if (!resumeContentHtml) return null;

  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch (e) {
        console.log(
          "Access to stylesheet blocked by CORS policy:",
          styleSheet.href,
          e
        );
        return "";
      }
    })
    .join("\n");

  const printWindow = window.open("", "_blank");

  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            ${styles}
            body {
              font-family: Arial, sans-serif;
              width: 210mm;
              height: 297mm;
            }
            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${resumeContentHtml}
          <script>
            window.onafterprint = function() {
              window.close();
            };
            window.onload = function() {
              window.print();
              setTimeout(function() {
                if (!window.closed) {
                  window.close();
                }
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return printWindow;
};

/**
 * Converts a zoom level to a display percentage
 */
export const zoomLevelToDisplayValue = (zoomLevel: number): number => {
  return Math.round((zoomLevel / 0.3) * 100);
};

/**
 * Converts a display percentage to a zoom level
 */
export const displayValueToZoomLevel = (displayValue: number): number => {
  return (displayValue / 100) * 0.3;
}; 