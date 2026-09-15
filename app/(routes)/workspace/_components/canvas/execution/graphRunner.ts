import type { CanvasObject, Connector } from "../types";
import type { ComposedProgram, GraphValidationResult } from "./types";
import { validateExecutionGraph } from "./graphValidator";
import { composeProgram } from "./codeComposer";
import { runCode as defaultRunCode } from "@/lib/compiler/run";
import type { LANGUAGES } from "@/lib/compiler/languages";

export interface GraphRunnerResult {
  success: boolean;
  output?: string;
  error?: string;
  composedProgram?: ComposedProgram;
  validationResult?: GraphValidationResult;
}

export type RunCodeFunction = (
  language: keyof typeof LANGUAGES,
  code: string
) => Promise<{ output?: string; error?: string }>;

/**
 * Orchestrates the Phase 5 execution graph pipeline:
 * 1. Validates the execution graph for the requested Main CodeBox.
 * 2. Composes participating functions and main into a single source program.
 * 3. Dispatches the composed source via the existing runCode() compiler pathway.
 * 4. Returns compiler output/error and composed program metadata.
 */
export async function runExecutionGraph(
  objects: CanvasObject[],
  connectors: Connector[],
  mainObjectId: string,
  runCodeFn: RunCodeFunction = defaultRunCode
): Promise<GraphRunnerResult> {
  const validationResult = validateExecutionGraph(objects, connectors, mainObjectId);

  if (!validationResult.valid) {
    const errorMessages = validationResult.errors.map((e) => e.message).join("\n");
    return {
      success: false,
      error: errorMessages,
      validationResult,
    };
  }

  const composedProgram = composeProgram(validationResult.graph);

  try {
    const compilerResult = await runCodeFn(
      composedProgram.language as keyof typeof LANGUAGES,
      composedProgram.composedCode
    );

    return {
      success: !compilerResult.error,
      output: compilerResult.output,
      error: compilerResult.error,
      composedProgram,
      validationResult,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Execution error occurred during compilation.",
      composedProgram,
      validationResult,
    };
  }
}
