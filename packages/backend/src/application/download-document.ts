import { DownloadedFile, StorageProvider } from "./providers/storage-provider";

interface ExecuteParams {
  fileKey: string;
}

export class DownloadDocument {
  constructor(private storage: StorageProvider) {}

  async execute({ fileKey }: ExecuteParams): Promise<DownloadedFile> {
    const downloadedFile = await this.storage.download(fileKey);

    return downloadedFile;
  }
}
