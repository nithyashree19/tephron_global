// Sends a website form to our Netlify Function (netlify/functions/contact.js),
// which emails it to the Tephron Global inbox. Throws a friendly Error if
// anything goes wrong so the form can show a real error instead of a fake
// success message.
const ENDPOINT = "/.netlify/functions/contact";

export const sendForm = async (payload) => {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("We couldn’t reach the server. Check your connection and try again.");
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || !data.ok) {
    // An HTML answer (not JSON) means the function itself did not run.
    if (!(res.headers.get("content-type") || "").includes("application/json")) {
      console.error(
        `[form] ${ENDPOINT} did not respond (status ${res.status}). ` +
          "Locally, run the site with `netlify dev`; in production, check that the Netlify " +
          "function deployed and that EMAIL_USER / EMAIL_APP_PASSWORD are set."
      );
      throw new Error(
        import.meta.env.DEV
          ? "The email function isn’t running here. Start the site with `netlify dev` (see .env.example), or test on the deployed site."
          : "Our message service is temporarily unavailable."
      );
    }
    throw new Error(
      data.error || "Something went wrong sending your message. Please try again."
    );
  }
  return data;
};

// File -> base64 string (no data: prefix), for the resume attachment.
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read your resume file."));
    reader.readAsDataURL(file);
  });
