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

    if(url.pathname === "/viewer") {

    const parts = url.pathname.split("/");


/*    if (!match) {
        return new Response("400 Invalid URL", {
        status: 400,
        headers: {
          "content-type": "text/plain"
            }
      });
    }*/

      const id = match[3];

      const slug = match[4];
    

      return new Response(`
        <html>
          <head>
            <title>FUNCTION WORKING</title>
          </head>
          <body>
            Worker route works
            <h3>id = ${id}</h3>
            <h3>slug = ${slug}</h3>
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