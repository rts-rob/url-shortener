import html404 from './404.html';

export interface Env {
  BASELIME_API_KEY: string;
  SERVICE_NAME: string;
  URLS: KVNamespace;
}

const handler = {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // Build a standard JavaScript URL object from the request's URL
    const url = new URL(request.url);

    // Get the shortened path (key) from the url, removing the leading slash
    const shortCode = url.pathname.split('/')[1];
    console.log(JSON.stringify({ shortCode }));

    // Redirect root url to Cloudflare docs (for now)
    if (shortCode == '') {
      return Response.redirect('https://developers.cloudflare.com');
    }

    // Split off any querystring parameters
    const params = url.searchParams;

    // Lookup the key in KV
    const redirectUrl = await env.URLS.get(shortCode);

    // If not found, return a 404
    if (redirectUrl === null) {
      let response = new Response(html404, { status: 404 });
      response.headers.set('content-type', 'text/html');
      return response;
    }

    // The Response class has static methods to create common Response objects as a convenience
    return Response.redirect(redirectUrl + params);
  },
};

export default handler;
