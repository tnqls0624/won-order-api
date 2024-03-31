import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { NoticeRepository } from '../../domain/notice.repository';
import * as crypto from 'crypto';
import { UploadImageCommand } from './upload-image.command';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';
import path from 'path';

@CommandHandler(UploadImageCommand)
export class UploadImageCommandHandler
  implements ICommandHandler<UploadImageCommand>
{
  private s3: S3Client;
  private BUCKET_NAME = 'image-resize-bk';
  constructor(
    @Inject(InjectionToken.NOTICE_REPOSITORY)
    private readonly noticeRepository: NoticeRepository
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION
    });
  }

  async execute(command: UploadImageCommand) {
    const { filename, buffer } = command;
    const image = await this.saveImage(filename, buffer);
    if (image.exist === true) {
      return image.image;
    }
    return this.noticeRepository.saveImage(image.image);
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

  async saveImage(filename: string, buffer: Buffer) {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing_image = await this.noticeRepository.findByHash(hash);
    if (existing_image) {
      return { image: existing_image, exist: true };
    } else {
      const extname = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      if (extname === '.jpeg' || extname === '.jpg') {
        contentType = 'image/jpeg';
      } else if (extname === '.png') {
        contentType = 'image/png';
      }
      const key = `${uuid()}.${mime.extension(contentType)}`;

      const url = await this.uploadToS3(
        buffer,
        `i-order/notice/${key}`,
        contentType
      );

      return {
        image: { hash, url },
        exist: false
      };
    }
  }
}
