// Loaded lazily: pdf-parse pulls in a native canvas binding that is
// platform-specific. Importing it at startup can crash the whole function on
// serverless (e.g. Linux), taking every route down with it.
const loadPdfParse = async () => {
    const { PDFParse } = await import("pdf-parse");
    return PDFParse;
};

export const extractTextFromPDF = async (buffer) => {
    const PDFParse = await loadPdfParse();
    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
};
