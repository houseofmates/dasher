import { discoverStacks } from './src/lib/server/compose.ts';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log('Discovering stacks...');
  const stacks = await discoverStacks();
  console.log('Stacks found:', JSON.stringify(stacks, null, 2));
}

test();
