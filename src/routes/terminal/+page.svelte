<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Terminal } from '@xterm/xterm';
  import { FitAddon } from '@xterm/addon-fit';
  import '@xterm/xterm/css/xterm.css';
  import { TerminalWindow, CaretLeft, CaretDown, Broadcast, Stop, Plus } from 'phosphor-svelte';
  import { fade, scale } from 'svelte/transition';
  import { toasts } from '$lib/toast';
  import ContextMenu from '$lib/components/ContextMenu.svelte';
  import ContextMenuItem from '$lib/components/ContextMenuItem.svelte';

  let { data } = $props();

  // ─── tab state ──────────────────────────────────────────────
  interface Tab {
    id: string;
    label: string;
    term: Terminal | null;
    fitAddon: FitAddon | null;
    socket: WebSocket | null;
    isConnected: boolean;
    selectedContainerId: string;
    element: HTMLDivElement | null;
  }

  let tabs = $state<Tab[]>([]);
  let activeTabId = $state<string>('');
  let tabCounter = 0;
  let selectIsOpen = $state(false);

  function createTab(label = '') {
    const id = `tab-${++tabCounter}`;
    const tab: Tab = {
      id,
      label: label || `terminal ${tabCounter}`,
      term: null,
      fitAddon: null,
      socket: null,
      isConnected: false,
      selectedContainerId: '',
      element: null
    };
    tabs = [...tabs, tab];
    activeTabId = id;
    return id;
  }

  function closeTab(id: string) {
    const tab = tabs.find(t => t.id === id);
    if (tab) {
      tab.socket?.close();
      tab.term?.dispose();
    }
    const idx = tabs.findIndex(t => t.id === id);
    tabs = tabs.filter(t => t.id !== id);
    if (activeTabId === id) {
      const next = tabs[Math.min(idx, tabs.length - 1)];
      activeTabId = next?.id ?? '';
      if (!next) createTab();
    }
  }

  function renameTab(id: string) {
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    const name = prompt('rename tab:', tab.label);
    if (name && name.trim()) {
      tabs = tabs.map(t => t.id === id ? { ...t, label: name.trim() } : t);
    }
  }

  const activeTab = $derived(tabs.find(t => t.id === activeTabId) ?? null);

  // ─── terminal init ───────────────────────────────────────────
  function initTerminalForTab(tab: Tab) {
    if (tab.term) return;
    tab.term = new Terminal({
      cursorBlink: true,
      theme: {
        background: 'transparent',
        foreground: '#d8ba75',
        cursor: '#f6b012',
        selectionBackground: 'rgba(246, 176, 18, 0.3)',
        black: '#1a1a1a',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
      },
      fontFamily: "'JetBrains Mono', 'Droid Sans Mono', monospace",
      fontSize: 14,
      lineHeight: 1.2,
      allowProposedApi: true
    });
    tab.fitAddon = new FitAddon();
    tab.term.loadAddon(tab.fitAddon);
    if (tab.element) {
      tab.term.open(tab.element);
      setTimeout(() => tab.fitAddon?.fit(), 100);
    }
    tab.term.onData(d => {
      if (tab.socket?.readyState === WebSocket.OPEN) tab.socket.send(d);
    });
    const ro = new ResizeObserver(() => tab.fitAddon?.fit());
    if (tab.element) ro.observe(tab.element);
  }

  function connect(tab: Tab) {
    if (!tab.selectedContainerId) return;
    tab.socket?.close();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    tab.socket = new WebSocket(`${protocol}//${window.location.host}/terminal?id=${tab.selectedContainerId}`);
    tab.socket.onopen = () => {
      tab.isConnected = true;
      tabs = [...tabs]; // trigger reactivity
      tab.term?.reset();
      tab.term?.focus();
      toasts.success('terminal connected');
    };
    tab.socket.onmessage = (e) => tab.term?.write(e.data);
    tab.socket.onerror = () => toasts.error('websocket error');
    tab.socket.onclose = () => {
      tab.isConnected = false;
      tabs = [...tabs];
      tab.term?.write('\r\n\x1b[31m[session closed]\x1b[0m\r\n');
    };
  }

  function disconnect(tab: Tab) {
    tab.socket?.close();
    tab.selectedContainerId = '';
    tabs = [...tabs];
  }

  // bind terminal element to tab when it mounts
  function bindElement(node: HTMLDivElement, tabId: string) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      tab.element = node;
      initTerminalForTab(tab);
    }
    return {
      destroy() {
        const t = tabs.find(t => t.id === tabId);
        if (t) t.element = null;
      }
    };
  }

  // ─── tab drag-to-reorder ─────────────────────────────────────
  let dragSrcId = $state<string | null>(null);

  function onDragStart(e: DragEvent, id: string) {
    dragSrcId = id;
    e.dataTransfer!.effectAllowed = 'move';
  }

  function onDragOver(e: DragEvent, id: string) {
    e.preventDefault();
    if (dragSrcId === id) return;
    const srcIdx = tabs.findIndex(t => t.id === dragSrcId);
    const dstIdx = tabs.findIndex(t => t.id === id);
    if (srcIdx < 0 || dstIdx < 0) return;
    const next = [...tabs];
    const [moved] = next.splice(srcIdx, 1);
    next.splice(dstIdx, 0, moved);
    tabs = next;
  }

  function onDragEnd() { dragSrcId = null; }

  // ─── context menus ───────────────────────────────────────────
  let tabMenu = $state({ show: false, x: 0, y: 0, tabId: '' });
  let barMenu = $state({ show: false, x: 0, y: 0 });

  function onTabContextMenu(e: MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    barMenu.show = false;
    tabMenu = { show: true, x: e.clientX, y: e.clientY, tabId: id };
  }

  function onBarContextMenu(e: MouseEvent) {
    e.preventDefault();
    tabMenu.show = false;
    barMenu = { show: true, x: e.clientX, y: e.clientY };
  }

  onMount(() => createTab());

  onDestroy(() => {
    tabs.forEach(t => { t.socket?.close(); t.term?.dispose(); });
  });
