import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Mermaid } from './Mermaid';
import { NotFound } from './NotFound';
import { getAssetUrl } from '../utils/paths';
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
      // React Routerのbasenameを考慮したパスが既に取得される
      let path = location.pathname;
      if (path === '/') {
        path = '/index';
      }
      
      // 末尾のスラッシュを削除
      const cleanPath = path.replace(/\/$/, '');

      try {
        // 複数のパターンでMarkdownファイルを検索
        const patterns = [
          `pages${cleanPath}.md`,           // 例: /play-diary → /pages/play-diary.md
          `pages${cleanPath}/index.md`,     // 例: /play-diary → /pages/play-diary/index.md
        ];

        let response: Response | null = null;

        // 各パターンを順番に試す
        for (const pattern of patterns) {
          const markdownUrl = getAssetUrl(pattern);
          const tryResponse = await fetch(markdownUrl);
          
          if (tryResponse.ok) {
            response = tryResponse;
            break;
          }
        }

        if (!response) {
          throw new Error(`ページが見つかりません: ${cleanPath}`);
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
    return <NotFound message={error} path={location.pathname} />;
  }

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // コードブロックでMermaidとシンタックスハイライトを処理
          code(props) {
            const { className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');
            
            // インラインコードかブロックコードかを判定
            const isInline = !className;

            // インラインコードの場合
            if (isInline) {
              return (
                <code className="inline-code" {...rest}>
                  {children}
                </code>
              );
            }

            // Mermaid図の場合
            if (lang === 'mermaid') {
              return <Mermaid chart={code} />;
            }

            // コードブロックの場合（シンタックスハイライト）
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={lang || 'text'}
                PreTag="div"
                showLineNumbers={true}
                wrapLines={true}
                customStyle={{
                  margin: '1.5em 0',
                  borderRadius: '6px',
                  fontSize: '0.9em',
                }}
              >
                {code}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
