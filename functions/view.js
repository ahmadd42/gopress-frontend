export async function onRequest(context) {

  const url = new URL(context.request.url);

  // Read query parameter
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Missing document ID", {
      status: 400
    });
  }

  // Fetch document metadata
  const apiRes = await fetch(
    `https://i-press-backend-production.up.railway.app/files/gettitleanddes`,
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentid: id
        })
      }
  );

  const doc = await apiRes.json();

  if (!doc) {
    return new Response("Document not found", {
      status: 404
    });
  }

  // 2. load HTML template file
  const templateRes = await fetch(
    "https://gopress.online/view/index.html"
  );

  let html = await templateRes.text();

  // 3. inject dynamic SEO data
  html = html
    .replace(/__TITLE__/g, doc.title)
    .replace(/__DESCRIPTION__/g, doc.descr)
    .replace(/__MYURL__/g, url);


  // Generate SEO HTML
/*  const html = `
<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8">

  <title>${doc.title} – goPress</title>

  <meta name="description"
        content="${doc.descr}">

  <meta name="robots"
        content="index, follow">

  <script src="/assets/view.min.js"
          defer></script>

</head>

<body>

  <div id="app"></div>

</body>
</html>
`;*/

  return new Response(html, {
    headers: {
      "Content-Type": "text/html"
    }
  });
}