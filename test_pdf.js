try {
    const pdf = require('pdf-parse');
    console.log('Type of pdf:', typeof pdf);
    console.log('Is pdf a function?', typeof pdf === 'function');
    console.log('Keys:', Object.keys(pdf));
    if (typeof pdf === 'object') {
        console.log('pdf.default type:', typeof pdf.default);
    }
} catch (e) {
    console.error('Error requiring pdf-parse:', e);
}
