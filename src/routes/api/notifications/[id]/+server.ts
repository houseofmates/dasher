import { json } from '@sveltejs/kit';
import { getUnreadNotifications, getAllNotifications, markNotificationRead, markAllNotificationsRead, clearOldNotifications } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const unreadOnly = url.searchParams.get('unread') === 'true';
  
  try {
    const notifications = unreadOnly ? getUnreadNotifications() : getAllNotifications();
    return json({ success: true, data: notifications });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, params }) => {
  const { id } = params;
  
  try {
    if (id === 'read-all') {
      markAllNotificationsRead();
      return json({ success: true });
    } else if (id === 'clear') {
      clearOldNotifications(0); // Clear all
      return json({ success: true });
    } else {
      markNotificationRead(parseInt(id));
      return json({ success: true });
    }
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};