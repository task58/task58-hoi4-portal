export async function onRequest(context) {
  try {
    // 実際のファイルが存在する場合はそれを返す
    return await context.env.ASSETS.fetch(context.request);
  } catch {
    // ファイルが存在しない場合はindex.htmlを返す（SPA対応）
    const url = new URL(context.request.url);
    url.pathname = '/index.html';
    return await context.env.ASSETS.fetch(new Request(url, context.request));
  }
}
