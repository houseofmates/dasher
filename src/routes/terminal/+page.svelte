<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Terminal } from '@xterm/xterm';
  import { FitAddon } from '@xterm/addon-fit';
  import '@xterm/xterm/css/xterm.css';
  import { TerminalWindow, CaretRight, Broadcast, Stop } from 'phosphor-svelte';
  import { fade, scale } from 'svelte/transition';
  import { toasts } from '$lib/toast';

  let { data } = $props();
  let terminalElement: HTMLDivElement;
  let term: Terminal;
  let fitAddon: FitAddon;
  let socket: WebSocket;
  let selectedContainerId = $state('');
  let isConnected = $state(false);

  function initTerminal() {
    if (term) term.dispose();
    
    term = new Terminal({
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

    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalElement);
    
    // Add a small delay to ensure container is fully rendered before fitting
    setTimeout(() => fitAddon.fit(), 100);

    term.onData(data => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (fitAddon) fitAddon.fit();
    });
    resizeObserver.observe(terminalElement);
  }

  function connect() {
    if (!selectedContainerId) return;
    
    if (socket) {
      socket.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${protocol}//${window.location.host}/terminal?id=${selectedContainerId}`);
    
    socket.onopen = () => {
      isConnected = true;
      term.reset();
      term.focus();
      toasts.success('terminal connected');
    };

    socket.onmessage = (event) => {
      term.write(event.data);
    };

    socket.onerror = () => {
      toasts.error('websocket error');
    };

    socket.onclose = () => {
      isConnected = false;
      term.write('\r\n\x1b[31m[session closed]\x1b[0m\r\n');
    };
  }

  function disconnect() {
    if (socket) {
      socket.close();
      selectedContainerId = '';
    }
  }

  onMount(() => {
    initTerminal();
  });

  onDestroy(() => {
    if (socket) socket.close();
    if (term) term.dispose();
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

    <div class="flex items-center gap-3">
      <div class="relative group">
        <select 
          class="bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-yellow transition-all appearance-none pr-10 min-w-[200px] preserve-case"
          bind:value={selectedContainerId}
          onchange={connect}
          disabled={isConnected}
        >
          <option value="" disabled>select container</option>
          {#each data.containers as container}
            <option value={container.id}>{container.name}</option>
          {/each}
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-focus-within:text-accent-yellow transition-colors">
          <CaretRight size={16} weight="bold" />
        </div>
      </div>

      {#if isConnected}
        <button
          onclick={disconnect}
          transition:scale
          class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2 lowercase"
        >
          <Stop size={18} weight="fill" />
          stop
        </button>
      {/if}
    </div>
  </div>

  <div class="card p-1 min-h-[600px] h-[calc(100dvh-320px)] flex flex-col overflow-hidden group">
    <div class="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/2">
      <div class="flex gap-1.5">
        <div class="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-accent-yellow/40"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
      </div>
      <div class="flex items-center gap-2 text-[10px] font-bold text-white/20 tracking-widest uppercase">
        {#if isConnected}
          <span class="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
          active session
        {:else}
          offline
        {/if}
      </div>
    </div>
    
    <div class="flex-1 p-4 bg-black/40 overflow-hidden relative">
      <div bind:this={terminalElement} class="h-full w-full"></div>
      
      {#if !isConnected && !selectedContainerId}
        <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/10" transition:fade>
          <Broadcast size={64} weight="thin" />
          <p class="text-lg font-medium lowercase">select a container to start</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.xterm) {
    padding: 0;
  }
  :global(.xterm-viewport) {
    background-color: transparent !important;
  }
  :global(.xterm-screen) {
    background-color: transparent !important;
  }
</style>
