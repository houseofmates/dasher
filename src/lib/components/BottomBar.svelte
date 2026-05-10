<script lang="ts">
  import { page } from '$app/state';
  import { 
    Cube, 
    Images, 
    HardDrive,
    ShareNetwork,
    FileCode, 
    ChartBar, 
    TerminalWindow,
    ChatCircleDots
  } from 'phosphor-svelte';
  import { clsx } from 'clsx';

  const navItems = [
    { label: 'containers', icon: Cube, href: '/containers' },
    { label: 'images', icon: Images, href: '/images' },
    { label: 'volumes', icon: HardDrive, href: '/volumes' },
    { label: 'networks', icon: ShareNetwork, href: '/networks' },
    { label: 'compose', icon: FileCode, href: '/compose' },
    { label: 'analytics', icon: ChartBar, href: '/analytics' },
    { label: 'terminal', icon: TerminalWindow, href: '/terminal' },
    { label: 'chat', icon: ChatCircleDots, href: '/chat' }
  ];
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 lg:hidden flex justify-around items-center h-20 pb-safe z-40">
  {#each navItems as item}
    {@const active = page.url.pathname === item.href || (item.href !== '/' && page.url.pathname.startsWith(item.href))}
    <a 
      href={item.href}
      class={clsx(
        "flex flex-col items-center gap-1 transition-all active:scale-95",
        active ? "text-accent-yellow" : "text-white/60"
      )}
    >
      <item.icon size={28} weight={active ? "fill" : "regular"} strokeWidth={1.5} />
      <span class="text-[10px] font-bold tracking-tight">{item.label}</span>
    </a>
  {/each}
</nav>

<style>
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
</style>
