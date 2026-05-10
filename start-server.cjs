#!/usr/bin/env node

// Load environment variables explicitly before starting the server
require('dotenv').config();

// Start the actual server
require('./build/server/index.js');