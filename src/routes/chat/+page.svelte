<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { ChatCircleDots, PaperPlaneRight, Image as ImageIcon, X, ArrowClockwise, Trash, CopySimple, Check, CaretDown } from 'phosphor-svelte';

  // ─── types ────────────────────────────────────────────────────
  interface ImageAttachment {
    dataUrl: string;   // base64 data url for preview + sending
    mimeType: string;
    name: string;
  }

  interface MessageContent {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string };
  }

  interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string | MessageContent[];
    attachments?: ImageAttachment[];
    timestamp: Date;
    streaming?: boolean;
    error?: boolean;
  }

  // ─── state ────────────────────────────────────────────────────
  let messages = $state<Message[]>([]);
  let input = $state('');
  let isStreaming = $state(false);
  let attachments = $state<ImageAttachment[]>([]);
  let messagesEnd = $state<HTMLDivElement | null>(null);
  let inputEl = $state<HTMLTextAreaElement | null>(null);
  let fileInputEl = $state<HTMLInputElement | null>(null);
  let copiedId = $state<string | null>(null);
  let slashPreview = $state<{ cmd: string; context: string } | null>(null);
  let slashPreviewLoading = $state(false);
  let showScrollBtn = $state(false);
  let msgContainer = $state<HTMLDivElement | null>(null);

  let msgIdCounter = 0;
  function makeId() { return `m-${++msgIdCounter}`; }

  // ─── slash command preview ────────────────────────────────────
  let slashDebounce: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    const m = input.match(/^\s*\/(\S+(?:\s+[^\n]*)?)$/);
    if (m) {
      const cmd = m[1].trim();
      if (slashDebounce) clearTimeout(slashDebounce);
      slashDebounce = setTimeout(async () => {
        slashPreviewLoading = true;
        slashPreview = null;
        try {
          const res = await fetch(`/api/chat?cmd=${encodeURIComponent(cmd)}`);
          const data = await res.json() as { context: string };
          slashPreview = { cmd, context: data.context };
        } catch { slashPreview = null; }
        slashPreviewLoading = false;
      }, 300);
    } else {
      slashPreview = null;
      slashPreviewLoading = false;
    }
  });

  // ─── scroll handling ──────────────────────────────────────────
  function scrollToBottom(force = false) {
    if (!messagesEnd) return;
    messagesEnd.scrollIntoView({ behavior: force ? 'instant' : 'smooth' });
  }

  function onScroll() {
    if (!msgContainer) return;
    const { scrollTop, scrollHeight, clientHeight } = msgContainer;
    showScrollBtn = scrollHeight - scrollTop - clientHeight > 120;
  }

  // ─── image attachment ─────────────────────────────────────────
  function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files ?? []);
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      reader.onload = () => {
        attachments = [...attachments, {
          dataUrl: reader.result as string,
          mimeType: file.type,
          name: file.name
        }];
      };
      reader.readAsDataURL(file);
    }
    target.value = '';
  }

  function removeAttachment(idx: number) {
    attachments = attachments.filter((_, i) => i !== idx);
  }

  // ─── paste image from clipboard ───────────────────────────────
  function onPaste(e: ClipboardEvent) {
    const items = Array.from(e.clipboardData?.items ?? []);
    for (const item of items) {
      if (!item.type.startsWith('image/')) continue;
      const file = item.getAsFile();
      if (!file) continue;
      const reader = new FileReader();
      reader.onload = () => {
        attachments = [...attachments, {
          dataUrl: reader.result as string,
          mimeType: file.type,
          name: `pasted-image.${file.type.split('/')[1]}`
        }];
      };
      reader.readAsDataURL(file);
      e.preventDefault();
    }
  }

  // ─── build message payload for API ───────────────────────────
  function buildApiMessages(): Array<{ role: string; content: string | MessageContent[] }> {
    return messages
      .filter(m => m.role !== 'system')
      .map(m => {
        if (Array.isArray(m.content)) {
          return { role: m.role, content: m.content };
        }
        return { role: m.role, content: m.content as string };
      });
  }

  // ─── send message ─────────────────────────────────────────────
  async function send() {
    const text = input.trim();
    if (!text && attachments.length === 0) return;
    if (isStreaming) return;

    // build user message content
    let userContent: string | MessageContent[];
    if (attachments.length > 0) {
      const parts: MessageContent[] = [];
      if (text) parts.push({ type: 'text', text });
      for (const att of attachments) {
        parts.push({ type: 'image_url', image_url: { url: att.dataUrl } });
      }
      userContent = parts;
    } else {
      userContent = text;
    }

    const userMsg: Message = {
      id: makeId(),
      role: 'user',
      content: userContent,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date()
    };

    messages = [...messages, userMsg];
    input = '';
    attachments = [];
    slashPreview = null;

    await tick();
    scrollToBottom();

    // assistant placeholder
    const assistantId = makeId();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true
    };
    messages = [...messages, assistantMsg];
    isStreaming = true;

    try {
      const apiMessages = buildApiMessages();
      // swap last message with the user one we just appended (buildApiMessages already has it)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, stream: true })
      });

      if (!res.ok) {
        const errText = await res.text();
        messages = messages.map(m =>
          m.id === assistantId
            ? { ...m, content: `error: ${errText}`, streaming: false, error: true }
            : m
        );
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const chunk = line.slice(6).trim();
          if (chunk === '[DONE]') continue;
          try {
            const parsed = JSON.parse(chunk) as { choices: Array<{ delta: { content?: string } }> };
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              messages = messages.map(m =>
                m.id === assistantId ? { ...m, content: accumulated } : m
              );
              scrollToBottom();
            }
          } catch { /* partial json, skip */ }
        }
      }

      messages = messages.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      );
    } catch (err) {
      messages = messages.map(m =>
        m.id === assistantId
          ? { ...m, content: `network error: ${err}`, streaming: false, error: true }
          : m
      );
    } finally {
      isStreaming = false;
      await tick();
      scrollToBottom(true);
      inputEl?.focus();
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  async function copyMessage(msg: Message) {
    const text = typeof msg.content === 'string'
      ? msg.content
      : msg.content.filter(p => p.type === 'text').map(p => p.text).join('\n');
    await navigator.clipboard.writeText(text);
    copiedId = msg.id;
    setTimeout(() => { copiedId = null; }, 1500);
  }

  function clearChat() {
    if (messages.length === 0) return;
    if (!confirm('clear conversation?')) return;
    messages = [];
  }

  function retryLast() {
    if (isStreaming) return;
    // find last user message, remove assistant after it, resend
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { lastUserIdx = i; break; }
    }
    if (lastUserIdx < 0) return;
    const lastUser = messages[lastUserIdx];
    messages = messages.slice(0, lastUserIdx);
    // restore input
    if (typeof lastUser.content === 'string') {
      input = lastUser.content;
    } else {
      const textPart = lastUser.content.find(p => p.type === 'text');
      input = textPart?.text ?? '';
      attachments = lastUser.attachments ?? [];
    }
  }

  // ─── text to display content ──────────────────────────────────
  function getTextContent(msg: Message): string {
    if (typeof msg.content === 'string') return msg.content;
    return msg.content.filter(p => p.type === 'text').map(p => p.text ?? '').join('');
  }

  function getImages(msg: Message): string[] {
    if (msg.attachments && msg.attachments.length > 0) {
      return msg.attachments.map(a => a.dataUrl);
    }
    if (Array.isArray(msg.content)) {
      return msg.content
        .filter(p => p.type === 'image_url' && p.image_url)
        .map(p => p.image_url!.url);
    }
    return [];
  }

  // ─── markdown-like renderer (simple) ─────────────────────────
  function renderMarkdown(text: string): string {
    // code blocks
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="code-block"><code class="lang-${lang}">${escaped}</code></pre>`;
    });
    // inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // headings
    text = text.replace(/^### (.+)$/gm, '<h3 class="chat-h3">$1</h3>');
    text = text.replace(/^## (.+)$/gm, '<h2 class="chat-h2">$1</h2>');
    text = text.replace(/^# (.+)$/gm, '<h1 class="chat-h1">$1</h1>');
    // unordered lists
    text = text.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
    // numbered lists
    text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    // line breaks
    text = text.replace(/\n\n/g, '<br/><br/>');
    text = text.replace(/\n/g, '<br/>');
    return text;
  }

  onMount(() => {
    inputEl?.focus();
  });
</script>

<div class="flex flex-col gap-0 h-[calc(100dvh-theme(spacing.16)-theme(spacing.20))] lg:h-[calc(100dvh-theme(spacing.12))] -mx-4 md:-mx-8 lg:-mx-12" in:fade>
  <!-- header -->
  <div class="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/5 shrink-0">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-accent-yellow/10 rounded-xl text-accent-yellow">
        <ChatCircleDots size={22} weight="fill" />
      </div>
      <div>
        <h1 class="text-lg font-bold tracking-tight">chat</h1>
        <p class="text-[10px] text-white/30 font-bold tracking-widest">kimi k2.6 · nvidia nim</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      {#if messages.length > 0}
        <button onclick={retryLast} disabled={isStreaming} title="retry last message"
          class="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all disabled:opacity-30">
          <ArrowClockwise size={18} />
        </button>
        <button onclick={clearChat} disabled={isStreaming} title="clear chat"
          class="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30">
          <Trash size={18} />
        </button>
      {/if}
    </div>
  </div>

  <!-- messages area -->
  <div
    class="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6"
    bind:this={msgContainer}
    onscroll={onScroll}
  >
    {#if messages.length === 0}
      <div class="flex flex-col items-center justify-center h-full gap-6 text-center" transition:fade>
        <div class="w-16 h-16 rounded-2xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
          <ChatCircleDots size={36} weight="duotone" />
        </div>
        <div>
          <p class="text-xl font-bold text-white/80">kimi k2.6</p>
          <p class="text-white/30 text-sm mt-1 max-w-xs">
            your docker stack is already loaded as context. ask anything, or type a slash command to inject more:
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 w-full max-w-sm">
          {#each ['/compose', '/help', '/container nginx', '/dir /home'] as hint}
            <button
              class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/50 hover:text-white/80 transition-all text-left preserve-case"
              onclick={() => { input = hint; inputEl?.focus(); }}
            >
              {hint}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    {#each messages as msg (msg.id)}
      {#if msg.role !== 'system'}
        <div class="flex gap-3 {msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}" transition:fade={{ duration: 150 }}>
          <!-- avatar -->
          <div class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mt-1
            {msg.role === 'user' ? 'bg-accent-yellow text-black' : 'bg-white/10 text-white/60'}">
            {msg.role === 'user' ? 'u' : 'k'}
          </div>

          <!-- bubble -->
          <div class="flex flex-col gap-1 max-w-[85%] {msg.role === 'user' ? 'items-end' : 'items-start'}">
            <!-- images if any -->
            {#each getImages(msg) as imgSrc}
              <img src={imgSrc} alt="attachment" class="rounded-xl max-h-60 object-cover border border-white/10" />
            {/each}

            {#if getTextContent(msg) || msg.streaming}
              <div class="relative group/msg">
                <div class="rounded-2xl px-4 py-3 text-sm leading-relaxed preserve-case
                  {msg.role === 'user'
                    ? 'bg-accent-yellow/15 border border-accent-yellow/20 text-white rounded-tr-sm'
                    : msg.error
                      ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-sm'
                      : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-sm'}
                ">
                  {#if msg.role === 'assistant'}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html renderMarkdown(getTextContent(msg))}
                    {#if msg.streaming}
                      <span class="inline-block w-2 h-4 bg-accent-yellow animate-pulse ml-0.5 align-middle rounded-sm"></span>
                    {/if}
                  {:else}
                    <span class="whitespace-pre-wrap">{getTextContent(msg)}</span>
                  {/if}
                </div>

                <!-- copy button -->
                {#if !msg.streaming && getTextContent(msg)}
                  <button
                    onclick={() => copyMessage(msg)}
                    class="absolute {msg.role === 'user' ? 'left-0' : 'right-0'} -bottom-5 opacity-0 group-hover/msg:opacity-100 transition-opacity
                      text-white/30 hover:text-white/70 p-0.5"
                    title="copy"
                  >
                    {#if copiedId === msg.id}
                      <Check size={13} weight="bold" class="text-green-400" />
                    {:else}
                      <CopySimple size={13} />
                    {/if}
                  </button>
                {/if}
              </div>
            {/if}

            <span class="text-[10px] text-white/20 px-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      {/if}
    {/each}

    <div bind:this={messagesEnd}></div>
  </div>

  <!-- scroll-to-bottom button -->
  {#if showScrollBtn}
    <div class="absolute bottom-24 right-6 z-10" transition:scale>
      <button
        onclick={() => scrollToBottom(true)}
        class="p-2.5 rounded-full bg-surface border border-white/10 text-white/50 hover:text-white shadow-lg transition-all"
      >
        <CaretDown size={16} weight="bold" />
      </button>
    </div>
  {/if}

  <!-- slash preview -->
  {#if slashPreview || slashPreviewLoading}
    <div class="mx-4 md:mx-8 mb-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs" transition:fade={{ duration: 100 }}>
      {#if slashPreviewLoading}
        <p class="text-white/30 animate-pulse">resolving command…</p>
      {:else if slashPreview}
        <p class="text-accent-yellow font-bold mb-1 preserve-case">/{slashPreview.cmd}</p>
        <pre class="text-white/50 whitespace-pre-wrap text-[11px] leading-relaxed preserve-case max-h-32 overflow-y-auto">{slashPreview.context}</pre>
      {/if}
    </div>
  {/if}

  <!-- attachment previews -->
  {#if attachments.length > 0}
    <div class="flex gap-2 px-4 md:px-8 pb-2 overflow-x-auto shrink-0">
      {#each attachments as att, i}
        <div class="relative shrink-0" transition:scale={{ duration: 150 }}>
          <img src={att.dataUrl} alt={att.name} class="w-16 h-16 rounded-xl object-cover border border-white/10" />
          <button
            onclick={() => removeAttachment(i)}
            class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={11} weight="bold" />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- input bar -->
  <div class="px-4 md:px-8 pb-4 pt-2 border-t border-white/5 shrink-0">
    <div class="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-accent-yellow/30 transition-all">
      <!-- image upload button -->
      <button
        onclick={() => fileInputEl?.click()}
        class="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-accent-yellow hover:bg-accent-yellow/10 transition-all mb-0.5"
        title="attach image"
      >
        <ImageIcon size={20} />
      </button>
      <input
        bind:this={fileInputEl}
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        onchange={onFileChange}
      />

      <!-- text input -->
      <textarea
        bind:this={inputEl}
        bind:value={input}
        onkeydown={onKeydown}
        onpaste={onPaste}
        placeholder="ask anything, or /container nginx…"
        rows={1}
        disabled={isStreaming}
        class="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white placeholder-white/20 leading-relaxed preserve-case max-h-40 overflow-y-auto disabled:opacity-50"
        style="field-sizing: content;"
      ></textarea>

      <!-- send button -->
      <button
        onclick={send}
        disabled={isStreaming || (!input.trim() && attachments.length === 0)}
        class="shrink-0 p-2 rounded-xl bg-accent-yellow text-black disabled:opacity-30 hover:bg-accent-yellow/90 active:scale-95 transition-all mb-0.5"
      >
        {#if isStreaming}
          <div class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
        {:else}
          <PaperPlaneRight size={16} weight="fill" />
        {/if}
      </button>
    </div>
    <p class="text-[10px] text-white/15 mt-1.5 text-center">shift+enter for new line · paste or attach images · /slash commands inject context</p>
  </div>
</div>

<style>
  :global(.code-block) {
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 12px 14px;
    margin: 8px 0;
    overflow-x: auto;
    font-family: 'Droid Sans Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #d8ba75;
  }
  :global(.inline-code) {
    background: rgba(246,176,18,0.12);
    border: 1px solid rgba(246,176,18,0.2);
    border-radius: 4px;
    padding: 1px 5px;
    font-family: 'Droid Sans Mono', monospace;
    font-size: 0.85em;
    color: #f6b012;
  }
  :global(.chat-h1) { font-size: 1.2em; font-weight: 800; margin: 8px 0 4px; }
  :global(.chat-h2) { font-size: 1.1em; font-weight: 700; margin: 6px 0 4px; }
  :global(.chat-h3) { font-size: 1em; font-weight: 700; margin: 4px 0 2px; color: rgba(255,255,255,0.8); }
  :global(ul.chat-ul) { padding-left: 1.2em; margin: 4px 0; }
  :global(ul.chat-ul li) { margin: 2px 0; }

  textarea {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
</style>
