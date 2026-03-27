const REPO = 'SaiAkashNeela/bucketstack';
const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
}

export const releaseService = {
  async getLatestRelease(): Promise<GitHubRelease | null> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO}/releases/latest`,
        { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
      );

      if (!response.ok) {
        console.error('Failed to fetch latest release:', response.status);
        return null;
      }

      return (await response.json()) as GitHubRelease;
    } catch (error) {
      console.error('Error fetching latest release:', error);
      return null;
    }
  },

  async getDownloadLinks() {
    const release = await this.getLatestRelease();

    if (!release) {
      return {
        version: null,
        macos: RELEASES_PAGE,
        windows: RELEASES_PAGE,
        linux: RELEASES_PAGE,
      };
    }

    const assets = release.assets;
    const version = release.tag_name.replace(/^v/, '');

    const dmg = assets.find((a) => a.name.endsWith('.dmg'))?.browser_download_url;
    const exe = assets.find((a) => a.name.endsWith('.exe'))?.browser_download_url;
    const linuxTag = `https://github.com/${REPO}/releases/tag/${release.tag_name}`;

    return {
      version,
      macos: dmg ?? RELEASES_PAGE,
      windows: exe ?? RELEASES_PAGE,
      linux: linuxTag,
    };
  },
};
