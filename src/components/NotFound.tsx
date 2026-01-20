import { Link } from 'react-router-dom';
import './NotFound.css';

interface NotFoundProps {
  message?: string;
  path?: string;
}

export function NotFound({ message, path }: NotFoundProps) {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">ページが見つかりません</h2>
        {message && <p className="not-found-message">{message}</p>}
        {path && <p className="not-found-path">要求されたパス: <code>{path}</code></p>}
        <div className="not-found-actions">
          <Link to="/" className="not-found-button">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
