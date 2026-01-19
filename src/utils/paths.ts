// アプリケーションのベースパス
// Viteのbase設定と一致させる必要がある
export const BASE_PATH = import.meta.env.BASE_URL || '/';

/**
 * ベースパスを考慮したURLを生成
 */
export function getAssetUrl(path: string): string {
  // pathが/で始まる場合は削除
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // BASE_PATHが/で終わる場合は/を削除してから結合
  const basePath = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  
  return `${basePath}/${cleanPath}`;
}

/**
 * ベースパスを除いた純粋なパスを取得
 */
export function getPathWithoutBase(fullPath: string): string {
  if (BASE_PATH === '/') return fullPath;
  
  const basePath = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  
  if (fullPath.startsWith(basePath)) {
    return fullPath.slice(basePath.length) || '/';
  }
  
  return fullPath;
}
