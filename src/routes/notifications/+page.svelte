<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Bell, 
    Check, 
    X, 
    Trash,
    CircleNotch,
    CheckCircle
  } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';

  let notifications = $state<any[]>([]);
  let loading = $state(false);
  let filter = $state<'all' | 'unread'>('all');

  onMount(async () => {
    await loadNotifications();
  });

  async function loadNotifications() {
    loading = true;
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const result = await res.json();
        notifications = result.data || [];
      }
    } catch (error) {
      toasts.error('Failed to load notifications');
    } finally {
      loading = false;
    }
  }

  async function markAsRead(id: number) {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) {
        notifications = notifications.map(n => 
          n.id === id ? { ...n, read: 1 } : n
        );
      }
    } catch (error) {
      toasts.error('Failed to mark as read');
    }
  }

  async function markAllAsRead() {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' });
      if (res.ok) {
        notifications = notifications.map(n => ({ ...n, read: 1 }));
        toasts.success('All notifications marked as read');
      }
    } catch (error) {
      toasts.error('Failed to mark all as read');
    }
  }

  async function clearNotifications() {
    if (!confirm('Are you sure you want to clear all notifications?')) return;
    
    try {
      const res = await fetch('/api/notifications/clear', { method: 'POST' });
      if (res.ok) {
        notifications = [];
        toasts.success('All notifications cleared');
      }
    } catch (error) {
      toasts.error('Failed to clear notifications');
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  }

  function formatTime(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  let filteredNotifications = $derived(filter === 'all'
    ? notifications
    : notifications.filter(n => n.read === 0));

  let unreadCount = $derived(notifications.filter(n => n.read === 0).length);
</script>

<div class="space-y-6 pb-20">
  <div class="flex flex-col gap-1 mobile-stack">
    <h2 class="text-2xl xs:text-3xl font-bold tracking-tight">notifications</h2>
    <p class="text-white/40 text-xs xs:text-sm">system alerts and container events</p>
  </div>

  <!-- Filters and Actions -->
  <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div class="flex gap-2">
      <button 
        class="px-4 py-2 rounded-lg text-sm transition-all {
          filter === 'all' 
            ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' 
            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
        }"
        onclick={() => filter = 'all'}
      >
        all ({notifications.length})
      </button>
      <button 
        class="px-4 py-2 rounded-lg text-sm transition-all {
          filter === 'unread' 
            ? 'bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30' 
            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
        }"
        onclick={() => filter = 'unread'}
      >
        unread ({unreadCount})
      </button>
    </div>

    <div class="flex gap-2">
      {#if unreadCount > 0}
        <button 
          class="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
          onclick={markAllAsRead}
        >
          <CheckCircle size={14} />
          mark all read
        </button>
      {/if}
      <button 
        class="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/20 rounded-lg py-2 px-4 text-xs flex items-center gap-2 transition-all"
        onclick={clearNotifications}
      >
        <Trash size={14} />
        clear all
      </button>
    </div>
  </div>

  <!-- Notifications List -->
  {#if loading && notifications.length === 0}
    <div class="card flex items-center justify-center py-12">
      <CircleNotch size={32} class="animate-spin text-white/40" />
    </div>
  {:else if filteredNotifications.length === 0}
    <div class="card text-center py-12">
      <Bell size={48} class="mx-auto text-white/20 mb-4" />
      <p class="text-white/40">
        {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
      </p>
      <p class="text-sm text-white/20 mt-2">
        {filter === 'unread' ? 'All caught up!' : 'Notifications will appear here'}
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each filteredNotifications as notification}
        <div 
          class="card p-4 xs:p-6 transition-all hover:bg-white/5 {
            notification.read === 0 ? 'border-l-4 border-accent-yellow' : ''
          }"
        >
          <div class="flex items-start gap-4">
            <div class="mt-1">
              <div class="w-3 h-3 rounded-full {getNotificationIcon(notification.type)}"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="text-white/80 {notification.read === 0 ? 'font-semibold' : ''}">
                    {notification.message}
                  </p>
                  {#if notification.container_id}
                    <p class="text-xs text-white/40 font-mono mt-1">
                      container: {notification.container_id.substring(0, 12)}
                    </p>
                  {/if}
                  <p class="text-xs text-white/40 mt-2">
                    {formatTime(notification.created_at)}
                  </p>
                </div>
                
                <div class="flex items-center gap-2">
                  {#if notification.read === 0}
                    <button 
                      class="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      onclick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={16} class="text-white/60" />
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>