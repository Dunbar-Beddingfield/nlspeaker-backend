import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadBase64(base64DataUrl: string, folder: string): Promise<string> {
    if (!base64DataUrl.match(/^data:[^;]+;base64,.+$/s)) {
      throw new BadRequestException(
        'Invalid format. Expected a base64 data URL (data:<mime>;base64,<data>).',
      );
    }

    const result = await cloudinary.uploader.upload(base64DataUrl, {
      folder: `nlspeaker/${folder}`,
      resource_type: 'auto',
    });

    this.logger.log(`Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  }

  async deleteByUrl(url: string) {
    if (!url.includes('cloudinary.com')) return;

    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!match) {
      this.logger.warn(`Could not parse Cloudinary public_id from: ${url}`);
      return;
    }

    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId).catch((err: Error) => {
      this.logger.warn(`Could not delete Cloudinary asset ${publicId}: ${err.message}`);
    });
  }
}
