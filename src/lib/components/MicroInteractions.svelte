<script lang="ts">
  // Global micro-interaction utilities
  
  export function ripple(event: MouseEvent, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  export function smoothScroll(element: HTMLElement, target: HTMLElement) {
    const targetRect = target.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const offset = targetRect.top - elementRect.top - 20;
    
    element.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  }
  
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
</script>

<style>
  :global(.ripple) {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  :global(.card) {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  :global(.card:hover) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  :global(.interactive) {
    position: relative;
    overflow: hidden;
  }
  
  :global(.btn-primary) {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  :global(.btn-primary:hover) {
    transform: scale(1.02);
  }
  
  :global(.btn-primary:active) {
    transform: scale(0.98);
  }
  
  :global(.fade-in) {
    animation: fadeIn 0.3s ease-out;
  }
  
  :global(.slide-up) {
    animation: slideUp 0.3s ease-out;
  }
  
  :global(.scale-in) {
    animation: scaleIn 0.2s ease-out;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Loading states */
  :global(.loading-skeleton *) {
    pointer-events: none;
  }
  
  :global(.loading-shimmer) {
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
</style>