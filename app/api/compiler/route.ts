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

const JDOODLE_TIMEOUT_MARKER =
  "JDoodle - Timeout";

function executeJDoodle(
  payload: object
): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: "api.jdoodle.com",
        path: "/v1/execute",
        method: "POST",
        family: 4,

        headers: {
          "Content-Type":
            "application/json",

          "Content-Length":
            Buffer.byteLength(data),
        },

        timeout: 15000,
      },

      (res) => {
        let body = "";

        res.setEncoding("utf8");

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          try {
            const parsed =
              JSON.parse(body);

            if (
              res.statusCode &&
              res.statusCode >= 400
            ) {
              reject(
                new Error(
                  parsed.error ||
                    parsed.message ||
                    `JDoodle HTTP ${res.statusCode}`
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

    req.on("timeout", () => {
      req.destroy(
        new Error(
          "JDoodle connection timed out."
        )
      );
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const language =
      body.language as Language;

    const code = body.code;

    const stdin =
      typeof body.stdin === "string"
        ? body.stdin
        : "";

    // -----------------------------------------
    // Validate input
    // -----------------------------------------

    if (!language || !code) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Language and code are required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // Validate language
    // -----------------------------------------

    if (!LANGUAGE_CONFIG[language]) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported programming language.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // JDoodle credentials
    // -----------------------------------------

    const clientId =
      process.env.JDOODLE_CLIENT_ID;

    const clientSecret =
      process.env.JDOODLE_CLIENT_SECRET;

    if (
      !clientId ||
      !clientSecret
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "JDoodle credentials are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // Get language configuration
    // -----------------------------------------

    const config =
      LANGUAGE_CONFIG[language];

    // -----------------------------------------
    // Execute JDoodle
    // -----------------------------------------

    const data =
      await executeJDoodle({
        clientId,
        clientSecret,

        script: code,

        stdin,

        language:
          config.language,

        versionIndex:
          config.versionIndex,

        compileOnly: false,
      });

    // -----------------------------------------
    // Compilation status
    // -----------------------------------------

    const compiled =
      data.isCompiled !== false &&
      data.compilationStatus !== 1;

    // -----------------------------------------
    // Execution status
    // -----------------------------------------

    const executed =
      data.isExecutionSuccess === true;

    // -----------------------------------------
    // Raw output
    // -----------------------------------------

    const rawOutput =
      typeof data.output === "string"
        ? data.output
        : "";

    const rawError =
      typeof data.error === "string"
        ? data.error
        : "";

    // -----------------------------------------
    // Clean output
    // -----------------------------------------

    const outputMarkerIndex =
      rawOutput.indexOf(
        JDOODLE_TIMEOUT_MARKER
      );

    const errorMarkerIndex =
      rawError.indexOf(
        JDOODLE_TIMEOUT_MARKER
      );

    const output =
      outputMarkerIndex !== -1
        ? rawOutput
            .substring(
              0,
              outputMarkerIndex
            )
            .trim()
        : rawOutput.trim();

    let error =
      errorMarkerIndex !== -1
        ? rawError
            .substring(
              0,
              errorMarkerIndex
            )
            .trim()
        : rawError.trim();

    // -----------------------------------------
    // Timeout detection
    // -----------------------------------------

    const hasJDoodleTimeout =
      rawOutput.includes(
        JDOODLE_TIMEOUT_MARKER
      ) ||
      rawError.includes(
        JDOODLE_TIMEOUT_MARKER
      );

    if (
      hasJDoodleTimeout &&
      !output &&
      !error
    ) {
      error =
        "Program timed out. Check for an infinite loop or missing input.";
    }

    // -----------------------------------------
    // Response
    // -----------------------------------------

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
      {
        status: 500,
      }
    );
  }
}