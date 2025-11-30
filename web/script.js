async function upload() {
  const fileInput = document.getElementById("inoFile");
  if (!fileInput.files.length) return alert("Pilih file .ino dulu");

  const file = fileInput.files[0];

  const base64 = await file.arrayBuffer().then(b => btoa(String.fromCharCode(...new Uint8Array(b))));

  const repo = "Dhans62/esp32-online-compiler";

  // Upload file ke branch input
  await fetch(`https://api.github.com/repos/${repo}/contents/input/${file.name}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "upload sketch",
      content: base64,
      branch: "input"
    })
  });

  alert("Uploaded! Workflow sedang berjalan...");
  loadArtifacts();
}

async function loadArtifacts() {
  const repo = "Dhans62/esp32-online-compiler";

  const res = await fetch(`https://api.github.com/repos/${repo}/actions/artifacts`);
  const data = await res.json();

  let html = "";
  data.artifacts.forEach(a => {
    html += `<p><a href="${a.archive_download_url}">${a.name} (download)</a></p>`;
  });

  document.getElementById("artifacts").innerHTML = html;
}

loadArtifacts();
