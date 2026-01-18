import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Mermaid } from './Mermaid';
import 'katex/dist/katex.min.css';
import './MarkdownRenderer.css';

export function MarkdownRenderer() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);

      // URLパスからMarkdownファイルのパスを決定
      let path = location.pathname;
      if (path === '/') {
        path = '/index';
      }
      
      // 末尾のスラッシュを削除
      path = path.replace(/\/$/, '');

      try {
        // pagesフォルダから対応するMarkdownファイルを読み込む
        const response = await fetch(`/pages${path}.md`);
        
        if (!response.ok) {
          throw new Error(`ページが見つかりません: ${path}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ファイルの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [location]);

  if (loading) {
    return <div className="markdown-container loading">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="markdown-container error">
        <h1>エラー</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // コードブロックでMermaidを処理
          code(props) {
            const { className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');
            
            // インラインコードかブロックコードかを判定
            const isInline = !className;

            if (!isInline && lang === 'mermaid') {
              return <Mermaid chart={code} />;
            }

            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
