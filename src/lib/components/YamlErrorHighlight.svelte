<script lang="ts">
  let { content = '', errors = [], warnings = [] } = $props<{
    content?: string;
    errors?: any[];
    warnings?: any[];
  }>();
  
  let editorElement = $state<HTMLElement>();
  
  $effect(() => {
    if (editorElement && content) {
      highlightErrors();
    }
  });
  
  function highlightErrors() {
    if (!editorElement) return;
    
    const lines = content.split('\n');
    let highlightedContent = '';
    
    lines.forEach((line: string, index: number) => {
      const lineNumber = index + 1;
      let lineClass = '';
      let lineTooltip = '';
      
      // Check for errors on this line
      const lineErrors = errors.filter((err: any) => err.line === lineNumber);
      const lineWarnings = warnings.filter((warn: any) => warn.line === lineNumber);
      
      if (lineErrors.length > 0) {
        lineClass = 'bg-red-500/10 border-l-4 border-red-500';
        lineTooltip = lineErrors.map((err: any) => err.message).join('; ');
      } else if (lineWarnings.length > 0) {
        lineClass = 'bg-yellow-500/10 border-l-4 border-yellow-500';
        lineTooltip = lineWarnings.map((warn: any) => warn.message).join('; ');
      }
      
      highlightedContent += `<div class="line ${lineClass}" data-tooltip="${lineTooltip}" style="padding: 2px 8px; border-bottom: 1px solid rgba(255,255,255,0.05);">`;
      highlightedContent += `<span class="line-number text-white/20 text-xs mr-4 select-none">${String(lineNumber).padStart(3, ' ')}</span>`;
      highlightedContent += `<span class="line-content">${escapeHtml(line)}</span>`;
      highlightedContent += '</div>';
    });
    
    editorElement.innerHTML = highlightedContent;
  }
  
  function escapeHtml(text: string) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
</script>

<div 
  class="font-mono text-sm bg-surface/50 rounded-lg overflow-auto"
  bind:this={editorElement}
  style="max-height: 200px;"
></div>

<style>
  :global(.line) {
    transition: all 0.2s ease;
  }
  
  :global(.line:hover) {
    background: rgba(255, 255, 255, 0.05);
  }
  
  :global(.line-number) {
    user-select: none;
    opacity: 0.5;
  }
  
  :global(.line[data-tooltip]:hover::after) {
    content: attr(data-tooltip);
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: pre-wrap;
    max-width: 300px;
    z-index: 1000;
    margin-left: 8px;
    margin-top: -20px;
  }
</style>