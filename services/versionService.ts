import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export const versionService = {
  async checkForUpdate(): Promise<Update | null> {
    try {
      const update = await check();
      return update ?? null;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  },

  async installAndRelaunch(
    update: Update,
    onProgress?: (downloaded: number, total: number | undefined) => void
  ): Promise<void> {
    let downloaded = 0;
    let total: number | undefined;
    await update.downloadAndInstall((event) => {
      if (event.event === 'Started') {
        total = event.data.contentLength;
      } else if (event.event === 'Progress' && onProgress) {
        downloaded += event.data.chunkLength;
        onProgress(downloaded, total);
      }
    });
    await relaunch();
  },
};
