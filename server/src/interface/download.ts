import { Request, Response } from 'express';
import { FileManager } from '../infrastructure/file-manager';

export const downloadController = (req: Request, res: Response) => {
  const { filename } = req.params;
  const fileManager = new FileManager();

  fileManager.downloadFile(filename, res);
};
