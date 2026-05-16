import { json } from '@sveltejs/kit';
import { clearOldNotifications } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  try {
    // Clear all notifications by setting days to 0
    clearOldNotifications(0);
    return json({ success: true });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};