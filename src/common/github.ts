import { Preconditions } from "./preconditions";
import { TimeExpiryCache } from "./time_expiry_cache";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const EXPIRES_IN = 15 * MINUTE;

export type GithubReleaseInfo = {
  id: number;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  tag_name: string;
};

type ApiRateLimitError = {
  message: string;
  documentation_url: string;
};

type CachedGithubResponse = {
  etag?: string;
  data: GithubReleaseInfo | ApiRateLimitError;
};

// Cache successful responses + ETags
const githubResponseCache = new TimeExpiryCache<string, CachedGithubResponse>(EXPIRES_IN);

// Prevent duplicate simultaneous requests
const inflightRequests = new Map<string, Promise<GithubReleaseInfo | ApiRateLimitError>>();

export async function getLatestRelease(owner: string, repo: string): Promise<GithubReleaseInfo> {
  // We can re-use api calls by returning the first item in all releases
  // since it already returns the newest release first.
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

  const data = await cachedFetch(url);

  Preconditions.checkState((data as ApiRateLimitError).message == null, (data as ApiRateLimitError).message);

  return data as GithubReleaseInfo;
}

async function cachedFetch(url: string): Promise<GithubReleaseInfo | ApiRateLimitError> {
  // Reuse in-flight requests to avoid duplicate concurrent fetches.
  const existingRequest = inflightRequests.get(url);

  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = (async () => {
    const cached = githubResponseCache.get(url);

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };

    // Optional authenticated requests for higher rate limits.
    // Unauthenticated: 60 req/hr
    // Authenticated: 5000 req/hr
    const githubToken = process.env.GITHUB_TOKEN;

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    // Ask Github if our cached version is still valid.
    if (cached?.etag) {
      headers["If-None-Match"] = cached.etag;
    }

    const res = await fetch(url, {
      headers,
    });

    // Github says our cached data is still valid.
    if (res.status === 304 && cached) {
      return cached.data;
    }

    const response = (await res.json()) as GithubReleaseInfo | ApiRateLimitError;

    // Only cache successful responses.
    // Avoid caching temporary rate-limit errors.
    if (res.ok) {
      githubResponseCache.set(url, {
        etag: res.headers.get("etag") ?? undefined,
        data: response,
      });
    }

    return response;
  })();

  inflightRequests.set(url, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inflightRequests.delete(url);
  }
}
