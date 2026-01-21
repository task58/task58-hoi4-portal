export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // 既存のアセットファイルを試す
  try {
    const response = await context.env.ASSETS.fetch(context.request);
    
    // ファイルが見つかった場合（200 OK）はそのまま返す
    if (response.status === 200) {
      return response;
    }
  } catch (e) {
    // 404などのエラーは無視して続行
  }

  // ファイルが見つからない場合、index.htmlを返す（SPA対応）
  // ただし、実際に404を返すべきアセット（拡張子がある場合）は除外
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname) && 
                           !['.html'].includes(pathname.substring(pathname.lastIndexOf('.')));
  
  if (hasFileExtension) {
    // 明らかなアセットファイルで存在しない場合は404を返す
    return new Response('Not Found', { status: 404 });
  }

  // SPAルーティング：index.htmlを返す
  const indexUrl = new URL(context.request.url);
  indexUrl.pathname = '/index.html';
  return await context.env.ASSETS.fetch(new Request(indexUrl, context.request));
}
