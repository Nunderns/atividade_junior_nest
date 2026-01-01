import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  constructor(private readonly config: ConfigService) {}

  async uploadFile(buffer: Buffer, filename: string, contentType: string) {
    const provider = (this.config.get<string>('STORAGE_PROVIDER') || '').toLowerCase();
    const useLocal = this.config.get<string>('USE_LOCAL_UPLOAD') === 'true';
    if (provider === 's3' && !useLocal) {
      const s3Url = await this.uploadToS3(buffer, filename, contentType);
      if (s3Url) {
        return { url: s3Url };
      }
      this.logger.warn('Falling back to local storage for receipt upload.');
    }
    const localUrl = await this.uploadToLocal(buffer, filename);
    return { url: localUrl };
  }

  private async uploadToLocal(buffer: Buffer, filename: string) {
    const uploadsPath = this.config.get<string>('UPLOADS_PATH') || 'uploads';
    await mkdir(uploadsPath, { recursive: true });
    const filepath = join(uploadsPath, `${Date.now()}-${filename}`);
    await writeFile(filepath, buffer);
    const url = `http://localhost:${this.config.get('PORT') || 3000}/${filepath.replace(/\\/g, '/')}`;
    this.logger.log(`Saved file locally: ${filepath}`);
    return url;
  }

  private async uploadToS3(buffer: Buffer, filename: string, contentType: string) {
    const bucket = this.config.get<string>('S3_BUCKET');
    const region = this.config.get<string>('AWS_REGION');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      this.logger.warn('Missing AWS credentials or bucket configuration.');
      return null;
    }
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    const key = `comprovantes/${Date.now()}-${filename}`;
    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
    });
    const result = await upload.done();
    const url = (result as { Location?: string }).Location;
    return url || `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
