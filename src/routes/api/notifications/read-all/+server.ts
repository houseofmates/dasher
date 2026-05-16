import { json } from '@sveltejs/kit';
import { markAllNotificationsRead } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  try {
    markAllNotificationsRead();
    return json({ success: true });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};