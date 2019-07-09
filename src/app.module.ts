import { Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { CompressModule } from './modules/compress/compress.module';

@Module({
  imports: [CompressModule, UploadModule],
})
export class AppModule {}
