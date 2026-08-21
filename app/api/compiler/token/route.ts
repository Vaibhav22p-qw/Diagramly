import { NextResponse } from "next/server";
import https from "https";

function getJDoodleToken(
  clientId: string,
  clientSecret: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      clientId,
      clientSecret,
    });

    const request = https.request(
      {
        hostname: "api.jdoodle.com",
        path: "/v1/auth-token",
        method: "POST",
        family: 4,

        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
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
  const trimmedBody = body.trim();

  if (
    response.statusCode &&
    response.statusCode >= 400
  ) {
    let errorMessage = trimmedBody;

    try {
      const parsed = JSON.parse(trimmedBody);

      errorMessage =
        parsed.error ||
        parsed.message ||
        trimmedBody;
    } catch {
      // Response was not JSON.
    }

    reject(
      new Error(
        errorMessage ||
          `JDoodle HTTP ${response.statusCode}`
      )
    );

    return;
  }

  // JDoodle may return the token as a raw JWT
  // instead of a JSON object.
  resolve({
    token: trimmedBody,
  });
} catch (error) {
  reject(error);
}
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(
        new Error(
          "JDoodle authentication timed out."
        )
      );
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(payload);
    request.end();
  });
}

export async function POST() {
  try {
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

    const data = await getJDoodleToken(
      clientId,
      clientSecret
    );

    if (!data.token) {
      console.error(
        "JDoodle token response:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "JDoodle did not return an authentication token.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token: data.token,
    });
  } catch (error: any) {
    console.error(
      "JDoodle token error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Unable to create compiler session.",
      },
      { status: 500 }
    );
  }
}