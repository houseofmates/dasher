<div align="center">
# docker

Hermes Agent Docker configuration and entrypoint scripts.
</div>

## Overview

This repository contains the Dockerfile (if applicable), entrypoint.sh, and supporting configuration for running Hermes Agent in a containerized environment. The setup is designed to be generic and portable across Linux-based systems, using environment variables for configuration to avoid hardcoding personal or setup-specific values.

## Usage

1. Copy the `.env.example` to `.env` and fill in the required values.
2. Build the Docker image (if a Dockerfile is provided) or use the entrypoint script directly with your container runtime.
3. The container expects a volume mounted at /opt/data for persistent Hermes data (config, skills, memories, etc.).

## Environment Variables

Refer to `.env.example` for a list of supported environment variables and their descriptions.

## Entrypoint

The `entrypoint.sh` script handles:

- Privilege dropping via `gosu` when running as root.
- UID/GID mapping for the hermes user to match host ownership.
- Ownership fixing for the data volume.
- Creation of essential directory structure.
- Copying example configuration files if they do not exist.
- Starting the Hermes dashboard as a background side-process (if enabled).
- Executing the final command (either `hermes` or a direct executable).

## Development

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Ensure the entrypoint script remains generic and does not contain hardcoded paths or values specific to your setup.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
