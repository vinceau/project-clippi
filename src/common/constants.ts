import pkg from "../../package.json";

export const GITHUB_AUTHOR = "vinceau";

export const GITHUB_PAGE = `https://github.com/${GITHUB_AUTHOR}/${pkg.name}`;

export const GITHUB_RELEASES_PAGE = `${GITHUB_PAGE}/releases/latest`;

export const IS_DEV = process.env.NODE_ENV !== "production";

export const AUTO_UPDATES_ENABLED = process.platform === "win32" && !IS_DEV;

export const IS_MAC_OR_WIN = process.platform === "darwin" || process.platform === "win32";
