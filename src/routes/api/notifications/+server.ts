import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { action } = body;
  
  try {
    if (action === 'read-all') {
      const { markAllNotificationsRead } = await import('$lib/server/db');
      markAllNotificationsRead();
      return json({ success: true });
    } else if (action === 'clear') {
      const { clearOldNotifications } = await import('$lib/server/db');
      clearOldNotifications(0); // Clear all
      return json({ success: true });
    }
    
    return json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};