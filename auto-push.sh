#!/bin/bash
set -e

REPO_DIR="/home/house/docker"
cd "$REPO_DIR" || exit 1

# Function to check if there are uncommitted changes
has_changes() {
    ! git diff-index --quiet HEAD --
}

# Main loop
while true; do
    if has_changes; then
        # Changes detected, wait 10 seconds to let them settle
        sleep 10
        # Check again after waiting
        if has_changes; then
            # Stage all changes
            git add .
            # Commit with a timestamp
            git commit -m "Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"
            # Push to origin master
            git push origin master
        fi
    fi
    # Sleep a bit before checking again
    sleep 5
done
