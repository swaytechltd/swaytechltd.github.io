// Paste a Google Forms share or embed URL here when it is ready.
const GOOGLE_FORM_URL = "";
const GOOGLE_FORM_EMBED_URL = "";

const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const formMount = document.querySelector("#formMount");

function getGoogleFormEmbedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.pathname.includes("/viewform")) {
      url.searchParams.set("embedded", "true");
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function renderGoogleForm() {
  if (!formMount) {
    return;
  }

  const formUrl = GOOGLE_FORM_EMBED_URL || GOOGLE_FORM_URL;
  if (!formUrl) {
    return;
  }

  formMount.innerHTML = "";

  const frame = document.createElement("iframe");
  frame.className = "google-form-frame";
  frame.title = "Consultation request form";
  frame.src = getGoogleFormEmbedUrl(formUrl);
  frame.loading = "lazy";

  formMount.append(frame);
}

renderGoogleForm();
