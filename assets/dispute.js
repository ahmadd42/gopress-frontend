const dispute_form = document.getElementById("dispute_form");
const urlParams = new URLSearchParams(window.location.search);
const success = document.getElementById("successModal");
const home_btn = document.getElementById("home_btn");
const id = urlParams.get('id');

document.getElementById("con-id").innerText = id;

async function handlePost(event) {

  event.preventDefault(); // stop form from reloading the page

  const btn = document.getElementById("report_btn");
  const con_id = document.getElementById("con-id").value;
  const email = document.getElementById("email").value;
  const disp_cat = document.getElementById("disp-cat").value;
  const details = document.getElementById("details").value;


  btn.textContent = ". . . . . .";
  btn.disabled = true;

  const disputeData = {
    email: email,
    details: details,
    disp_type: disp_cat,
    content_id: id
  };

  try {
    const res = await fetch("https://i-press-backend-production.up.railway.app/files/adddispute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(disputeData)
    });

    if (res.status === 200) {
        success.style.display = "flex";
    }
  } catch (err) {
    console.error("Login error:", err);
    //errorMsg.textContent = "Network error.";
  }
}

function backHome() {
    window.location.href = "/";
}

dispute_form.addEventListener("submit", handlePost);
home_btn.addEventListener("click", backHome);