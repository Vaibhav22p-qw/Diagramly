# Diagramly compiler service

This service is the only process allowed to invoke system compilers. It is intended to be private: Diagramly's Next.js routes call it using `COMPILER_SERVICE_URL` and `COMPILER_SERVICE_TOKEN`; browsers never receive either value.

## Run locally

```bash
cd compiler-service
npm start
```

Then run Diagramly with `COMPILER_SERVICE_URL=http://127.0.0.1:8787`.

## Docker

```bash
docker build -t diagramly-compiler ./compiler-service
docker run --rm -p 8787:8787 \
  -e COMPILER_SERVICE_TOKEN=replace-with-a-long-random-secret \
  --read-only --tmpfs /tmp/diagramly:rw,noexec,nosuid,size=128m \
  --cap-drop=ALL --security-opt no-new-privileges \
  --memory=512m --cpus=1 --pids-limit=128 \
  diagramly-compiler
```

For production, place it behind an internal/private network or a service-to-service gateway and set a long random `COMPILER_SERVICE_TOKEN`. The Docker runtime flags above are a recommended baseline; use the equivalent restrictions supplied by your container platform.
