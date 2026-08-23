import { NextResponse } from "next/server";
import https from "https";

type Language = "c" | "cpp" | "java" | "python";

const LANGUAGE_CONFIG: Record<
  Language,
  {
    language: string;
    versionIndex: string;
  }
> = {
  c: {
    language: "c",
    versionIndex: "5",
  },

  cpp: {
    language: "cpp",
    versionIndex: "5",
  },

  java: {
    language: "java",
    versionIndex: "4",
  },

  python: {
    language: "python3",
    versionIndex: "4",
  },
};

const JDOODLE_TIMEOUT_MARKER = "JDoodle - Timeout";

function cleanJDoodleText(text: string): string {
  const markerIndex = text.indexOf(
    JDOODLE_TIMEOUT_MARKER
  );

  if (markerIndex !== -1) {
    return text
      .substring(0, markerIndex)
      .trim();
  }

  return text.trim();
}

function executeJDoodle(
  payload: object
): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const request = https.request(
      {
        hostname: "api.jdoodle.com",
        path: "/v1/execute",
        method: "POST",
        family: 4,

        headers: {
          "Content-Type": "application/json",
          "Content-Length":
            Buffer.byteLength(data),
        },

        timeout: 15000,
      },
      (response) => {
        let body = "";

        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          try {
            const parsed = JSON.parse(body);

            if (
              response.statusCode &&
              response.statusCode >= 400
            ) {
              reject(
                new Error(
                  parsed.error ||
                    parsed.message ||
                    `JDoodle HTTP ${response.statusCode}`
                )
              );

              return;
            }

            resolve(parsed);
          } catch {
            reject(
              new Error(
                `Invalid JDoodle response: ${body}`
              )
            );
          }
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(
        new Error(
          "JDoodle connection timed out."
        )
      );
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(data);
    request.end();
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const language = body.language as Language;
    const code = body.code;

    const stdin =
      typeof body.stdin === "string"
        ? body.stdin
        : "";

    // ---------------------------------------------
    // Validation
    // ---------------------------------------------

    if (!language || !code) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Language and code are required.",
        },
        { status: 400 }
      );
    }

    if (!LANGUAGE_CONFIG[language]) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported programming language.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // JDoodle credentials
    // ---------------------------------------------

    const clientId =
      process.env.JDOODLE_CLIENT_ID;

    const clientSecret =
      process.env.JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "JDoodle credentials are not configured.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // Language configuration
    // ---------------------------------------------

    const config =
      LANGUAGE_CONFIG[language];

    // ---------------------------------------------
    // Execute code using JDoodle
    // ---------------------------------------------

    const data = await executeJDoodle({
      clientId,
      clientSecret,

      script: code,

      stdin,

      language: config.language,

      versionIndex: config.versionIndex,

      compileOnly: false,
    });

    // ---------------------------------------------
    // Compilation / execution status
    // ---------------------------------------------

    const compiled =
      data.isCompiled !== false &&
      data.compilationStatus !== 1;

    const executed =
      data.isExecutionSuccess === true;

    // ---------------------------------------------
    // Clean JDoodle response
    // ---------------------------------------------

    const rawOutput =
      data.output || "";

    const rawError =
      data.error || "";

    const output =
      cleanJDoodleText(rawOutput);

    let error =
      cleanJDoodleText(rawError);

    // ---------------------------------------------
    // Timeout detection
    // ---------------------------------------------

    const hasJDoodleTimeout =
      rawOutput.includes(
        JDOODLE_TIMEOUT_MARKER
      ) ||
      rawError.includes(
        JDOODLE_TIMEOUT_MARKER
      );

    if (hasJDoodleTimeout) {
      /*
       * If there was already a real
       * compiler/runtime error before the
       * JDoodle timeout message, keep it.
       */
      if (!output && !error) {
        error =
          "Program timed out. Check for an infinite loop or missing input.";
      }
    }

    // ---------------------------------------------
    // Response
    // ---------------------------------------------

    return NextResponse.json({
      success:
        compiled && executed,

      compiled,

      executed,

      output,

      error,

      exitCode:
        compiled && executed
          ? 0
          : 1,

      memory:
        data.memory || null,

      cpuTime:
        data.cpuTime || null,

      compilationStatus:
        data.compilationStatus ??
        null,
    });
  } catch (error: any) {
    console.error(
      "Diagramly JDoodle compiler error:",
      error
    );

    console.error(
      "JDoodle error cause:",
      error?.cause
    );

    return NextResponse.json(
      {
        success: false,

        compiled: false,

        executed: false,

        output: "",

        error:
          error?.cause?.code ||
          error?.cause?.message ||
          error?.message ||
          "Compiler service failed.",

        exitCode: null,
      },
      { status: 500 }
    );
  }
}
