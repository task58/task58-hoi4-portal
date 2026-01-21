export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 静的ファイルとして存在するかチェック
  const response = await context.env.ASSETS.fetch(context.request);
  
  // 200 OKならそのまま返す
  if (response.status === 200) {
    return response;
  }

  // 404の場合、拡張子がないパスならindex.htmlを返す（SPA対応）
  const hasExtension = pathname.includes('.') && pathname.lastIndexOf('.') > pathname.lastIndexOf('/');
  
  if (!hasExtension) {
    // SPAルーティング：index.htmlを返す
    return context.env.ASSETS.fetch(new Request(new URL('/index.html', url), context.request));
  }

  // 拡張子がある場合は404をそのまま返す
  return response;
}
