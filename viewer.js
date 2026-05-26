/*export async function onRequestGet(context) {

  return new Response(`
    <html>
      <head>
        <title>TEST TITLE</title>
      </head>
      <body>
        HELLO
      </body>
    </html>
  `, {
    headers: {
      "content-type": "text/html"
    }
  });
}*/

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    // Dynamic route
    if (url.pathname === "/content") {

      return new Response(`
        <html>
          <head>
            <title>FUNCTION WORKING</title>
          </head>
          <body>
            Worker route works
          </body>
        </html>
      `, {
        headers: {
          "content-type": "text/html"
        }
      });

    }

    // Serve normal static files
    return env.ASSETS.fetch(request);

  }

}