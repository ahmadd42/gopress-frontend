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
        let ext = ".mp4";

        if(item.extension === ".pdf")
        ext = ".jpg";
        else if(item.extension === ".jpg" || item.extension === ".jpeg" || item.extension === ".gif" || item.extension === ".png" || item.extension === ".tiff")
        ext = item.extension;

        // Load HTML template
        const templateResponse = await env.ASSETS.fetch(
          new Request(
            new URL("/view/index.html", request.url)
          )
        );

        let html = await templateResponse.text();

        // Replace Page title
        html = html.replace(
          /__PAGETITLE__/g,
          `${item?.title} - goPress` || "GoPress - share your stuff"
        );

        // Replace SEO placeholders
        html = html.replace(
          /__TITLE__/g,
          item?.title || "GoPress - share your stuff"
        );

        html = html.replace(
          /__DESCRIPTION__/g,
          item?.descr || "Document Viewer"
        );

        if(ext != ".mp4") {
        html = html.replace(
          /__PREVIEWIMAGE__/g,
          `https://preview.gopress.online/preview/${match[1]}${ext}` || "Preview Image"
        );
      }

        // Optional canonical URL
        html = html.replace(
          /__MYURL__/g,
          `https://gopress.online/viewer/${match[1]}/${match[2]}`
        );

        html = html.replace(
          /__DESCHTML__/g,
          `<span id="descr">${item.descr}</span>`
        );

        // Optional canonical URL
        html = html.replace(
          /__DOCID__/g,
          match[1]
        );


        return new Response(html, {
          headers: {
            "content-type": "text/html;charset=UTF-8"
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
   }
    // Serve normal static files
    return env.ASSETS.fetch(request);

  }

}