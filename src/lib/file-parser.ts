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
