import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CompressService } from './modules/compress/compress.service';
import * as readline from 'readline';
import * as fs from 'fs';

async function bootstrap() {
  
  
  const app = await NestFactory.create(AppModule);

  const compressor = app.get(CompressService);
  compressor.compressDirectories();

  
}
bootstrap();
