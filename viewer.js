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

     const match = url.pathname.match(
      /^\/viewer\/([^\/]+)\/([^\/]+)$/
    );

    if(match) {

try {

        // Call backend API
        const apiResponse = await fetch(
          "https://i-press-backend-production.up.railway.app/files/gettitleanddes",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              contentid: match[1]
            })
          }
        );

        const data = await apiResponse.json();
        const item = data[0];

        // Load HTML template
        const templateResponse = await env.ASSETS.fetch(
          new Request(
            new URL("/view/index.html", request.url)
          )
        );

        let html = await templateResponse.text();

        // Replace SEO placeholders
        html = html.replace(
          /__TITLE__/g,
          item?.title || "GoPress - share your stuff"
        );

        html = html.replace(
          /__DESCRIPTION__/g,
          item?.descr || "Document Viewer"
        );

        // Optional canonical URL
        html = html.replace(
          /__CANONICAL__/g,
          `https://gopress.online/viewer/${match[1]}/${match[2]}`
        );

/*        return new Response(html, {
          headers: {
            "content-type": "text/html;charset=UTF-8"
          }
        });*/

      return new Response(`
        <html>
          <head>
            <title>FUNCTION WORKING</title>
          </head>
          <body>
            Worker route works
            <h3>id = ${match[1]}</h3>
            <h3>slug = ${match[2]}</h3>
            <h3>${item.title}</h3>
            <h3>${item.descr}</h3>
          </body>
        </html>
      `, {
        headers: {
          "content-type": "text/html"
        }
      });


      }
      catch (err) {

        return new Response(
          "Internal server error, " + err.message,
          {
            status: 500
          }
        );

      }

    //const parts = url.split("/");


/*    if (!match) {
        return new Response("400 Invalid URL", {
        status: 400,
        headers: {
          "content-type": "text/plain"
            }
      });
    }*/

///      const id = match[0];

//      const slug = match[1];
    

/*      return new Response(`
        <html>
          <head>
            <title>FUNCTION WORKING</title>
          </head>
          <body>
            Worker route works
            <h3>id = ${match[1]}</h3>
            <h3>slug = ${match[2]}</h3>
          </body>
        </html>
      `, {
        headers: {
          "content-type": "text/html"
        }
      });*/
    }
    // Serve normal static files
    return env.ASSETS.fetch(request);

  }

}