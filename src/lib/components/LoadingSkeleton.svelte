<script lang="ts">
  let { height = 'h-4', width = 'w-full', rounded = 'rounded', animate = true, variant = 'default' } = $props<{
    height?: string;
    width?: string;
    rounded?: string;
    animate?: boolean;
    variant?: 'default' | 'card' | 'text';
  }>();

  function getVariantClasses() {
    switch (variant) {
      case 'card':
        return 'skeleton-card';
      case 'text':
        return 'skeleton-text';
      default:
        return 'skeleton-default';
    }
  }
</script>

<div 
  class="{height} {width} {rounded} {getVariantClasses()} {animate ? 'animate-pulse' : ''}"
  style="background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 100%; animation: shimmer 1.5s infinite;"
></div>

<style>
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .skeleton-default {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .skeleton-card {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .skeleton-text {
    background-color: rgba(255, 255, 255, 0.03);
  }
</style>

