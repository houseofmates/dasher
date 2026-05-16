<script lang="ts">
  import { onMount } from 'svelte';
  import {
    CloudArrowUp,
    CloudArrowDown,
    Folder,
    HardDrives,
    FileArchive,
    CircleNotch,
    Check,
    X,
    CaretDown
  } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';

  let backups = $state<any[]>([]);
  let loading = $state(false);
  let restoring = $state(false);
  let showRestoreDialog = $state(false);
  let selectedBackup = $state<any>(null);
  let restoreVolumes = $state(true);

  onMount(async () => {
    await loadBackups();
  });

  async function loadBackups() {
    loading = true;
    try {
      const res = await fetch('/api/backup');
      if (res.ok) {
        const result = await res.json();
        backups = result.data || [];
      }
    } catch (error) {
      toasts.error('Failed to load backups');
    } finally {
      loading = false;
    }
  }

  async function createBackup() {
    loading = true;
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' })
      });
      
      if (res.ok) {
        const result = await res.json();
        toasts.success(`Backup created: ${result.data.path}`);
        await loadBackups();
      } else {
        const error = await res.json();
        toasts.error(error.error || 'Failed to create backup');
      }
    } catch (error) {
      toasts.error('Network error during backup');
    } finally {
      loading = false;
    }
  }

  async function startRestore(backup: any) {
    selectedBackup = backup;
    showRestoreDialog = true;
  }

  async function confirmRestore() {
    if (!selectedBackup) return;

    restoring = true;
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'restore', 
          backupPath: selectedBackup.path,
          restoreVolumes 
        })
      });
      
      if (res.ok) {
        const result = await res.json();
        toasts.success(`Restored ${result.data.restored.length} items`);
        showRestoreDialog = false;
        selectedBackup = null;
      } else {
        const error = await res.json();
        toasts.error(error.error || 'Failed to restore backup');
      }
    } catch (error) {
      toasts.error('Network error during restore');
    } finally {
      restoring = false;
    }
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }
</script>

<div class="space-y-6 pb-20">
  <div class="flex flex-col gap-1 mobile-stack">
    <h2 class="text-2xl xs:text-3xl font-bold tracking-tight">backup & restore</h2>
    <p class="text-white/40 text-xs xs:text-sm">protect your docker environment with automated backups</p>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
    <button 
      class="card group interactive p-6 xs:p-8"
      onclick={createBackup}
      disabled={loading}
    >
      <div class="flex items-center gap-4">
        <div class="p-3 bg-accent-yellow/10 rounded-xl text-accent-yellow transition-all group-hover:bg-accent-yellow/20 group-hover:scale-110">
          {#if loading}
            <CircleNotch size={24} class="animate-spin" />
          {:else}
            <CloudArrowUp size={24} weight="duotone" />
          {/if}
        </div>
        <div class="text-left">
          <h3 class="text-lg font-bold">create backup</h3>
          <p class="text-sm text-white/60">export compose files and volumes</p>
        </div>
      </div>
    </button>

    <div class="card group interactive p-6 xs:p-8 opacity-50">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-accent-blue/10 rounded-xl text-accent-blue transition-all group-hover:bg-accent-blue/20 group-hover:scale-110">
          <CloudArrowDown size={24} weight="duotone" />
        </div>
        <div class="text-left">
          <h3 class="text-lg font-bold">import backup</h3>
          <p class="text-sm text-white/60">restore from existing backup file</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Backup List -->
  <div class="space-y-4">
    <h3 class="text-base xs:text-lg font-bold">recent backups</h3>
    
    {#if loading && backups.length === 0}
      <div class="card flex items-center justify-center py-12">
        <CircleNotch size={32} class="animate-spin text-white/40" />
      </div>
    {:else if backups.length === 0}
      <div class="card text-center py-12">
        <FileArchive size={48} class="mx-auto text-white/20 mb-4" />
        <p class="text-white/40">No backups found</p>
        <p class="text-sm text-white/20 mt-2">Create your first backup to get started</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each backups as backup}
          <div class="card p-4 xs:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="p-2 bg-white/5 rounded-lg">
                  <FileArchive size={20} class="text-white/60" />
                </div>
                <div>
                  <h4 class="font-bold text-white/80">{backup.name}</h4>
                  <div class="flex items-center gap-4 mt-1">
                    <span class="text-xs text-white/40">{formatDate(backup.created)}</span>
                    <span class="text-xs text-white/40">{formatBytes(backup.size)}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  class="btn-secondary py-2 px-4 text-xs"
                  onclick={() => startRestore(backup)}
                >
                  restore
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Restore Confirmation Dialog -->
{#if showRestoreDialog && selectedBackup}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onclick={() => showRestoreDialog = false}>
    <div class="card max-w-md w-full p-6" onclick={(e) => e.stopPropagation()}>
      <h3 class="text-lg font-bold mb-4">restore backup</h3>
      
      <div class="space-y-4 mb-6">
        <div class="bg-black/30 rounded-lg p-3">
          <p class="font-mono text-sm text-white/80">{selectedBackup.name}</p>
          <p class="text-xs text-white/40 mt-1">{formatDate(selectedBackup.created)}</p>
        </div>

        <label class="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            bind:checked={restoreVolumes} 
            class="w-4 h-4 rounded border-white/20 bg-white/10"
          />
          <span class="text-sm">restore volumes (may overwrite existing data)</span>
        </label>

        <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p class="text-xs text-yellow-400">
            ⚠️ This will restore compose files and optionally volumes. Make sure you understand what will be restored before proceeding.
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <button 
          class="btn-secondary flex-1"
          onclick={() => showRestoreDialog = false}
          disabled={restoring}
        >
          cancel
        </button>
        <button 
          class="btn-primary flex-1 flex items-center justify-center gap-2"
          onclick={confirmRestore}
          disabled={restoring}
        >
          {#if restoring}
            <CircleNotch size={16} class="animate-spin" />
            restoring...
          {:else}
            <Check size={16} />
            restore
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}