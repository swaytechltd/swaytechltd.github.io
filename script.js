// Use the published Google Forms URL; short share links open in a new tab.
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfnAN0Al8dOSeCmjSAV1cAknUiJ3XSVH4T_1TSKi7hAv3O6gQ/viewform";
const GOOGLE_FORM_EMBED_URL = "";
const GOOGLE_FORM_ENABLED = true;

const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const emailEnquiry = document.querySelector("#emailEnquiry");
const enquiryContext = document.querySelector("#enquiryContext");

for (const link of document.querySelectorAll("[data-service]")) {
  link.addEventListener("click", () => {
    if (!emailEnquiry || !enquiryContext) return;

    const service = link.dataset.service;
    const isPaid = Boolean(link.dataset.consultation);
    const consultation = isPaid
      ? "Paid engagement (quote requested)"
      : "Free introductory call (15-30 minutes)";
    const terms = isPaid
      ? "Scope and fees are agreed before paid work begins."
      : "Your first call is free: 15 minutes, up to 30 if needed.";
    const heading = document.querySelector("#formMount h3");
    if (heading) {
      heading.textContent = isPaid ? "Request a quote" : "Request your free consultation";
    }
    const subject = "Swaytech Consultancy - " + service;
    const body = [
      "Name: ",
      "Organisation: ",
      "Site location: ",
      "Support needed: " + service,
      "Consultation: " + consultation,
      "Project details: ",
      "Preferred meeting times: ",
    ].join("\n");

    emailEnquiry.href = "mailto:swaytechltd@gmail.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    enquiryContext.textContent = "Enquiry: " + service + ". " + terms +
      " Include your site location, project details and preferred meeting times.";
  });
}

function getGoogleFormUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return null;
    if (url.hostname === "forms.gle") {
      return { href: url.href, embeddable: false };
    }
    if (url.hostname !== "docs.google.com" ||
        !/^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[^/]+\/viewform\/?$/.test(url.pathname)) {
      return null;
    }
    url.searchParams.set("embedded", "true");
    return { href: url.href, embeddable: true };
  } catch {
    return null;
  }
}

function renderGoogleForm() {
  if (!GOOGLE_FORM_ENABLED) return;
  const formMount = document.querySelector("#formMount");
  const form = getGoogleFormUrl(GOOGLE_FORM_EMBED_URL || GOOGLE_FORM_URL);
  if (!formMount || !form) return;

  const heading = document.createElement("h3");
  heading.textContent = "Request your free consultation";

  const formLink = document.createElement("a");
  const linkUrl = new URL(form.href);
  linkUrl.searchParams.delete("embedded");
  formLink.href = linkUrl.href;
  formLink.target = "_blank";
  formLink.rel = "noopener noreferrer";
  formLink.setAttribute("aria-label", "Open consultation form (opens in a new tab)");
  formLink.className = "button primary full-width";
  formLink.textContent = "Open consultation form";

  // Keep an external link available when an embedded form cannot load.
  formMount.replaceChildren(heading);
  if (enquiryContext) formMount.append(enquiryContext);
  formMount.append(formLink);
  if (form.embeddable) {
    const frame = document.createElement("iframe");
    frame.className = "google-form-frame";
    frame.title = "Consultation request form";
    frame.src = form.href;
    frame.loading = "lazy";
    formMount.append(frame);
  }

  if (emailEnquiry) {
    const emailAlternative = document.createElement("p");
    emailAlternative.className = "contact-alternative";
    emailEnquiry.className = "text-link";
    emailAlternative.append(emailEnquiry);
    formMount.append(emailAlternative);
  }
}

renderGoogleForm();
