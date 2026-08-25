import "server-only";

const DEFAULT_LOCAL_SERVICE_URL = "http://127.0.0.1:8787";

export type CompilerServiceResult = {
  status: number;
  body: Record<string, unknown>;
};

/** Calls the compiler container from server-side Next.js routes only. */
export async function callCompilerService(
  payload: Record<string, unknown>
): Promise<CompilerServiceResult> {
  const baseUrl = (
    process.env.COMPILER_SERVICE_URL || DEFAULT_LOCAL_SERVICE_URL
  ).replace(/\/$/, "");
  const token = process.env.COMPILER_SERVICE_TOKEN;

  try {
    const response = await fetch(`${baseUrl}/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });

    const body = (await response.json()) as Record<string, unknown>;
    return { status: response.status, body };
  } catch (error) {
    console.error("Compiler service request failed:", error);
    return {
      status: 503,
      body: {
        success: false,
        compiled: false,
        executed: false,
        output: "",
        error: "Compiler service is unavailable. Please try again shortly.",
        exitCode: null,
      },
    };
  }
}
