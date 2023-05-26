export interface Env {
  URLS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // Build a standard JavaScript URL object from the request's URL
    const url = new URL(request.url);

    // Get the shortened path (key) from the url, removing the leading slash
    const shortCode = url.pathname.split('/')[1];

    // Redirect root url to Cloudflare docs (for now)
    if (shortCode == "") {
      Response.redirect("https://developers.cloudflare.com");
    }

    // Split off any querystring parameters
    const params = url.searchParams;

    // Lookup the key in KV
    const redirectUrl = await env.URLS.get(shortCode);

    // If not found, return a 404
    if (redirectUrl === null) {
      return new Response("Value not found", { status: 404 });
    }

    // The Response class has static methods to create common Response objects as a convenience
    return Response.redirect(redirectUrl + params);
  },
};
