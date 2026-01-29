const { PDFParse } = require('pdf-parse');

console.log('PDFParse exported:', PDFParse);

if (typeof PDFParse === 'function') { // Class constructor is a function
    try {
        const parser = new PDFParse({ data: Buffer.from("dummy pdf content") });
        console.log('Parser instantiated successfully');
        // We won't call parser.getText() because the buffer is junk.
    } catch (e) {
        console.log('Error instantiating parser (expected if content is junk but constructor works):', e.message);
    }
} else {
    console.log('PDFParse is NOT a function/class');
    const all = require('pdf-parse');
    console.log('Full export keys:', Object.keys(all));
}
