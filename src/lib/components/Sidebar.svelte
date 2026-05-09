<script lang="ts">
  import { page } from '$app/state';
  import { 
    Cube, 
    Images, 
    HardDrive, 
    ShareNetwork, 
    FileCode, 
    ChartBar, 
    TerminalWindow 
  } from 'phosphor-svelte';
  import { clsx } from 'clsx';

  const navItems = [
    { label: 'containers', icon: Cube, href: '/containers' },
    { label: 'images', icon: Images, href: '/images' },
    { label: 'volumes', icon: HardDrive, href: '/volumes' },
    { label: 'networks', icon: ShareNetwork, href: '/networks' },
    { label: 'compose', icon: FileCode, href: '/compose' },
    { label: 'analytics', icon: ChartBar, href: '/analytics' },
    { label: 'terminal', icon: TerminalWindow, href: '/terminal' }
  ];
</script>

<aside class="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/10 hidden lg:flex flex-col p-6 z-40">
  <div class="mb-12">
    <h1 class="text-accent-yellow text-2xl font-bold tracking-tighter">docker</h1>
  </div>

  <nav class="flex-1 space-y-2">
    {#each navItems as item}
      {@const active = page.url.pathname === item.href || (item.href !== '/' && page.url.pathname.startsWith(item.href))}
      <a 
        href={item.href}
        class={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95",
          active ? "bg-accent-yellow text-black" : "text-white hover:bg-white/5"
        )}
      >
        <item.icon size={24} weight={active ? "fill" : "regular"} strokeWidth={1.5} />
        <span class="font-medium">{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>
