// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      if (file && file.buffer) {
        console.log("file upload", file)
        const readableStream = Readable.from(file.buffer); // Create readable stream from buffer
        readableStream.pipe(uploadStream);
      } else {
        reject(new Error('File or buffer is missing.'));
      }
    });
  }
  uploadMultipleFiles(files: Express.Multer.File[]): Promise<CloudinaryResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}
