<script lang="ts">
  import Editor from '$lib/components/Editor.svelte';
  import { 
    Play, 
    Stop, 
    Download, 
    MagicWand, 
    FloppyDisk, 
    Copy, 
    Check, 
    CircleNotch, 
    CaretDown, 
    MagnifyingGlass,
    Plus,
    Code
  } from 'phosphor-svelte';
  import { clsx } from 'clsx';
  import { fade, slide, scale } from 'svelte/transition';
  import { toasts } from '$lib/toast';
  import { snippets } from '$lib/snippets';

  let { data } = $props();
  let selectedStack = $state<any>(null);
  let yamlContent = $state('');
  let loading = $state(false);
  let saving = $state(false);
  let executionOutput = $state<{ type: 'stdout' | 'stderr' | 'error' | 'exit', text?: string, code?: number }[]>([]);
  let isExecuting = $state(false);
  let copied = $state(false);

  // Snippet Search State
  let snippetSearch = $state('');
  let showSnippets = $state(false);
  const filteredSnippets = $derived(
    snippets.filter(s => 
      s.name.toLowerCase().includes(snippetSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(snippetSearch.toLowerCase())
    )
  );

  // Stack Dropdown State
  let showStackSelector = $state(false);

  $effect(() => {
    if (!selectedStack && data.stacks.length > 0) {
      selectedStack = data.stacks[0];
    }
  });

  $effect(() => {
    if (selectedStack) {
      console.log('selected stack changed:', selectedStack.name);
      loadStackContent(selectedStack.path);
    }
  });

  async function copyToClipboard() {
    await navigator.clipboard.writeText(yamlContent);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  let consoleElement: HTMLDivElement;
  $effect(() => {
    if (executionOutput.length > 0 && consoleElement) {
      // Scroll to bottom after state update
      setTimeout(() => {
        if (consoleElement) consoleElement.scrollTop = consoleElement.scrollHeight;
      }, 0);
    }
  });

  async function loadStackContent(path: string) {
    console.log('loading stack content from:', path);
    loading = true;
    try {
      const res = await fetch(`/api/compose/content?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const json = await res.json();
        console.log('stack content loaded, length:', json.content?.length);
        yamlContent = json.content || '';
      } else {
        const errText = await res.text();
        console.error('failed to load stack content:', errText);
        toasts.error('failed to load stack content');
      }
    } catch (err) {
      toasts.error('network error while loading stack');
    } finally {
      loading = false;
    }
  }

  async function saveStack() {
    if (!selectedStack) return;
    saving = true;
    try {
      const res = await fetch('/api/compose/save', {
        method: 'POST',
        body: JSON.stringify({ path: selectedStack.path, content: yamlContent })
      });
      if (res.ok) {
        toasts.success('stack saved successfully');
      } else {
        toasts.error('failed to save stack');
      }
    } catch (err) {
      toasts.error('network error while saving');
    } finally {
      saving = false;
    }
  }

  function runCommand(cmd: string) {
    if (!selectedStack || isExecuting) return;
    
    executionOutput = [];
    isExecuting = true;

    const eventSource = new EventSource(`/api/compose/stream?path=${encodeURIComponent(selectedStack.path)}&command=${encodeURIComponent(cmd)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      executionOutput = [...executionOutput, data];
      
      if (data.type === 'exit') {
        eventSource.close();
        isExecuting = false;
        if (data.code === 0) {
          toasts.success(`command '${cmd}' completed`);
        } else {
          toasts.error(`command '${cmd}' failed with code ${data.code}`);
        }
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      isExecuting = false;
      toasts.error('stream disconnected');
    };
  }

  function insertSnippet(content: string) {
    yamlContent += '\n' + content;
    showSnippets = false;
    snippetSearch = '';
    toasts.success('snippet inserted');
  }

  async function aiFix() {
    toasts.info('analyzing yaml...');
    const res = await fetch('/api/compose/fix', {
      method: 'POST',
      body: JSON.stringify({ yaml: yamlContent, error: 'unknown error' })
    });
    const data = await res.json();
    if (res.ok && data.fixed) {
      yamlContent = data.fixed;
      toasts.success('yaml linted and formatted');
    } else {
      toasts.error(data.error || 'could not fix yaml');
    }
  }
</script>

<div class="h-[calc(100dvh-200px)] flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h2 class="text-3xl font-bold tracking-tight">compose</h2>
      
      <div class="relative">
        <button 
          class="flex items-center gap-4 bg-surface border border-white/10 rounded-xl px-5 py-2.5 text-sm min-w-[280px] hover:border-white/20 transition-all shadow-lg group relative overflow-hidden"
          onclick={() => showStackSelector = !showStackSelector}
        >
          <div class="flex flex-col items-start min-w-0">
            <span class="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none mb-1">active stack</span>
            <span class="font-bold truncate preserve-case text-accent-yellow">{selectedStack?.name || 'select stack'}</span>
          </div>
          <div class="ml-auto w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-accent-yellow/10 transition-colors">
            <CaretDown size={14} class={clsx("transition-transform shrink-0 text-white/40 group-hover:text-white", showStackSelector && "rotate-180")} />
          </div>
        </button>

        {#if showStackSelector}
          <div 
            class="absolute top-full left-0 mt-2 w-full bg-surface/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1"
            in:slide={{ duration: 150 }}
            out:fade
          >
            {#each data.stacks as stack}
              <button 
                class={clsx(
                  "w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors preserve-case",
                  selectedStack?.path === stack.path ? "text-accent-yellow font-bold" : "text-white/60"
                )}
                onclick={() => {
                  selectedStack = stack;
                  showStackSelector = false;
                }}
              >
                {stack.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button class="bg-surface/40 hover:bg-surface/60 border border-white/5 p-2.5 rounded-lg transition-colors relative" onclick={copyToClipboard} title="copy yaml">
        {#if copied}
          <div in:scale class="text-green-400"><Check size={18} /></div>
        {:else}
          <Copy size={18} class="text-white/40" />
        {/if}
      </button>
      <button class="btn-secondary flex items-center gap-2 text-xs py-2.5" onclick={aiFix}>
        <MagicWand size={16} />
        ai fix
      </button>
      <button class="btn-primary flex items-center gap-2 text-xs min-w-[100px] justify-center py-2.5" onclick={saveStack} disabled={saving}>
        {#if saving}
          <CircleNotch size={16} class="animate-spin" />
        {:else}
          <FloppyDisk size={16} />
          save
        {/if}
      </button>
    </div>
  </div>

  <div class="flex-1 min-h-0 flex gap-6">
    <div class="flex-1 flex flex-col gap-4 min-h-0">
      <div class="flex-1 min-h-0 relative">
        <div class={clsx(
          "absolute inset-0 z-10 bg-surface/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none rounded-xl",
          loading ? "opacity-100" : "opacity-0"
        )}>
          <div class="flex flex-col items-center gap-2">
            <CircleNotch size={32} class="animate-spin text-accent-yellow" />
            <span class="text-xs text-white/40 font-bold uppercase tracking-widest">loading stack...</span>
          </div>
        </div>
        <Editor bind:value={yamlContent} />
      </div>

      {#if executionOutput.length > 0 || isExecuting}
        <div 
          bind:this={consoleElement}
          class="h-48 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1 scroll-smooth"
          transition:slide
        >
          <div class="flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-md -m-4 mb-2 p-2 px-4 border-b border-white/5 z-10">
            <span class="text-white/20 uppercase tracking-widest text-[9px] font-bold">execution output</span>
            <button class="text-white/20 hover:text-white text-[10px] uppercase font-bold tracking-tighter" onclick={() => executionOutput = []}>clear</button>
          </div>
          {#each executionOutput as line}
            <div class={clsx(
              'whitespace-pre-wrap py-0.5',
              (line.type === 'stderr' || line.type === 'error') ? 'text-red-400/90' : 'text-accent-yellow/70',
              line.type === 'exit' && 'text-white font-bold border-t border-white/5 mt-2 pt-2'
            )}>
              {#if line.type === 'exit'}
                <span class="opacity-50">#</span> process exited with code {line.code}
              {:else}
                {line.text}
              {/if}
            </div>
          {/each}
          {#if isExecuting}
            <div class="flex items-center gap-2 text-accent-yellow/50 animate-pulse py-1">
              <CircleNotch size={12} class="animate-spin" />
              <span>executing...</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="w-72 space-y-4 shrink-0 flex flex-col">
      <div class="card space-y-4">
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest">stack actions</p>
        <div class="grid grid-cols-1 gap-2">
          <button class="w-full btn-primary flex items-center gap-3 justify-center py-3" onclick={() => runCommand('up -d')} disabled={isExecuting}>
            <Play size={20} weight="fill" />
            up
          </button>
          <button class="w-full border border-white/10 hover:bg-white/5 px-4 py-3 rounded-md transition-all flex items-center gap-3 justify-center" onclick={() => runCommand('down')} disabled={isExecuting}>
            <Stop size={20} weight="fill" />
            down
          </button>
          <button class="w-full border border-white/10 hover:bg-white/5 px-4 py-3 rounded-md transition-all flex items-center gap-3 justify-center" onclick={() => runCommand('pull')} disabled={isExecuting}>
            <Download size={20} />
            pull
          </button>
        </div>
      </div>

      <div class="card flex-1 flex flex-col min-h-0 gap-4">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold text-white/40 uppercase tracking-widest">snippets</p>
          <Code size={16} class="text-white/20" />
        </div>
        
        <div class="relative">
          <MagnifyingGlass size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="search snippets..." 
            class="w-full bg-black/20 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-accent-yellow transition-all"
            bind:value={snippetSearch}
            onfocus={() => showSnippets = true}
          />
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {#each filteredSnippets as snippet}
            <button 
              class="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left group transition-all"
              onclick={() => insertSnippet(snippet.content)}
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-white/80 group-hover:text-accent-yellow transition-colors">{snippet.name}</span>
                <Plus size={14} class="text-white/20 group-hover:text-accent-yellow" />
              </div>
              <p class="text-[10px] text-white/40 leading-relaxed line-clamp-2">{snippet.description}</p>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
