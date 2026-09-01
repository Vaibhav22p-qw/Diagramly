import "server-only";

import { connectDB } from "@/lib/mongodb";
import CompilerExecution, {
  type CompilerExecutionLanguage,
} from "@/models/CompilerExecution";

const EXECUTION_TTL_MS = 10 * 60 * 1000;

export async function beginCompilerExecution({
  executionId,
  language,
  sourceCode,
}: {
  executionId: string;
  language: CompilerExecutionLanguage;
  sourceCode: string;
}) {
  await connectDB();

  const expiresAt = new Date(Date.now() + EXECUTION_TTL_MS);
  await CompilerExecution.findOneAndUpdate(
    { executionId },
    {
      $set: {
        language,
        sourceCode,
        status: "running",
        completedAt: undefined,
        expiresAt,
      },
      $setOnInsert: { executionId },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();
}

export async function finishCompilerExecution({
  executionId,
  exitCode,
}: {
  executionId: string;
  exitCode: number | null;
}) {
  await connectDB();

  const successful = exitCode === 0;
  await CompilerExecution.updateOne(
    { executionId },
    {
      $set: {
        status: successful ? "successful" : "failed",
        completedAt: new Date(),
        expiresAt: new Date(Date.now() + EXECUTION_TTL_MS),
      },
    }
  ).exec();

  if (!successful) {
    await CompilerExecution.deleteOne({ executionId }).exec();
  }
}

export async function consumeSuccessfulCompilerExecution({
  executionId,
  language,
  sourceCode,
}: {
  executionId: string;
  language: CompilerExecutionLanguage;
  sourceCode: string;
}) {
  await connectDB();

  const execution = await CompilerExecution.findOneAndDelete({
    executionId,
    language,
    sourceCode,
    status: "successful",
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!execution) return null;

  return {
    compiled: true,
    executed: true,
    testsPassed: false,
    accepted: true,
  };
}
