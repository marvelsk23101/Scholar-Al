import mammoth from "mammoth";
import PDFParser from "pdf2json";

export async function parsePdf(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true); // true = enable raw text parsing

        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF Parser Error:", errData.parserError);
            reject(new Error("Failed to parse PDF file"));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            try {
                // Extract text from the parsed data
                // pdf2json returns URL-encoded text, so we need to decode it
                const text = pdfParser.getRawTextContent();
                resolve(text);
            } catch (err) {
                console.error("Error extracting text from PDF data:", err);
                reject(new Error("Failed to extract text from PDF"));
            }
        });

        // pdf2json expects a buffer, but parseBuffer is not directly available on the instance in all versions?
        // Actually it has parseBuffer method.
        pdfParser.parseBuffer(buffer);
    });
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
