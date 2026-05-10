#!/bin/bash

# Auto-push service uninstallation script

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

SERVICE_NAME="auto-push"
SERVICE_FILE="${SERVICE_NAME}.service"
SYSTEMD_SERVICE_PATH="/etc/systemd/system/${SERVICE_FILE}"

print_status "Uninstalling auto-push service..."

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root for security reasons."
    print_error "Please run as a regular user with sudo privileges."
    exit 1
fi

# Stop the service if it's running
if sudo systemctl is-active --quiet "${SERVICE_NAME}" 2>/dev/null; then
    print_status "Stopping auto-push service..."
    sudo systemctl stop "${SERVICE_NAME}"
fi

# Disable the service
if sudo systemctl is-enabled --quiet "${SERVICE_NAME}" 2>/dev/null; then
    print_status "Disabling auto-push service..."
    sudo systemctl disable "${SERVICE_NAME}"
fi

# Remove the systemd service file
if [ -f "${SYSTEMD_SERVICE_PATH}" ]; then
    print_status "Removing systemd service file..."
    sudo rm "${SYSTEMD_SERVICE_PATH}"
fi

# Reload systemd
print_status "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Remove service files (optional)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
read -p "Do you want to remove the service files from ${SCRIPT_DIR}? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing service files..."
    rm -f "${SCRIPT_DIR}/auto-push-service.js"
    rm -f "${SCRIPT_DIR}/auto-push-config.json"
    rm -f "${SCRIPT_DIR}/auto-push.log"
    rm -f "${SCRIPT_DIR}/install-auto-push.sh"
    rm -f "${SCRIPT_DIR}/uninstall-auto-push.sh"
    print_status "Service files removed."
fi

print_status "✅ Auto-push service has been uninstalled successfully!"
echo ""
print_status "The service has been stopped, disabled, and removed from systemd."
print_warning "Any commits pushed by the service will remain in your Git repository."