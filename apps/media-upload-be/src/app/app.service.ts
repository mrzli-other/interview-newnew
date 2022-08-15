import { HttpException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, parse } from 'path';
import { v4 as uuid } from 'uuid';
import * as sharp from 'sharp';

type File = Express.Multer.File;

@Injectable()
export class AppService {
  async uploadFile(file: File): Promise<readonly string[]> {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return handleImage(file);
    } else if (['video/mp4'].includes(file.mimetype)) {
      return handleVideo(file);
    } else {
      throw new HttpException(`Invalid File Type: '${file.mimetype}'`, 400);
    }
  }
}

async function handleImage(file: File): Promise<readonly string[]> {
  const serverPath = getServerFilePath(file.originalname);
  await saveFile(serverPath, file.buffer);

  const serverPathThumb = getServerFilePath(file.originalname, true);
  const thumbImage = await sharp(file.buffer).resize(100).toBuffer();
  await saveFile(serverPathThumb, thumbImage);

  return [getFileLink(serverPath), getFileLink(serverPathThumb)];
}

async function handleVideo(file: File): Promise<readonly string[]> {
  const serverPath = getServerFilePath(file.originalname);
  await saveFile(serverPath, file.buffer);
  return [getFileLink(serverPath)];
}

function getServerFilePath(
  originalName: string,
  isThumbnail?: boolean
): string {
  const pathSegments = parse(originalName);
  return [
    pathSegments.name,
    '_',
    uuid(),
    isThumbnail ? '_thumb' : '',
    pathSegments.ext,
  ].join('');
}

async function saveFile(filePath: string, content: Buffer): Promise<void> {
  await fs.writeFile(join('data', filePath), content);
}

function getFileLink(name: string): string {
  // hardcoded url :)
  return `http://localhost:3333/media/${name}`;
}
