#!/bin/bash
# Script to restart dasher service with updated code
sudo systemctl stop dasher
sleep 2
sudo systemctl start dasher
echo "Dasher service restarted. Check if changes are visible at dsh.houseofmates.space"