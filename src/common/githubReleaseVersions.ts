import { Octokit } from "@octokit/rest";

import pkg from "../../package.json";
import semver from "semver";

const octokit = new Octokit();

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
  const release = await octokit.repos.getLatestRelease({ owner, repo });
  const version = release.data.tag_name;
  return semver.clean(version) as string;
}

export async function updateAvailable(owner: string, repo: string): Promise<boolean> {
  const latestVersion = await getLatestVersion(owner, repo);
  return needsUpdate(latestVersion);
}

export function needsUpdate(latestVersion: string): boolean {
  try {
    return semver.lt(pkg.version, latestVersion);
  } catch (err) {
    console.error(err);
    return false;
  }
}
