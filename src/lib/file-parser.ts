// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

// Disable worker to avoid loading issues in serverless environment
// if (typeof window === 'undefined') {
//     pdfjsLib.GlobalWorkerOptions.workerSrc = '';
// }

export async function parsePdf(buffer: Buffer): Promise<string> {
    return "PDF parsing is temporarily disabled for debugging. Please upload a Word document or wait for the fix.";
    /*
    try {
        const data = new Uint8Array(buffer);
        const loadingTask = pdfjsLib.getDocument(data);
        const pdfDocument = await loadingTask.promise;
        let text = "";
        
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            text += strings.join(" ") + "\n";
        }
        
        return text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to parse PDF file");
    }
    */
}

export async function parseDocx(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error("Error parsing DOCX:", error);
        throw new Error("Failed to parse DOCX file");
    }
}
