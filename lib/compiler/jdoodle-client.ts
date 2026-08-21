"use client";

import SockJS from "sockjs-client";
import webstomp from "webstomp-client";

type JDoodleClient = {
  client: any;
  disconnect: () => void;
  sendInput: (input: string) => void;
};

export async function startJDoodleSession({
  code,
  language,
  versionIndex,
  onOutput,
  onError,
  onStarted,
  onClosed,
}: {
  code: string;
  language: string;
  versionIndex: number;
  onOutput: (text: string) => void;
  onError: (message: string) => void;
  onStarted?: () => void;
  onClosed?: () => void;
}): Promise<JDoodleClient> {
  const tokenResponse = await fetch(
    "/api/compiler/token",
    {
      method: "POST",
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.token) {
    throw new Error(
      tokenData.message ||
        "Unable to create compiler session."
    );
  }

 const socket = new SockJS(
  "https://api.jdoodle.com/v1/stomp"
);

socket.onopen = () => {
  console.log(
    "JDoodle SockJS connection opened"
  );
};

socket.onerror = (error) => {
  console.error(
    "JDoodle SockJS error:",
    error
  );
};

socket.onclose = (event) => {
  console.log(
    "JDoodle SockJS closed:",
    event.code,
    event.reason
  );
};

const client = webstomp.over(socket, {
  heartbeat: false,
  debug: true,
});


  let connected = false;

  await new Promise<void>((resolve, reject) => {
    client.connect(
      {},
      () => {
        connected = true;

        client.subscribe(
          "/user/queue/execute-i",
          (message: any) => {
            const statusCode = parseInt(
              message.headers?.statusCode || "200",
              10
            );

            if (statusCode === 201) {
              onStarted?.();
              return;
            }

            if (
              statusCode === 400 ||
              statusCode === 401 ||
              statusCode === 429 ||
              statusCode === 500 ||
              statusCode === 410
            ) {
              onError(
                message.body ||
                  "Compiler session failed."
              );
              return;
            }

            if (message.body) {
              onOutput(message.body);
            }
          }
        );

        resolve();
      },
     (error: any) => {
  console.error(
    "JDoodle WebSocket connection failed:",
    error
  );

  let message = "Unable to connect to compiler session.";

  if (typeof error === "string") {
    message = error;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.body) {
    message = error.body;
  }

  reject(new Error(message));
}
    );
  });

  const data = JSON.stringify({
    script: code,
    language,
    versionIndex,
  });

  client.send(
    "/app/execute-ws-api-token",
    data,
    {
      message_type: "execute",
      token: tokenData.token,
    }
  );

  return {
    client,

    disconnect: () => {
      if (connected) {
        client.disconnect(() => {
          onClosed?.();
        });
      }
    },

    sendInput: (input: string) => {
      if (!connected) return;

      client.send(
        "/app/execute-ws-api-token",
        input,
        {
          message_type: "input",
        }
      );
    },
  };
}