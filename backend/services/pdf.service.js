// unpdf ships a pure-JS pdf.js build with no native canvas dependency, so it
// works in serverless runtimes (Vercel/Linux) where the canvas binding is
// unavailable. Loaded lazily to keep cold starts light.
let unpdfPromise;

const loadUnpdf = () => {
    unpdfPromise ??= import("unpdf");
    return unpdfPromise;
};

export const extractTextFromPDF = async (buffer) => {
    const { extractText, getDocumentProxy } = await loadUnpdf();

    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });

    return text;
};
