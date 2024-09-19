import { Hono } from 'hono';
import html404 from './404.html';

type Bindings = {
  URLS: KVNamespace;
};

const rootRedirectURL = 'https://robsutter.com';
const app = new Hono<{ Bindings: Bindings }>();

app.get('/:shortCode', async (c) => {
  const shortCode = c.req.param('shortCode');

  // Lookup the key in KV
  const targetUrl = await c.env.URLS.get(shortCode);

  // If not found, return a 404
  if (targetUrl === null) {
    const statusCode = 404;
    console.log({ shortCode, statusCode });
    return c.html(html404, statusCode);
  }

  // Redirect to the target URL, stripping any querystring parameters.
  const statusCode = 302;
  console.log({ shortCode, targetUrl, statusCode });
  return c.redirect(targetUrl, statusCode);
});

app.get('/', (c) => {
  return c.redirect(rootRedirectURL);
});

export default app;
