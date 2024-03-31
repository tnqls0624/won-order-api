import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import sharp from 'sharp';
import { InjectionToken } from '../Injection-token';
import { UploadLogoImageCommand } from './upload-logo-image.command';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';
import { LogoRepository } from 'src/setting/domain/logo.repository';
import { LogoFactory } from 'src/setting/domain/logo.factory';
import path from 'path';

export interface ImageData {
  setting_id: number;
  hash: string;
  w120: string;
  w360: string;
}

@CommandHandler(UploadLogoImageCommand)
export class UploadLogoImageCommandHandler
  implements ICommandHandler<UploadLogoImageCommand>
{
  private s3: S3Client;
  private BUCKET_NAME = 'image-resize-bk';
  constructor(
    @Inject(InjectionToken.LOGO_REPOSITORY)
    private readonly logoRepository: LogoRepository,
    @Inject(InjectionToken.LOGO_FACTORY)
    private readonly logoFactory: LogoFactory
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION
    });
  }

  async execute(command: UploadLogoImageCommand) {
    const { filename, buffer, group_id } = command;
    const resize_image = await this.saveImage(filename, buffer);

    if (resize_image.exist === true) {
      await this.logoRepository.save(resize_image.image, group_id);
      return resize_image.image;
    }

    const image = this.logoFactory.create(resize_image.image as ImageData);
    return this.logoRepository.save(image, group_id);
  }

  async uploadToS3(
    buffer: Buffer,
    filename: string,
    content_type: string
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.BUCKET_NAME,
      AccelerateConfiguration: {
        Status: 'Enabled'
      },
      Key: filename,
      Body: buffer,
      ContentLength: buffer.length,
      ContentType: content_type
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    return `https://dq3eswfeko05a.cloudfront.net/${filename}`;
  }

  async resizeImage(buffer: Buffer, width: number): Promise<Buffer> {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const original_width = metadata.width || 1;
    const original_height = metadata.height || 1;

    if (original_width === width) {
      return buffer;
    }

    switch (width) {
      case 120: {
        const target_height_40 = 40;
        return image
          .resize(width, target_height_40, {
            fit: 'contain',
            position: 'center',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer();
      }
      case 360: {
        const target_height_120 = 120;
        if (original_width === width && original_height === target_height_120) {
          return buffer;
        }
        return image
          .resize(width, target_height_120, {
            fit: 'contain',
            position: 'center',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer();
      }
      default:
        throw new Error('Invalid width provided for resizing');
    }
  }

  async saveImage(filename: string, buffer: Buffer) {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing_image = await this.logoRepository.findByHash(hash);
    if (existing_image) {
      return { image: existing_image, exist: true };
    } else {
      const urls = {
        w120: '',
        w360: ''
      };
      const widths = [120, 360]; // Your target heights
      const extname = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      if (extname === '.jpeg' || extname === '.jpg') {
        contentType = 'image/jpeg';
      } else if (extname === '.png') {
        contentType = 'image/png';
      }
      const key = `${uuid()}.${mime.extension(contentType)}`;
      for (const width of widths) {
        const resized = await this.resizeImage(buffer, width);
        const image_url = await this.uploadToS3(
          resized,
          `i-order/w${width}/${key}`,
          contentType
        );

        switch (width) {
          case 120: {
            urls.w120 = image_url;
            break;
          }
          case 360: {
            urls.w360 = image_url;
            break;
          }
          default:
            throw new Error('Invalid height provided for resizing');
        }
      }

      return {
        image: { hash, w120: urls.w120, w360: urls.w360 },
        exist: false
      };
    }
  }
}
