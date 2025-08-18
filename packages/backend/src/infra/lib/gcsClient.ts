import { Storage } from '@google-cloud/storage';

let storage: Storage;

if (process.env.NODE_ENV === 'development') {
  storage = new Storage({
    apiEndpoint: 'http://localhost:4443',
    projectId: 'local-project',
  });
} else {
  storage = new Storage();
}

export const gcsClient = storage;
export const bucketName = process.env.GCS_BUCKET_NAME || 'documentos-traducao';