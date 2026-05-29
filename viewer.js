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
          "https://i-press-backend-production.up.railway.app/files/getbasicinfo",
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
        const des = item.descr;
        const extension = item.extension;
        const dld_status = item.downloadable;
        const isTruncated = des.length > 300;
        const shortText = des.slice(0, 300);
        const docURL = `https://content.gopress.online/content/${match[1]}${extension}`;
        const view_html = generateViewerHTML(docURL, extension, dld_status);


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
          des || "Document Viewer"
        );

        html = html.replace(
          /__UPLOADER__/g,
          item?.disp_name || "Not Available"
        );

        html = html.replace(
          /__VIEWERHTML__/g,
          view_html || "Not Available"
        );


        // Optional canonical URL
        html = html.replace(
          /__CANONICAL__/g,
          `https://gopress.online/viewer/${match[1]}/${match[2]}`
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

async function fetchDocument(id) {  

  //fetch('http://192.168.0.106:3000/files/getbasicinfo', {
  fetch('https://i-press-backend-production.up.railway.app/files/getbasicinfo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contentid: id
  })
})
.then(response => (response.json())

)
.then(data => {
//document.getElementById("doc-panel").innerHTML = data[0].ext + "    " + data[0].can_download;
const extension = data[0].extension;
const dld_status = data[0].downloadable;
const uploader = data[0].disp_name;
const title = data[0].title;
const des = data[0].descr;
const isTruncated = des.length > 300;
const shortText = des.slice(0, 300);
//const docURL = `http://localhost:3000/files/getContent/${value}${extension}/${screen}`;

docURL = `https://content.gopress.online/content/${id}${extension}`;

document.getElementById("doc-view-panel").innerHTML = generateViewerHTML(docURL, extension, dld_status);
document.getElementById("con_title").innerText = title;
document.title = title;
document.getElementById("uploader").innerText = uploader;
document.getElementById("desc-box").innerHTML = `
<span id="descr">
${isTruncated ? shortText + '...' : des}
</span>
${isTruncated ? '<a href="#" id="toggle-link">Read more</a>' : ''}
`;

    if (isTruncated) {
    const toggleLink = document.getElementById('toggle-link');
    const textSpan = document.getElementById('descr');

    toggleLink.addEventListener('click', function (e) {
      e.preventDefault();
      textSpan.style.opacity = 0;
      toggleLink.style.opacity = 0;
      setTimeout(() => {
      const isExpanded = toggleLink.textContent === 'Read less';
      textSpan.textContent = isExpanded ? shortText + '...' : des;
      toggleLink.textContent = isExpanded ? 'Read more' : 'Read less';
      textSpan.style.opacity = 1;
      toggleLink.style.opacity = 1;
      }, 200); // match the transition 

    });
  }

})
.catch(error => {
  console.error('Error:', error);
});
}

function generateViewerHTML(path, ext, d_status) {
var viewer_html = "";

if(ext === ".pdf") {
viewer_html = `<iframe id="docViewer" class="doc-viewer pdf-frame" src="../web/viewer.html?file=${path}" frameborder="0" oncontextmenu="return false"></iframe>`;
}
else if(ext === ".jpg" || ext === ".jpeg" || ext === ".gif" || ext === ".png" || ext === ".tiff") {

viewer_html = `<div id="viewerContainer" style="margin-top:10px; padding-left: 1.5em; width:82%; 
height:75%;"><img id="docViewer" src="${path}" style="width:100%;"`;

viewer_html += (d_status === 0) ? ` oncontextmenu="return false"></div>` : `></div>`;
}

else if(ext === ".mp3" || ext === ".mp4" || ext === ".mpeg") {

viewer_html = (screen === "small") ? `<div class="video-wrapper-mobile"><video id="myVideo" controls` : `<div class="video-wrapper"><video id="myVideo" controls`;
viewer_html += (d_status === 0) ? ` controlsList="nodownload" oncontextmenu="return false"` : ``;  
viewer_html += ` autoplay><source src="${path}" type="video/mp4"></video></div>`;
}

return viewer_html;
}
