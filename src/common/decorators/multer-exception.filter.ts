import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs/promises';

@Catch(BadRequestException)
export class MulterExceptionFilter implements ExceptionFilter {
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Agar fayl yuklangan bo'lsa, uni o'chiramiz
    const file = (request as any).file;
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
        console.log(`Fayl o'chirildi: ${file.path}`);
      } catch (err) {
        console.error(`Faylni o'chirishda xato: ${err}`);
      }
    }

    // Xato javobini qaytaramiz
    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      errors: exception.getResponse(),
    });
  }
}
