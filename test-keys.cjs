require('dotenv').config();
console.log('Direct test - NVIDIA keys found:', Object.keys(process.env).filter(k => k.startsWith('NVIDIA_API_KEY_')).length);
console.log('First key exists:', !!process.env.NVIDIA_API_KEY_1);
console.log('First key preview:', process.env.NVIDIA_API_KEY_1 ? process.env.NVIDIA_API_KEY_1.substring(0, 10) + '...' : 'none');