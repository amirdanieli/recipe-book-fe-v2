import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as toStream from 'streamifier';

@Injectable()
export class ImagesService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload result is undefined'));
        resolve(result);
      });
      toStream.createReadStream(file.buffer).pipe(upload);
    });
  }
}
