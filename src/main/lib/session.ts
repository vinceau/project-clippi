import { Cookie, Filter, session } from "electron";

// Based on: stackoverflow.com/questions/41314826/delete-all-cookies-in-electron-desktop-app
const deleteCookie = async (cookie: Cookie): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sesh = session.defaultSession;
    if (!sesh) {
      reject(new Error("No default session exists"));
    } else {
      let url = "";
      // get prefix, like https://www.
      url += cookie.secure ? "https://" : "http://";
      url += cookie.domain && cookie.domain.charAt(0) === "." ? "www" : "";
      // append domain and path
      url += cookie.domain;
      url += cookie.path;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sesh.cookies.remove(url, cookie.name, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
};

const fetchCookies = async (filter?: Filter): Promise<Cookie[]> => {
  return new Promise((resolve, reject) => {
    const sesh = session.defaultSession;
    if (sesh) {
      sesh.cookies.get(filter || {}, (err, cookies) => {
        if (err) {
          reject(err);
        } else {
          resolve(cookies);
        }
      });
    } else {
      resolve([]);
    }
  });
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
