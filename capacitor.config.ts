import type { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from 'dotenv';
dotenv.config();

const config: CapacitorConfig = {
  appId: process.env.CAPACITOR_APP_ID || 'com.example.docker',
  appName: 'docker',
  webDir: 'build',
  // so the Android app points to the live server (e.g. 'http://192.168.1.100:6967')
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'http://127.0.0.1:6967',
    cleartext: true
  }
};

export default config;
