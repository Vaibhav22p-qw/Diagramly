FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential openjdk-17-jdk-headless python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
COPY server.js ./

RUN useradd --system --create-home --uid 10001 compiler \
    && mkdir -p /tmp/diagramly \
    && chown compiler:compiler /tmp/diagramly

USER compiler
ENV NODE_ENV=production TMPDIR=/tmp/diagramly
EXPOSE 8787
CMD ["npm", "start"]
