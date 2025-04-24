declare module "html2pdf.js" {
    interface Html2PdfOptions {
      margin?: string | number;
      filename?: string;
      image?: any;
      html2canvas?: any;  // Allow any type for html2canvas options (can adjust as needed)
      jsPDF?: any;        // Allow any type for jsPDF options (can adjust as needed)
      // Add any other options that html2pdf.js supports
    }
  
    interface Html2PdfInstance {
      set(options: Html2PdfOptions): Html2PdfInstance;
      from(element: HTMLElement): Html2PdfInstance;
      save(filename?: string): void;
    }
  
    function html2pdf(): Html2PdfInstance;
  
    export = html2pdf;
  }
  