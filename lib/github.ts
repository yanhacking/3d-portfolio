export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  path: string;
}

function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function encodeUtf8Base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export class GitHubApiError extends Error {}

async function githubRequest(url: string, token: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new GitHubApiError(body.message || `Erreur GitHub API (${res.status})`);
  }
  return res.json();
}

export async function verifyAccess(config: Pick<GitHubConfig, 'owner' | 'repo' | 'token'>) {
  await githubRequest(`https://api.github.com/repos/${config.owner}/${config.repo}`, config.token);
}

export async function fetchContentFile<T = unknown>(
  config: GitHubConfig
): Promise<{ json: T; sha: string }> {
  const data = await githubRequest(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${encodeURIComponent(config.branch)}`,
    config.token
  );
  const text = decodeBase64Utf8(data.content);
  return { json: JSON.parse(text) as T, sha: data.sha as string };
}

export async function saveContentFile(
  config: GitHubConfig,
  content: unknown,
  sha: string,
  message: string
): Promise<{ sha: string }> {
  const encoded = encodeUtf8Base64(JSON.stringify(content, null, 2) + '\n');
  const data = await githubRequest(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`,
    config.token,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encoded,
        sha,
        branch: config.branch,
      }),
    }
  );
  return { sha: data.content.sha as string };
}
