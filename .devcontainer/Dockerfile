FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Cursor installs its remote server with wget; the base image does not include it.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        wget \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces
