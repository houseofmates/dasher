#!/bin/bash

# Dasher Setup Script
# Zero-maintenance Portainer Alternative Installer

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/dasher"
SERVICE_NAME="dasher"
REPO_DIR="$(pwd)"
NODE_VERSION="20"

# Helper functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! systemctl is-active --quiet docker; then
        error "Docker daemon is not running. Please start Docker first."
    fi
    
    # Check if Node.js is installed or install it
    if ! command -v node &> /dev/null; then
        log "Node.js not found. Installing Node.js ${NODE_VERSION}..."
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
        apt-get install -y nodejs
    fi
    
    # Verify Node.js version
    NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VER -lt 18 ]]; then
        error "Node.js version 18 or higher is required. Current version: $(node --version)"
    fi
    
    success "System requirements check passed"
}

# Install application files
install_app() {
    log "Installing Dasher to ${INSTALL_DIR}..."
    
    # Create installation directory
    mkdir -p "${INSTALL_DIR}"
    cd "${INSTALL_DIR}"
    
    # Copy application files
    log "Copying application files..."
    cp -r "${REPO_DIR}"/src "${INSTALL_DIR}/"
    cp "${REPO_DIR}"/package*.json "${INSTALL_DIR}/"
    cp "${REPO_DIR}"/server.js "${INSTALL_DIR}/"
    cp "${REPO_DIR}"/svelte.config.js "${INSTALL_DIR}/"
    cp "${REPO_DIR}"/tsconfig.json "${INSTALL_DIR}/"
    cp "${REPO_DIR}"/vite.config.ts "${INSTALL_DIR}/" 2>/dev/null || true
    cp "${REPO_DIR}"/reset-admin.js "${INSTALL_DIR}/"
    
    # Create data directory
    mkdir -p "${INSTALL_DIR}/data"
    mkdir -p "${INSTALL_DIR}/logs"
    
    # Set permissions
    chown -R root:root "${INSTALL_DIR}"
    chmod +x "${INSTALL_DIR}/reset-admin.js"
    
    success "Application files installed"
}

# Install Node.js dependencies
install_dependencies() {
    log "Installing Node.js dependencies..."
    cd "${INSTALL_DIR}"
    
    # Install production dependencies
    npm ci --only=production --omit=dev
    
    # Build the application
    log "Building SvelteKit application..."
    npm run build
    
    success "Dependencies installed and application built"
}

# Setup systemd service
setup_service() {
    log "Setting up systemd service..."
    
    # Copy service file
    cp "${REPO_DIR}/dasher.service" "/etc/systemd/system/"
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable service
    systemctl enable "${SERVICE_NAME}"
    
    success "Systemd service configured"
}

# Configure firewall (if active)
configure_firewall() {
    if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
        log "Configuring firewall..."
        ufw allow 6967/tcp comment "Dasher Dashboard"
        success "Firewall configured"
    fi
    
    if command -v firewall-cmd &> /dev/null && systemctl is-active --quiet firewalld; then
        log "Configuring firewalld..."
        firewall-cmd --permanent --add-port=6967/tcp
        firewall-cmd --reload
        success "Firewall configured"
    fi
}

# Start the service
start_service() {
    log "Starting Dasher service..."
    
    systemctl start "${SERVICE_NAME}"
    
    # Wait for service to start
    sleep 5
    
    # Check service status
    if systemctl is-active --quiet "${SERVICE_NAME}"; then
        success "Dasher service started successfully"
    else
        error "Failed to start Dasher service. Check logs: journalctl -u ${SERVICE_NAME}"
    fi
}

# Display installation summary
show_summary() {
    echo ""
    echo "🎉 Installation completed successfully!"
    echo ""
    echo "📋 Summary:"
    echo "   • Installation directory: ${INSTALL_DIR}"
    echo "   • Service name: ${SERVICE_NAME}"
    echo "   • Web interface: http://localhost:6967"
    echo "   • Data directory: ${INSTALL_DIR}/data"
    echo ""
    echo "🔧 Management commands:"
    echo "   • Start service:   sudo systemctl start ${SERVICE_NAME}"
    echo "   • Stop service:    sudo systemctl stop ${SERVICE_NAME}"
    echo "   • Restart service: sudo systemctl restart ${SERVICE_NAME}"
    echo "   • Check status:    sudo systemctl status ${SERVICE_NAME}"
    echo "   • View logs:       sudo journalctl -u ${SERVICE_NAME} -f"
    echo ""
    echo "🔒 Reset admin access:"
    echo "   sudo ${INSTALL_DIR}/reset-admin.js --reset-admin"
    echo ""
    echo "⚠️  Important:"
    echo "   • The service will auto-start on boot"
    echo "   • It will automatically restart if it crashes"
    echo "   • All data is stored in ${INSTALL_DIR}/data"
    echo "   • Backup this directory regularly"
    echo ""
}

# Main installation flow
main() {
    log "Starting Dasher installation..."
    
    check_root
    check_requirements
    install_app
    install_dependencies
    setup_service
    configure_firewall
    start_service
    show_summary
    
    success "Installation completed! 🚀"
}

# Handle script interruption
trap 'error "Installation interrupted"' INT TERM

# Run main function
main "$@"