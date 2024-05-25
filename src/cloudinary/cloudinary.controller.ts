// app.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Image-Test')
@Controller('image')
export class AppController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file', // Description for Swagger
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary', // Specify the format as binary
                    description: 'Image file', // Description for Swagger
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }


    @Post('multiple')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload multiple image files' })
    @ApiBody({
        description: 'Multiple image files',
        schema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
                description: 'Image file',
              },
            },
          },
        },
      })
    @ApiResponse({ status: 200, description: 'Successfully uploaded files.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
        try {
            const uploadResults = await this.cloudinaryService.uploadMultipleFiles(files);
            return { success: true, data: uploadResults };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

}

