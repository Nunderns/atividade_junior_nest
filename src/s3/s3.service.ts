import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  constructor(private readonly config: ConfigService) {}

  async uploadFile(buffer: Buffer, filename: string, contentType: string) {
    const useLocal = this.config.get<string>('USE_LOCAL_UPLOAD') === 'true';
    if (useLocal) {
      const uploadsPath = this.config.get<string>('UPLOADS_PATH') || 'uploads';
      await mkdir(uploadsPath, { recursive: true });
      const filepath = join(uploadsPath, `${Date.now()}-${filename}`);
      await writeFile(filepath, buffer);
      const url = `http://localhost:${this.config.get('PORT') || 3000}/${filepath.replace(/\\/g, '/')}`;
      this.logger.log(`Saved file locally: ${filepath}`);
      return { url };
    }

    // TODO: Implement AWS S3 upload if credentials are present. For now, fallback to local.
    this.logger.warn('AWS S3 not implemented; falling back to local storage');
    const uploadsPath = this.config.get<string>('UPLOADS_PATH') || 'uploads';
    await mkdir(uploadsPath, { recursive: true });
    const filepath = join(uploadsPath, `${Date.now()}-${filename}`);
    await writeFile(filepath, buffer);
    const url = `http://localhost:${this.config.get('PORT') || 3000}/${filepath.replace(/\\/g, '/')}`;
    return { url };
  }
}
