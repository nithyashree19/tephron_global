// Admin sign-in (frontend only). The credentials are checked in the browser,
// so this keeps visitors out of the admin but is NOT secure: anyone who reads
// the site's code can find them. Move the check to a server before going live.
const ADMIN_EMAIL = "tephronglobal@gmail.com";
const ADMIN_PASSWORD = "admin@123";
const SESSION_KEY = "tephron-admin-session";

export const login = (email, password) => {
  const ok =
    email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (ok) {
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: ADMIN_EMAIL, at: Date.now() }));
    } catch {
      /* storage unavailable: the session simply will not persist */
    }
  }
  return ok;
};

export const logout = () => {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing to clear */
  }
};

export const isSignedIn = () => {
  try {
    return Boolean(window.sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
};
