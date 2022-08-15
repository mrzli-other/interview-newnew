import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // file validations and constraints (for example accepted file types)
  // can be done using techniques described at https://docs.nestjs.com/techniques/file-upload#file-validation
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<readonly string[]> {
    return this.appService.uploadFile(file);
  }

  @Post('upload-files')
  @UseInterceptors(FilesInterceptor('files[]'))
  uploadFiles(@UploadedFiles() files: readonly Express.Multer.File[]) {
    console.log(files);
  }
}
