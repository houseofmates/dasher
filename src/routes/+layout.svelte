<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import BottomBar from '$lib/components/BottomBar.svelte';
  import Toaster from '$lib/components/Toaster.svelte';
  import './layout.css';
  let { children } = $props();
</script>

<Toaster />

<div class="min-h-[100dvh] bg-background text-white selection:bg-accent-yellow selection:text-black">
  <Sidebar />
  
  <main class="lg:ml-64 p-4 md:p-8 lg:p-12 pb-32 lg:pb-12 max-w-[1400px] mx-auto">
    {@render children()}
  </main>

  <BottomBar />
</div>

<style>
  :global(body) {
    background-color: #050505;
  }
</style>
