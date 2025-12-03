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
                // Try standard method first
                const text = pdfParser.getRawTextContent();
                if (text) {
                    resolve(text);
                    return;
                }
                throw new Error("getRawTextContent returned empty");
            } catch (err: any) {
                console.warn("getRawTextContent failed, trying manual extraction:", err.message);

                try {
                    // Fallback: Manual extraction from pdfData
                    let rawText = "";
                    if (pdfData && pdfData.Pages) {
                        pdfData.Pages.forEach((page: any) => {
                            if (page.Texts) {
                                page.Texts.forEach((textItem: any) => {
                                    if (textItem.R) {
                                        textItem.R.forEach((t: any) => {
                                            if (t.T) {
                                                rawText += decodeURIComponent(t.T) + " ";
                                            }
                                        });
                                    }
                                });
                            }
                            rawText += "\n";
                        });
                    }

                    if (!rawText.trim()) {
                        throw new Error("Manual extraction yielded no text");
                    }

                    resolve(rawText);
                } catch (manualErr: any) {
                    console.error("Error extracting text from PDF data:", manualErr);
                    reject(new Error(`Failed to extract text from PDF: ${err.message} | ${manualErr.message}`));
                }
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
