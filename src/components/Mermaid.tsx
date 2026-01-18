import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../contexts/ThemeContext';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const isDarkMode = theme === 'dark';
    
    // テーマに応じてMermaidを初期化
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: isDarkMode ? {
        primaryColor: '#4a5568',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#718096',
        lineColor: '#cbd5e0',
        secondaryColor: '#2d3748',
        tertiaryColor: '#1a202c',
      } : undefined,
    });

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
  }, [chart, theme]);

  return <div ref={ref} />;
}