</script>

<div class="flex flex-col gap-8" in:fade>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <h1 class="text-4xl font-black tracking-tighter lowercase flex items-center gap-3">
        <TerminalWindow class="text-accent-yellow" size={40} weight="fill" />
        terminal
      </h1>
      <p class="text-white/40 font-medium lowercase mt-1">direct container access</p>
    </div>

    {#if activeTab}
      <div class="flex items-center gap-3">
        <div class="relative">
          <select 
            class="select-container bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-yellow transition-all appearance-none pr-10 min-w-[200px] preserve-case"
            bind:value={activeTab.selectedContainerId}
            onchange={() => connect(activeTab!)}
            onfocus={() => selectIsOpen = true}
            onblur={() => selectIsOpen = false}
            disabled={activeTab.isConnected}
          >
            <option value="" disabled>select container</option>
            {#each data.containers as container}
              <option value={container.id}>{container.name}</option>
            {/each}
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" class:text-accent-yellow={selectIsOpen} class:text-white={!selectIsOpen}>
            {#if selectIsOpen}
              <CaretDown size={16} weight="bold" />
            {:else}
              <CaretLeft size={16} weight="bold" />
            {/if}
          </div>
        </div>

        {#if activeTab.isConnected}
          <button
            onclick={() => disconnect(activeTab!)}
            transition:scale
            class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2 lowercase"
          >
            <Stop size={18} weight="fill" />
            stop
          </button>
        {/if}
      </div>
    {/if}
  </div>

  <div class="card p-1 min-h-[600px] h-[calc(100dvh-320px)] flex flex-col overflow-hidden group">
    <!-- tab bar -->
    <div
      class="flex items-stretch gap-0 border-b border-white/5 bg-black/20 overflow-x-auto min-h-[38px] select-none"
      role="tablist"
      tabindex="0"
      oncontextmenu={onBarContextMenu}
    >
      {#each tabs as tab (tab.id)}
        <button
          class="tab-pill flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-r border-white/5 cursor-pointer relative group/tab"
          class:active={tab.id === activeTabId}
          class:dragging={dragSrcId === tab.id}
          onclick={() => activeTabId = tab.id}
          oncontextmenu={(e) => onTabContextMenu(e, tab.id)}
          draggable={true}
          ondragstart={(e) => onDragStart(e, tab.id)}
          ondragover={(e) => onDragOver(e, tab.id)}
          ondragend={onDragEnd}
          role="tab"
          aria-selected={tab.id === activeTabId}
        >
          {#if tab.isConnected}
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          {:else}
            <span class="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0"></span>
          {/if}
          <span class="preserve-case">{tab.label}</span>
        </button>
      {/each}

      <!-- add tab button -->
      <button
        class="flex items-center justify-center px-3 py-2 text-white/20 hover:text-white/60 transition-colors shrink-0"
        onclick={() => createTab()}
        title="new tab"
      >
        <Plus size={14} weight="bold" />
      </button>

      <!-- spacer to catch right-click on empty area -->
      <div class="flex-1" oncontextmenu={onBarContextMenu} role="presentation"></div>
    </div>

    <!-- terminal panes (one per tab, hidden when not active) -->
    <div class="flex-1 overflow-hidden relative bg-black/40">
      {#each tabs as tab (tab.id)}
        <div
          class="absolute inset-0 p-4"
          class:hidden={tab.id !== activeTabId}
          use:bindElement={tab.id}
        >
        </div>
        {#if !tab.isConnected && !tab.selectedContainerId && tab.id === activeTabId}
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/10 pointer-events-none" transition:fade>
            <Broadcast size={64} weight="thin" />
            <p class="text-lg font-medium lowercase">select a container to start</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<!-- tab context menu -->
<ContextMenu show={tabMenu.show} x={tabMenu.x} y={tabMenu.y} onClose={() => tabMenu.show = false}>
  {#if tabMenu.tabId}
    <div class="px-4 py-2 border-b border-white/5 mb-1">
      <p class="text-[10px] font-bold text-white/20 uppercase tracking-widest">{tabs.find(t => t.id === tabMenu.tabId)?.label}</p>
    </div>
    <ContextMenuItem label="rename" icon={TerminalWindow} onclick={() => { renameTab(tabMenu.tabId); tabMenu.show = false; }} />
    <div class="border-t border-white/5 mt-1 pt-1">
      <ContextMenuItem label="close tab" icon={Stop} variant="danger" onclick={() => { closeTab(tabMenu.tabId); tabMenu.show = false; }} />
    </div>
  {/if}
</ContextMenu>

<!-- bar context menu (right-click empty area) -->
<ContextMenu show={barMenu.show} x={barMenu.x} y={barMenu.y} onClose={() => barMenu.show = false}>
  <ContextMenuItem label="new tab" icon={Plus} onclick={() => { createTab(); barMenu.show = false; }} />
</ContextMenu>

<style>
  :global(.xterm) { padding: 0; }
  :global(.xterm-viewport) { background-color: transparent !important; }
  :global(.xterm-screen) { background-color: transparent !important; }

  .tab-pill {
    color: rgba(255,255,255,0.3);
    background: transparent;
    border-bottom: 2px solid transparent;
  }
  .tab-pill:hover {
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.03);
  }
  .tab-pill.active {
    color: #f6b012;
    border-bottom-color: #f6b012;
    background: rgba(246,176,18,0.04);
  }
  .tab-pill.dragging {
    opacity: 0.4;
  }

  /* suppress native browser select arrow on all engines */
  .select-container {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  

  /* fix native select dropdown background */
  .select-container option {
    background-color: #0a0a0a;
    color: #ffffff;
  }
</style>
