import { NextRequest, NextResponse } from "next/server";
import { parsePdf, parseDocx } from "@/lib/file-parser";
import { generateSummary } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        if (file.type === "application/pdf") {
            text = await parsePdf(buffer);
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.endsWith(".docx")
        ) {
            text = await parseDocx(buffer);
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Please upload PDF or DOCX." },
                { status: 400 }
            );
        }

        if (!text.trim()) {
            return NextResponse.json(
                { error: "Could not extract text from the file." },
                { status: 400 }
            );
        }

        const analysis = await generateSummary(text);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { error: "Internal server error during analysis." },
            { status: 500 }
        );
    }
}
