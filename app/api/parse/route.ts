import { NextRequest, NextResponse } from "next/server";
const mammoth = require("mammoth");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop()?.toLowerCase();

    let text = "";
    
    if (ext === "pdf") {
      try {
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(buffer);
        text = data.text;
      } catch (err) {
        return NextResponse.json({ error: "Encrypted or malformed PDF file." }, { status: 400 });
      }
    } else if (ext === "docx" || ext === "doc") {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (err) {
        return NextResponse.json({ error: "Unsupported or malformed Word document." }, { status: 400 });
      }
    } else if (ext === "txt" || ext === "md" || ext === "csv" || ext === "json") {
      text = buffer.toString("utf8");
    } else {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process file." }, { status: 500 });
  }
}
