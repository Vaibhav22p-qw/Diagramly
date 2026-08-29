import { connectDB } from "@/lib/mongodb";
import Knowledge from "@/models/Knowledge";
import { analyzeGenerationRequest } from "./request-analysis";
import { selectCompatibleExample } from "./example-selector";
import { generateTemplate } from "./templates";
import { repairCode } from "./feedback";
import type { GenerationRequest, GenerationResult } from "./types";

function adaptExample(code: string, language: "c" | "cpp" | "java" | "python", className?: string): string | null {
  // Java's public entry class can be renamed without changing program behavior.
  if (language === "java" && className && /^[A-Za-z_]\w*$/.test(className) && /public\s+class\s+\w+/.test(code)) {
    return code.replace(/public\s+class\s+\w+/, `public class ${className}`);
  }
  return null;
}

export async function generateCode(request: GenerationRequest): Promise<GenerationResult> {
  const analysis = analyzeGenerationRequest(request);
  const base = { language: analysis.language, analysis };
  if (analysis.language === "unknown") return { ...base, success: false, code: "", mode: "unsupported", notes: ["Choose C, C++, Java, or Python."], confidence: "low" };
  if (request.repair) {
    if (!request.currentCode) return { ...base, success: false, code: "", mode: "unsupported", notes: ["Code is required for repair."], confidence: "low" };
    const repaired = repairCode(analysis.language, request.currentCode, request.diagnostics);
    return { ...base, success: repaired.changed, code: repaired.code, mode: repaired.changed ? "repair" : "unsupported", provenance: repaired.changed ? { kind: "repair", label: "Compiler-feedback repair" } : undefined, notes: repaired.notes, confidence: repaired.changed ? "high" : "low" };
  }
  try {
    await connectDB();
    const records = await Knowledge.find({ language: analysis.language }).limit(50).lean();
    const selected = selectCompatibleExample(records as never, analysis);
    if (selected && selected.concept === analysis.concept) {
      const adapted = adaptExample(selected.code, analysis.language, analysis.className);
      if (adapted) return { ...base, success: true, code: adapted, mode: "adapted-example", provenance: { kind: "knowledge", label: "Adapted learned example", id: selected._id.toString() }, notes: ["Safely renamed the Java entry class in a compatible learned example."], confidence: "high" };
      if (analysis.functionName || analysis.className) {
        // Do not rename arbitrary functions: fall through to a known template.
      } else {
      return { ...base, success: true, code: selected.code, mode: "retrieved-example", provenance: { kind: "knowledge", label: "Learned example", id: selected._id.toString() }, notes: ["Selected a compatible validated learned example."], confidence: "high" };
      }
    }
  } catch (error) {
    console.warn("Diagramly generation knowledge lookup unavailable", error);
  }
  const template = generateTemplate(analysis.language, analysis);
  if (template) return { ...base, success: true, code: template, mode: "template", provenance: { kind: "template", label: "Diagramly template" }, notes: ["Generated from a deterministic language template."], confidence: "high" };
  return { ...base, success: false, code: "", mode: "unsupported", notes: ["This request has no safe learned example or deterministic template."], confidence: "low" };
}
