import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import sharp from 'sharp';
import { ImageFactory } from 'src/menu/domain/image.factory';
import { ImageRepository } from 'src/menu/domain/image.repository';
import { InjectionToken } from '../Injection-token';
import { UploadMenuImageCommand } from './upload-menu-image.command';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';
import path from 'path';

export interface ImageData {
  hash: string;
  w360: string;
  w130: string;
  w120: string;
}

@CommandHandler(UploadMenuImageCommand)
export class UploadMenuImageCommandHandler
  implements ICommandHandler<UploadMenuImageCommand>
{
  private s3: S3Client;
  private BUCKET_NAME = 'image-resize-bk';
  constructor(
    @Inject(InjectionToken.IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    @Inject(InjectionToken.IMAGE_FACTORY)
    private readonly imageFactory: ImageFactory
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION
    });
  }

  async execute(command: UploadMenuImageCommand) {
    const { filename, buffer } = command;
    const resize_image = await this.saveImage(filename, buffer);
    if (resize_image.exist === true) {
      return resize_image.image;
    }
    const image = this.imageFactory.create(resize_image.image as ImageData);
    return this.imageRepository.save(image);
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

    // 이미지의 원래 크기와 비율을 확인
    const original_width = metadata.width || 1;
    const original_height = metadata.height || 1;
    const aspect_ratio = original_width / original_height;
    let new_width: number = 0;
    let new_height: number = 0;

    // 가장 긴 쪽을 기준으로 비율 계산
    if (original_width >= original_height) {
      new_width = width;
      new_height = Math.round(new_width / aspect_ratio);
    } else {
      new_height = width;
      new_width = Math.round(new_height * aspect_ratio);
    }
    let target_height: number;
    switch (width) {
      case 120: {
        target_height = 100;
        break;
      }
      case 130: {
        target_height = 115;
        break;
      }
      case 360: {
        target_height = 160;
        break;
      }
      default:
        throw new Error('Invalid width provided for resizing');
    }
    return image
      .resize(new_width, new_height, {
        fit: 'fill'
      })
      .extend({
        top: Math.max(0, Math.round((target_height - new_height) / 2)),
        bottom: Math.max(0, Math.round((target_height - new_height) / 2)),
        left: Math.max(0, Math.round((width - new_width) / 2)),
        right: Math.max(0, Math.round((width - new_width) / 2)),
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();
  }

  async saveImage(filename: string, buffer: Buffer) {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing_image = await this.imageRepository.findByHash(hash);
    if (existing_image) {
      return { image: existing_image, exist: true };
    } else {
      const urls = {
        w360: '',
        w130: '',
        w120: ''
      };
      const widths = [360, 130, 120];
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
        const imageUrl = await this.uploadToS3(
          resized,
          `i-order/w${width}/${key}`,
          contentType
        );

        switch (width) {
          case 360: {
            urls.w360 = imageUrl;
            break;
          }
          case 130: {
            urls.w130 = imageUrl;
            break;
          }
          case 120: {
            urls.w120 = imageUrl;
            break;
          }
          default:
            throw new Error('Invalid width provided for resizing');
        }
      }
      return {
        image: { hash, w360: urls.w360, w130: urls.w130, w120: urls.w120 },
        exist: false
      };
    }
  }
}
