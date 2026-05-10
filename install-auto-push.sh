#!/bin/bash

# Auto-push service installation script
# This script installs the auto-push service as a systemd service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root for security reasons."
    print_error "Please run as a regular user with sudo privileges."
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_NAME="auto-push"
SERVICE_FILE="${SERVICE_NAME}.service"
SYSTEMD_SERVICE_PATH="/etc/systemd/system/${SERVICE_FILE}"

print_status "Installing auto-push service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js found: $(node --version)"

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_status "Git found: $(git --version)"

# Make the service script executable
chmod +x "${SCRIPT_DIR}/auto-push-service.js"

# Copy systemd service file
print_status "Installing systemd service..."
sudo cp "${SCRIPT_DIR}/${SERVICE_FILE}" "${SYSTEMD_SERVICE_PATH}"

# Update service file with correct paths
sudo sed -i "s|/home/house/docker|${SCRIPT_DIR}|g" "${SYSTEMD_SERVICE_PATH}"
sudo sed -i "s|User=house|User=${USER}|g" "${SYSTEMD_SERVICE_PATH}"
sudo sed -i "s|Group=house|Group=${USER}|g" "${SYSTEMD_SERVICE_PATH}"
sudo sed -i "s|ReadWritePaths=/home/house/docker|ReadWritePaths=${SCRIPT_DIR} ${HOME}/.gitconfig|g" "${SYSTEMD_SERVICE_PATH}"

# Update config file with correct paths
CONFIG_FILE="${SCRIPT_DIR}/auto-push-config.json"
if [ -f "$CONFIG_FILE" ]; then
    print_status "Updating configuration file..."
    sed -i "s|/home/house/docker|${SCRIPT_DIR}|g" "$CONFIG_FILE"
    sed -i "s|/home/house/docker/auto-push.log|${SCRIPT_DIR}/auto-push.log|g" "$CONFIG_FILE"
fi

# Reload systemd
print_status "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable and start the service
print_status "Enabling auto-push service..."
sudo systemctl enable "${SERVICE_NAME}"

print_status "Starting auto-push service..."
sudo systemctl start "${SERVICE_NAME}"

# Check service status
sleep 2
if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
    print_status "✅ Auto-push service is running successfully!"
else
    print_error "❌ Auto-push service failed to start. Check logs with: journalctl -u ${SERVICE_NAME}"
    exit 1
fi

# Show service status
echo ""
print_status "Service status:"
sudo systemctl status "${SERVICE_NAME}" --no-pager

echo ""
print_status "Installation completed successfully!"
echo ""
print_status "Useful commands:"
echo "  - Check status: sudo systemctl status ${SERVICE_NAME}"
echo "  - View logs: sudo journalctl -u ${SERVICE_NAME} -f"
echo "  - Stop service: sudo systemctl stop ${SERVICE_NAME}"
echo "  - Restart service: sudo systemctl restart ${SERVICE_NAME}"
echo "  - Disable service: sudo systemctl disable ${SERVICE_NAME}"
echo ""
print_status "Configuration file: ${CONFIG_FILE}"
print_status "Log file: ${SCRIPT_DIR}/auto-push.log"
echo ""
print_warning "Make sure your Git repository has a remote 'origin' configured for pushing to work."
print_warning "You can configure it with: git remote add origin <your-github-repo-url>"