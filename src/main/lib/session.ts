import { Cookie, session, CookiesGetFilter } from "electron";

// Based on: stackoverflow.com/questions/41314826/delete-all-cookies-in-electron-desktop-app
const deleteCookie = async (cookie: Cookie): Promise<void> => {
  const sesh = session.defaultSession;
  let url = "";
  // get prefix, like https://www.
  url += cookie.secure ? "https://" : "http://";
  url += cookie.domain && cookie.domain.charAt(0) === "." ? "www" : "";
  // append domain and path
  url += cookie.domain;
  url += cookie.path;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sesh.cookies.remove(url, cookie.name);
};

const fetchCookies = async (filter?: CookiesGetFilter): Promise<Cookie[]> => {
  const sesh = session.defaultSession;
  return sesh.cookies.get(filter || ({} as CookiesGetFilter));
};

export const clearAllCookies = async (domain?: string): Promise<void> => {
  const cookies = await fetchCookies();
  for (const cookie of cookies) {
    // Skip if we're only clearing certain cookies
    if (domain && (!cookie.domain || !cookie.domain.includes(domain))) {
      continue;
    }
    await deleteCookie(cookie);
  }
};
