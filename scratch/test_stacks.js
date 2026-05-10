import { discoverStacks } from './src/lib/server/compose.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  console.log('MAIN_STACK_PATH:', process.env.MAIN_STACK_PATH);
  const stacks = await discoverStacks();
  console.log('Stacks found:', JSON.stringify(stacks, null, 2));
}

test();
