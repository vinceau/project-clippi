import { Octokit } from "@octokit/rest";

import semver from "semver";

const octokit = new Octokit();

export const getLatestVersion = async (owner: string, repo: string): Promise<string> => {
  const release = await octokit.repos.getLatestRelease({ owner, repo });
  return release.data.tag_name;
};

export const updateAvailable = async (owner: string, repo: string): Promise<boolean> => {
  const latestVersion = await getLatestVersion(owner, repo);
  return needsUpdate(latestVersion);
};

export const needsUpdate = (latestVersion: string): boolean => {
  try {
    return semver.lt(__VERSION__, latestVersion);
  } catch (err) {
    console.error(err);
    return false;
  }
};
