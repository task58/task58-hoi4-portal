import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

// Mermaidを初期化
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // ユニークなIDを生成
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      ref.current.innerHTML = `<div class="mermaid" id="${id}">${chart}</div>`;
      
      mermaid.run({
        querySelector: `#${id}`,
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
      });
    }
  }, [chart]);

  return <div ref={ref} />;
}
