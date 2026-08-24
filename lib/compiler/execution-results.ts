export type CompilerLanguage = "c" | "cpp" | "java" | "python";

type SuccessfulExecution = {
  language: CompilerLanguage;
  sourceCode: string;
  completedAt: number;
};

const EXECUTION_TTL_MS = 5 * 60 * 1000;
const successfulExecutions = new Map<string, SuccessfulExecution>();

export function recordSuccessfulExecution({
  executionId,
  language,
  sourceCode,
  exitCode,
}: {
  executionId: string;
  language: CompilerLanguage;
  sourceCode: string;
  exitCode: number | null;
}) {
  if (exitCode !== 0) return;

  successfulExecutions.set(executionId, {
    language,
    sourceCode,
    completedAt: Date.now(),
  });
}

export function consumeSuccessfulExecution({
  executionId,
  language,
  sourceCode,
}: {
  executionId: string;
  language: CompilerLanguage;
  sourceCode: string;
}) {
  const execution = successfulExecutions.get(executionId);

  if (!execution) return null;

  successfulExecutions.delete(executionId);

  if (
    Date.now() - execution.completedAt > EXECUTION_TTL_MS ||
    execution.language !== language ||
    execution.sourceCode !== sourceCode
  ) {
    return null;
  }

  return {
    compiled: true,
    testsPassed: true,
    accepted: true,
  };
}
