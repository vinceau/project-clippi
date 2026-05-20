import semver from "semver";

import pkg from "../../package.json";
import { getLatestRelease } from "./github";

/**
 * Returns the latest version on Github.
 *
 * The version string without a v prefix. e.g. 1.2.3
 * @export
 * @param {string} owner The owner of the repo
 * @param {string} repo The repo name
 * @returns {Promise<string>}
 */
export async function getLatestVersion(owner: string, repo: string): Promise<string> {
  const release = await getLatestRelease(owner, repo);
  const version = release.tag_name;
  return semver.clean(version) as string;
}

export async function updateAvailable(owner: string, repo: string): Promise<boolean> {
  const latestVersion = await getLatestVersion(owner, repo);
  return needsUpdate(latestVersion);
}

export function needsUpdate(latestVersion: string): boolean {
  try {
    return semver.lt((pkg as any).version, latestVersion);
  } catch (err) {
    console.error(err);
    return false;
  }
}
