let notificationPermission = 'default';
// Request notification permission on startup
export async function requestNotificationPermission() {
    if (typeof window === 'undefined')
        return false;
    if ('Notification' in window) {
        notificationPermission = await Notification.requestPermission();
        return notificationPermission === 'granted';
    }
    return false;
}
// Show browser notification
export function showBrowserNotification(title, body, icon, onClick) {
    if (typeof window === 'undefined')
        return;
    if ('Notification' in window && notificationPermission === 'granted') {
        const notification = new Notification(title, {
            body,
            icon: icon || '/favicon.png',
            badge: '/favicon.png',
            tag: 'dasher',
            requireInteraction: false,
            silent: false
        });
        if (onClick) {
            notification.onclick = onClick;
        }
        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }
}
// Check if we should show browser notification for this type
export function shouldShowBrowserNotification(type, message) {
    // Don't show browser notifications for every type
    const importantTypes = ['error', 'warning'];
    const criticalKeywords = ['stopped unexpectedly', 'high cpu', 'high ram', 'connection lost'];
    return importantTypes.includes(type) ||
        criticalKeywords.some(keyword => message.toLowerCase().includes(keyword));
}
// Real-time notification polling
let notificationPollInterval = null;
let lastNotificationCount = 0;
export function startNotificationPolling(callback, intervalMs = 30000) {
    if (notificationPollInterval) {
        clearInterval(notificationPollInterval);
    }
    notificationPollInterval = setInterval(async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const result = await res.json();
                const notifications = result.data || [];
                // Check for new notifications
                if (notifications.length > lastNotificationCount) {
                    const newNotifications = notifications.slice(lastNotificationCount);
                    newNotifications.forEach((notif) => {
                        if (shouldShowBrowserNotification(notif.type, notif.message)) {
                            showBrowserNotification(`Dasher Dashboard - ${notif.type.toUpperCase()}`, notif.message, undefined, () => {
                                // Focus window and navigate to notifications
                                window.focus();
                                window.location.href = '/notifications';
                            });
                        }
                    });
                }
                lastNotificationCount = notifications.length;
                callback(notifications);
            }
        }
        catch (error) {
            console.error('Failed to poll notifications:', error);
        }
    }, intervalMs);
}
export function stopNotificationPolling() {
    if (notificationPollInterval) {
        clearInterval(notificationPollInterval);
        notificationPollInterval = null;
    }
}
export function getNotificationSettings() {
    const stored = localStorage.getItem('notification-settings');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        browserNotifications: true,
        soundEnabled: true,
        alertThresholds: {
            cpu: 90,
            ram: 90
        },
        eventTypes: {
            containerStop: true,
            resourceAlert: true,
            dockerHealth: true,
            vulnerabilityScan: false
        }
    };
}
export function saveNotificationSettings(settings) {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
}
// Play notification sound
export function playNotificationSound() {
    if (typeof window === 'undefined')
        return;
    const settings = getNotificationSettings();
    if (!settings.soundEnabled)
        return;
    try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Ignore autoplay errors
        });
    }
    catch (error) {
        // Ignore audio errors
    }
}
